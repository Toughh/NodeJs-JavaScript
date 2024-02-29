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

describe('POST users (-ve) - Verify user error codes and messages *end-to-end*', function () {

    this.timeout(timeout)
    let group_name, sub_group_name, non_exist_group_name
    let app_requestBody1, app_requestBody2, user_requestBody
    let admin_id = config.get('admin.corp_id')
    let userName = config.get('admin.username')
    let group_name_with_api_enabled = "My Account\\Avijit Test Automation\\API Enabled Test"
    let app_id_group_with_api_enabled = config.get('data.api_enabled')
    let app_id1, app_id2
    let randomGuid
    let res

    before(async function () {
        try {

            group_name = "My Account\\Avijit Test Automation"
            sub_group_name = "My Account\\Avijit Test Automation\\Child Group Test"
            non_exist_group_name = "My Account\\Non Exist Group Name"

            app_requestBody1 = applicationsPayload.postApplications(admin_id, group_name)
            res = await requests.postApplications(app_requestBody1)
            app_id1 = res.body.app_id
            console.log("app_id is " + app_id1)

            app_requestBody2 = applicationsPayload.postApplications(admin_id, sub_group_name)
            res = await requests.postApplications(app_requestBody2)
            app_id2 = res.body.app_id
            console.log("app_id is " + app_id2)

            randomGuid = common_utils.createGUID()

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C38185: POST > Users > Creation > Validate User is not created when Group name does not belong to user', async function () {
        const expectedErrorMes = {
            "error_code": "GEN007",
            "element_name": "ResultCode",
            "developer_message": "Invalid group name.",
            "user_message": "Invalid group name."
        }

        user_requestBody = usersPayload.postUsers(app_id2, non_exist_group_name)
        user_requestBody.user.email_address = common_utils.randEmail()
        res = await requests.postUsers(user_requestBody, userName, admin_id)
        assert.equal(res.statusCode, 400, 'Actual status code is ' + res.statusCode)
        assert.include(res.body.errors[0], expectedErrorMes, 'Actual Error Message is ' + res.body.errors[0])
    })

    it('C38191: POST > Users > Creation > Validate error message when Creating a user with an API from another group (not visible for admin on this group)', async function () {
        const expectedErrorMes = {
            "error_code": "AUT008",
            "element_name": "ValidationResult",
            "developer_message": "Cannot find the specified application ID.",
            "user_message": "Cannot find the specified application ID."
        }
        
        user_requestBody = usersPayload.postUsers(randomGuid, group_name_with_api_enabled)
        user_requestBody.user.email_address = common_utils.randEmail()

        res = await requests.postUsers(user_requestBody, userName, admin_id)
        assert.equal(res.statusCode, 404, 'Actual StatusCode is ' + res.statusCode)
        assert.include(res.body.errors[0], expectedErrorMes, 'Actual Error Message is ' + res.body.errors[0])
    })

    it.skip('C38196: POST > Users > Creation > Validate error message when Creating a user with API in a subgroup that has API disabled', async function () {
        const expectedErrorMes = {
            "error_code": "AUT008",
            "element_name": "ValidationResult",
            "developer_message": "Cannot find the specified application ID.",
            "user_message": "Cannot find the specified application ID."
        }
        
        user_requestBody = usersPayload.postUsers(randomGuid, group_name)
        user_requestBody.user.email_address = common_utils.randEmail()
        user_requestBody.user.receive_enabled = false

        res = await requests.postUsers(user_requestBody, userName, admin_id)
        assert.equal(res.statusCode, 404, 'Actual StatusCode is ' + res.statusCode)
        assert.include(res.body.errors[0], expectedErrorMes, 'Actual Error Message is ' + res.body.errors[0])
    })

    after(async function () {
        await requests.delApplications(app_id2, app_requestBody2)
        await requests.delApplications(app_id1, app_requestBody1)
    })
})