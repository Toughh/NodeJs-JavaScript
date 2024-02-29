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
const common_utils = require('../../common/util/commonUtils')

const timeout = config.get('timeout')

describe('DELETE users (-ve) - Verify response *end-to-end*', function () {

    this.timeout(timeout)
    let group_name
    let app_requestBody, user_requestBody
    let app_id, customer_key, fax_number
    let admin_id = config.get('admin.corp_id')
    let userName = config.get('admin.username')

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

    it('C33343: Delete > Users > Validate error and status code when we do not pass admin-id in header *smoke*', async function () {
        res = await requests.deleteUsersCustomerId(customer_key, undefined)
        assert.equal(res.status, 400, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'GEN013', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, "Missing request header 'admin-id' for method parameter of type String", 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Invalid request.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C5121: DELETE > User > Assigned Number > Validate user is not deleted *smoke*', async function () {
        res = await requests.deleteUsersCustomerId(customer_key, admin_id)
        assert.equal(res.status, 400, 'Actual status code is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'DEL008', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ValidationResult', 'Actual element_name is '+res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'Cannot delete user. The user has assigned fax numbers.', 'Actual developer_message is '+res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Cannot delete user. The user has assigned fax numbers.', 'Actual user_message is '+res.body.errors[0].user_message)
    })

    after(async function () {
        await requests.delApplications(app_id, app_requestBody)
    })
})