/**
 * Import required packages
 */
 require('mocha')
 require('../../common/util/testrail-util')
 
 var config = require('config')
 var assert = require('chai').assert
 
 const requests = require('../../common/setup/request')
 const applicationsPayload = require('../../common/datasource/createApplication')
 const usersPayload = require('../../common/datasource/createUser')
 const editUserPayload = require('../../common/datasource/editUser')
 const common_utils = require('../../common/util/commonUtils')
 
 const timeout = config.get('timeout')
 
 describe('Patch Users (-) - Verify user by customer key response *end-to-end*', function () {
     this.timeout(timeout)
     let group_name
     let app_requestBody, user_requestBody, patchUser_requestBody
     let app_id
     let admin_id = config.get('admin.corp_id')
     let userName = config.get('admin.username')
     let customer_key, fax_number
     let first_name
     let res
 
     before(async function () {
         try {
             group_name = "My Account\\Avijit Test Automation"
             app_requestBody = applicationsPayload.postApplications(admin_id, group_name)
 
             res = await requests.postApplications(app_requestBody)
             app_id = res.body.app_id
             console.log("app_id is " + app_id)
 
             user_requestBody = usersPayload.postUsers(app_id, group_name)
             user_requestBody.user.email_address = common_utils.randEmail()
 
             res = await requests.postUsers(user_requestBody, userName, admin_id)
             customer_key = res.body.fax_numbers[0].customer_key
             fax_number = res.body.fax_numbers[0].fax_number
 
         } catch (e) {
             console.log(e)
             console.log(res.body)
         }
     })
 
     it('C33342: Patch > Users > Validate error and status code when we do not pass admin-id in header *smoke*', async function () {
         patchUser_requestBody = editUserPayload.editUsers(app_id, group_name)
         patchUser_requestBody.user.first_name = userName
         first_name = patchUser_requestBody.user.first_name

         res = await requests.patchUsersCustomerKey(customer_key, patchUser_requestBody, undefined)
         assert.equal(res.status, 400, 'Actual status is ' + res.status)
         assert.equal(res.body.errors[0].error_code, 'GEN013', 'Actual error_code is ' + res.body.errors[0].error_code)
         assert.equal(res.body.errors[0].developer_message, "Missing request header 'admin-id' for method parameter of type String", 'Actual developer_message is ' + res.body.errors[0].developer_message)
         assert.equal(res.body.errors[0].user_message, 'Invalid request.', 'Actual user_message is ' + res.body.errors[0].user_message)
     })

     it('C36786: Patch > Users > Validate error while patch users with invalid content type', async function () {
        patchUser_requestBody = editUserPayload.editUsers(app_id, group_name)

        res = await requests.patchUsersWithInvalidContentType(customer_key, patchUser_requestBody)
        assert.equal(res.status, 400, 'Actual status code is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'GEN013', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, "Content type 'applications/json;charset=UTF-8' not supported", 'Actual error_code is '+res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Invalid request.', 'Actual user_message is '+res.body.errors[0].user_message)
    })
 
     after(async function () {
         await requests.delApplications(app_id, app_requestBody)
     })
 })