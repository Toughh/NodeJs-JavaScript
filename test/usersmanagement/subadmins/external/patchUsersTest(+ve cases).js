/**
 * Import required packages
 */
 require('mocha')
 require('../../../../common/util/testrail-util')
 
 var config = require('config')
 var assert = require('chai').assert
 
 const requests = require('../../../../common/setup/request')
 const applicationsPayload = require('../../../../common/datasource/createApplication')
 const usersPayload = require('../../../../common/datasource/createUser')
 
 const common_utils = require('../../../../common/util/commonUtils')
 
 const timeout = config.get('timeout')
 
 describe.skip('PATCH users (+ve) - Verify success response *end-to-end*', function () {
 
     this.timeout(timeout)
     let group_name, sub_group_name
     let app_requestBody1, app_requestBody2, user_requestBody1, user_requestBody2
     let admin_id = config.get('admin.corp_id')
     let userName = config.get('admin.username')
     let app_id1, app_id2, customer_key1, customer_key2
     let res
 
     before(async function () {
         try {
 
             group_name = "My Account\\Avijit Test Automation"
             sub_group_name = "My Account\\Avijit Test Automation\\Child Group Test"
 
             app_requestBody1 = applicationsPayload.postApplications(admin_id, group_name)
             res = await requests.postApplications(app_requestBody1)
             app_id1 = res.body.app_id
             console.log("app_id is " + app_id1)
 
             app_requestBody2 = applicationsPayload.postApplications(admin_id, sub_group_name)
             res = await requests.postApplications(app_requestBody2)
             app_id2 = res.body.app_id
             console.log("app_id is " + app_id2)
 
             user_requestBody1 = usersPayload.postUsers(app_id1, group_name)
             user_requestBody1.user.email_address = common_utils.randEmail()
             res = await requests.postUsers(user_requestBody1, userName, admin_id)
             customer_key1 = res.body.fax_numbers[0].customer_key
 
             user_requestBody2 = usersPayload.postUsers(app_id2, sub_group_name)
             user_requestBody2.user.email_address = common_utils.randEmail()
             res = await requests.postUsers(user_requestBody2, userName, admin_id)
             customer_key2 = res.body.fax_numbers[0].customer_key
 
         } catch (e) {
             console.log(e)
             console.log(res.body)
         }
     })
 
     it('C38825: PATCH > Users >  Validate SUCCESS when patching a user belonging to subadmins group', async function () {
         res = await requests.patchUsersCustomerKey(customer_key1, user_requestBody1, admin_id)
         assert.equal(res.statusCode, 200, 'Actual status code is ' + res.statusCode)
     })
 
     it('C38827: PATCH > Users > Validate SUCCESS when patching a user belonging to subadmins subgroup', async function () {
         res = await requests.patchUsersCustomerKey(customer_key2, user_requestBody2, admin_id)
         assert.equal(res.statusCode, 200, 'Actual status code is ' + res.statusCode)
     })
 
     after(async function () {
         await requests.delApplications(app_id2, app_requestBody2)
         await requests.delApplications(app_id1, app_requestBody1)
     })
 })