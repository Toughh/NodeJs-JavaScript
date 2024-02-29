/**
 * Import required packages
 */
require('mocha')
require('../../common/util/testrail-util')

var config = require('config')
var assert = require('chai').assert
const chai = require('chai')
chai.use(require('chai-uuid'))

const requests = require('../../common/setup/request')
const applicationsPayload = require('../../common/datasource/createApplication')
const usersPayload = require('../../common/datasource/createUser')
const common_utils = require('../../common/util/commonUtils')

const timeout = config.get('timeout')

describe('Api authorization (-) - Validate response *end-to-end*', function () {
    this.timeout(timeout)
    let group_name, child_group_name
    let app_requestBody, app_child_requestBody, user_requestBody, api_user_requestBody
    let admin_id = config.get('admin.corp_id')
    let userName = config.get('admin.username')
    let app_id, fax_number, randGuid


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

            child_group_name = "My Account\\Avijit Test Automation\\Child Group Test"
            app_child_requestBody = applicationsPayload.postApplications(admin_id, child_group_name)

            randGuid = common_utils.createGUID()

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C20928: GET > Api Authorization > Get Assigned fax number > validate error return for invalid app-id are passed', async function () {
        res = await requests.getUsersApiUsersFaxNumber(fax_number, randGuid, userName)
        assert.equal(res.status, 404, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'AUT008', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ValidationResult', 'Actual element_name is ' + res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'Cannot find the specified application ID.', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Cannot find the specified application ID.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C22704: PUT > Enable Assigned Number > Existing and assigned fax number > Validate that error message displayed for wrong app-id passed', async function () {
        res = await requests.putUsersApiUsersFaxNumber(fax_number, randGuid)
        assert.equal(res.status, 404, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'APP009', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ResultCode', 'Actual element_name is ' + res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'Cannot find the specified Application ID.', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Cannot find the specified Application ID.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C34445: Put > internal > users > api-users > invalid_user_id > refresh - Validate response status code 404 if invalid user_id', async function () {
        res = await requests.putUsersApiUsersUserIdRefresh(randGuid, app_id)
        assert.equal(res.status, 404, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'APIU024', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ResultCode', 'Actual element_name is ' + res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'API user not found.', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'API user not found.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C22766: GET > API Authorization > Get assigned fax number > Validate that error message displayed for wrong credentials', async function () {
        res = await requests.getUsersApiUsersFaxNumber(fax_number, randGuid, 'WRONGUSERNAME')
        assert.equal(res.status, 401, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'AUT002', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'BadCredentialsException', 'Actual element_name is ' + res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'Account not found.', 'Actual error_code is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'The administrator ID, username or password are incorrect.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C22768: PATCH > Api Authorization > Update Assigned Specified fax number > validate error return for invalid app-id are passed.', async function () {
        api_user_requestBody = usersPayload.apiUsers()
        res = await requests.patchUsersApiUsersFaxNumber(fax_number, randGuid, userName, api_user_requestBody)
        assert.equal(res.status, 400, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'GEN010', 'Actual error_coe is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, "Request method 'PATCH' not supported", 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Unsupported request.', 'Actual user_message is ' +res.body.errors[0].user_message)
    })

    it('C22769: DELETE > Disable Assigned Number > Existing and Unassigned fax number > validate error return for invalid app-id are passed.', async function () {
        res = await requests.deleteUsersApiUsersFaxNumber(fax_number, 123)
        assert.equal(res.status, 404, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'APIU014', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ResultCode', 'Actual element_name is ' + res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'Fax number not found. Please review the faxNumber and appId provided.', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Fax number not found. Please review the faxNumber and appId provided.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C23214: GET > API Authorization > Get API-Authorization > Validate that error message displayed for missing variable in URL path', async function () {
        res = await requests.getUsersApiUsersFaxNumber(``, app_id, userName)
        assert.equal(res.status, 400, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'GEN006', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, "Missing URI template variable 'faxNumber' for method parameter of type String", 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Required parameters are missing.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C5132: Get > Users > API Users > Disable Assigned Number > Validate authorization disabled for use of fax services', async function () {
        res = await requests.deleteUsersApiUsersFaxNumber(fax_number, app_id)
        assert.equal(res.status, 204, 'Actual status is ' + res.status)

        res = await requests.getUsersApiUsersFaxNumber(fax_number, app_id, userName)
        assert.equal(res.status, 404, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'APIU014', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ResultCode', 'Actual element_name is ' + res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'Fax number not found. Please review the faxNumber and appId provided.', 'Actual error_code is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Fax number not found. Please review the faxNumber and appId provided.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C18060: GET > Users > API Users > Authorize API Services > Validate fax number/user is given api authorization', async function () {
        res = await requests.getUsersApiUsersFaxNumber(fax_number, app_id, userName)
        assert.equal(res.status, 404, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'APIU014', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ResultCode', 'Actual element_name is ' + res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'Fax number not found. Please review the faxNumber and appId provided.', 'Actual error_code is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Fax number not found. Please review the faxNumber and appId provided.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C19480: POST > OAuth token - Generate Token > Validate error message displayed for wrong credentials', async function () {
        res = await requests.postOauthToken('WRONG', 'WRONG')
        assert.equal(res.status, 401, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'AUT002', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'BadCredentialsException', 'Actual element_name is ' + res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'Account not found.', 'Actual error_code is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'The administrator ID, username or password are incorrect.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C17628: POST > Invalid token - Invalid token > Validate error is thrown when invalid token is used', async function () {
        res = await requests.postApplicationsExt(app_requestBody, 'Hello', userName)
        assert.equal(res.status, 403, 'Actual status is ' + res.status)
        // assert.equal(res.body.error_code, 'AUT015', 'Actual error_code is ' + res.body.error_code)
        // assert.equal(res.body.error_description, 'Invalid access token: Hello', 'Actual error_description is ' + res.body.error_description)
        // assert.equal(res.body.error, 'access_denied', 'Actual error is ' + res.body.error)
        // assert.equal(res.body.user_message, 'Invalid OAuth Token.', 'Actual user_message is ' + res.body.user_message)
    })

    it('C17629: POST > Invalid token - Invalid token > Validate error proper code when invalid token is used', async function () {
        res = await requests.postApplicationsExt(app_requestBody, 'Hello', userName)
        assert.equal(res.status, 403, 'Actual status is ' + res.status)
        // assert.equal(res.body.error_code, 'AUT015', 'Actual error_code is ' + res.body.error_code)
        // assert.equal(res.body.error_description, 'Invalid access token: Hello', 'Actual error_description is ' + res.body.error_description)
        // assert.equal(res.body.error, 'access_denied', 'Actual error is ' + res.body.error)
        // assert.equal(res.body.user_message, 'Invalid OAuth Token.', 'Actual user_message is ' + res.body.user_message)
    })

    it('C22767: POST > Disable Assigned Number > Existing and Unassigned fax number > validate error return for invalid tokens and credentials are passed.', async function () {
        res = await requests.postApplicationsExt(app_requestBody, 'Hello', 'WRONGUSERNAME')
        assert.equal(res.status, 403, 'Actual status is ' + res.status)
        // assert.equal(res.body.error_code, 'AUT015', 'Actual error_code is ' + res.body.error_code)
        // assert.equal(res.body.error_description, 'Invalid access token: Hello', 'Actual error_description is ' + res.body.error_description)
        // assert.equal(res.body.error, 'access_denied', 'Actual error is ' + res.body.error)
        // assert.equal(res.body.user_message, 'Invalid OAuth Token.', 'Actual user_message is ' + res.body.user_message)
    })

    after(async function () {
        await requests.delApplications(app_id, app_requestBody)
    })
})