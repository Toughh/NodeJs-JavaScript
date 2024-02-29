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

describe('DELETE Api users (-ve) - Verify error message *end-to-end*', function () {

    this.timeout(timeout)
    let group_name, sub_group_name
    let app_requestBody1, app_requestBody2, user_requestBody1, user_requestBody2
    let admin_id = config.get('admin.corp_id')
    let userName = config.get('admin.username')
    let app_id1, app_id2, fax_number1, fax_number2
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
            fax_number1 = res.body.fax_numbers[0].fax_number

            user_requestBody2 = usersPayload.postUsers(app_id2, sub_group_name)
            user_requestBody2.user.email_address = common_utils.randEmail()
            res = await requests.postUsers(user_requestBody2, userName, admin_id)
            fax_number2 = res.body.fax_numbers[0].fax_number

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C38840: DELETE > Users > Validate ERROR when deleting an users API not belonging to subadmins group', async function () {
        const expectedErrorMes = {
            "error_code": "APIU014",
            "element_name": "ResultCode",
            "developer_message": "Fax number not found. Please review the faxNumber and appId provided.",
            "user_message": "Fax number not found. Please review the faxNumber and appId provided."
        }

        res = await requests.deleteUsersApiUsersFaxNumber(fax_number2, app_id1)
        assert.equal(res.statusCode, 404, 'Actual status code is ' + res.statusCode)
        assert.include(res.body.errors[0], expectedErrorMes, 'Actual Error Message is ' + res.body.errors[0])
    })

    it('C38842: DELETE > Users > Validate ERROR when deleting an users API not belonging to subadmins subgroup', async function () {
        const expectedErrorMes = {
            "error_code": "APIU014",
            "element_name": "ResultCode",
            "developer_message": "Fax number not found. Please review the faxNumber and appId provided.",
            "user_message": "Fax number not found. Please review the faxNumber and appId provided."
        }

        res = await requests.deleteUsersApiUsersFaxNumber(fax_number1, app_id2)
        assert.equal(res.statusCode, 404, 'Actual status code is ' + res.statusCode)
        assert.include(res.body.errors[0], expectedErrorMes, 'Actual Error Message is ' + res.body.errors[0])
    })

    after(async function () {
        await requests.deleteUsersApiUsersFaxNumber(fax_number2, app_id2)
        await requests.deleteUsersApiUsersFaxNumber(fax_number1, app_id1)
        await requests.delApplications(app_id2, app_requestBody2)
        await requests.delApplications(app_id1, app_requestBody1)
    })
})