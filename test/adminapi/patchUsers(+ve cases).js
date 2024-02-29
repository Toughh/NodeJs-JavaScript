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

describe('PATCH Users - Verify updated response *end-to-end*', function () {
    this.timeout(timeout)
    let group_name
    let app_requestBody, user_requestBody, patchUser_requestBody
    let app_id
    let admin_id = config.get('admin.corp_id')
    let userName = config.get('admin.username')
    let customer_key, fax_number
    let updated_group_name
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
            fax_number = res.body.fax_numbers[0].fax_number
            customer_key = res.body.fax_numbers[0].customer_key

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C5333: PATCH > Users > Validate Group is update appropriately in response *debug*', async function () {
        patchUser_requestBody = editUserPayload.editUsers(app_id, group_name)
        patchUser_requestBody.user.group_name = "My Account\\Avijit Test Automation\\Child Group Test"       
        updated_group_name = patchUser_requestBody.user.group_name

        res = await requests.patchUsersCustomerKey(customer_key, patchUser_requestBody, admin_id)
        assert.equal(res.status, 200, 'Actual status is '+res.status)
        assert.equal(res.body.user.group_name, updated_group_name, 'group_name has not been edited after Patch user')
    })

    after(async function () {
        await requests.delApplications(app_id, app_requestBody)
    })
})