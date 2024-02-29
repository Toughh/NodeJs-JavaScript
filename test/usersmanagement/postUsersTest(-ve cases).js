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

describe('POST users (-ve) - Verify user error codes and messages *end-to-end*', function () {

    this.timeout(timeout)
    let group_name
    let app_requestBody, user_requestBody1, user_requestBody2
    let app_id, customer_key, fax_number
    let admin_id = config.get('admin.corp_id')
    let userName = config.get('admin.username')
    let res

    before(async function () {
        try {
            group_name = "My Account\\Avijit Test Automation"
            app_requestBody = applicationsPayload.postApplications(admin_id, group_name)

            res = await requests.postApplications(app_requestBody)
            app_id = res.body.app_id
            console.log("app_id is " + app_id)

            user_requestBody1 = usersPayload.postUsers(app_id, group_name)
            delete user_requestBody1.number_preferences

            user_requestBody2 = usersPayload.postUsers(app_id, group_name)
            user_requestBody2.user.email_address = common_utils.randEmail()

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C20665: POST > Users > Validate that  error is displayed for missing  number preference', async function () {
        res = await requests.postUsers(user_requestBody1, userName, admin_id)
        assert.equal(res.status, 400, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'USC024', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ResultCode', 'Actual element_name is ' + res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'Missing number preferences.', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Error creating Child Account.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C19477: POST > Users > For all Users endpoint > Validated user information is not fetched for the wrong reseller/admin', async function () {
        res = await requests.postUsers(user_requestBody2, 'WRONG', admin_id)
        assert.equal(res.status, 401, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'AUT002', 'Actual error_coe is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'BadCredentialsException', 'Actual element_name is ' + res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'Account not found.', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'The administrator ID, username or password are incorrect.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C29400: POST > Users > Validate error if send_enabled and receive_enabled set to false *smoke*', async function () {
        user_requestBody2.user.send_enabled = false
        user_requestBody2.user.receive_enabled = false
        user_requestBody2.user.email_address = common_utils.randEmail()

        res = await requests.postUsers(user_requestBody2, userName, admin_id)
        assert.equal(res.status, 400, 'Actual status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'USC024', 'Actual error_coe is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ResultCode', 'Actual element_name is ' + res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'Send or Receive enabled are required.', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Error creating Child Account.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C29403: POST > Users >  Validate error if web_account_id is already used by other user *smoke*', async function () {
        user_requestBody2.user.send_enabled = true
        user_requestBody2.user.receive_enabled = true
        user_requestBody2.user.web_account_id = common_utils.randNum(8)
        user_requestBody2.user.email_address = common_utils.randEmail()

        res = await requests.postUsers(user_requestBody2, userName, admin_id)
        assert.equal(res.status, 201, 'Actual status is '+res.status)
        customer_key = res.body.fax_numbers[0].customer_key
        fax_number = res.body.fax_numbers[0].fax_number

        user_requestBody2.user.email_address = common_utils.randEmail()
        res = await requests.postUsers(user_requestBody2, userName, admin_id)
        assert.equal(res.status, 400, 'Actual status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'USC024', 'Actual error_coe is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ResultCode', 'Actual element_name is ' + res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'Account ID is in use.', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Error creating Child Account.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C29402: POST > Users > Validate error asking for number_preferences required if receive_enabled set to true and send_enabled set to false *smoke*', async function () {
        user_requestBody2.user.send_enabled = false
        user_requestBody2.user.receive_enabled = true
        user_requestBody2.user.email_address = common_utils.randEmail()
        delete user_requestBody2.user.web_account_id
        delete user_requestBody2.number_preferences

        res = await requests.postUsers(user_requestBody2, userName, admin_id)
        assert.equal(res.status, 400, 'Actual status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'USC024', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ResultCode', 'Actual element_name is ' + res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'Missing number preferences.', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Error creating Child Account.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C33340: POST > Users > Validate error and status code when we do not pass admin-id in header *smoke*', async function () {
        user_requestBody2.user.email_address = common_utils.randEmail()

        res = await requests.postUsers(user_requestBody2, userName, undefined)
        assert.equal(res.status, 400, 'Actual status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'GEN013', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, "Missing request header 'admin-id' for method parameter of type String", 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Invalid request.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    after(async function () {
        await requests.delApplications(app_id, app_requestBody)
    })
})

describe('POST /users correesponding to child_group_name after patch- Validate response *end-to-end*', function () {
    this.timeout(timeout)
    let par_group_name, child_group_name
    let par_appRequestBody, child_appRequestBody, user_requestBody
    let par_app_id, child_app_id
    let admin_id = config.get('admin.corp_id')
    let userName = config.get('admin.username')
    let res

    before(async function () {
        try {
            par_group_name = "My Account\\Avijit Test Automation"
            par_appRequestBody = applicationsPayload.postApplications(admin_id, par_group_name)

            child_group_name = "My Account\\Avijit Test Automation\\Child Group Test"

            res = await requests.postApplications(par_appRequestBody)
            par_app_id = res.body.app_id
            console.log("Parent app_id is " + par_app_id)

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    //Bug: Able to postuser with parent group_name which was eventually patched to child_group_name
    it.skip('C30131: POST > Users >  Validate error while post users with parent_group_name after post application with parent group followed by patch application with child_group', async function () {
        par_appRequestBody.group_name = child_group_name
        res = await requests.patchApplications(par_app_id, par_appRequestBody, admin_id)
        assert.equal(res.status, 200, 'Actual status is ' + res.status)
        child_app_id = res.body.app_id

        user_requestBody = usersPayload.postUsers(par_app_id, par_group_name)
        user_requestBody.user.email_address = common_utils.randEmail()
        res = await requests.postUsers(user_requestBody, userName, admin_id)
        assert.equal(res.status, 400, 'Actual status is '+res.status)
    })

    after(async function () {
        await requests.delApplications(child_app_id, child_appRequestBody)
        await requests.delApplications(par_app_id, par_appRequestBody)
    })
})

describe('POST /users (US Region) - Validate user response if post application is from CA region *ca*', function () {
    this.timeout(timeout)
    let group_name
    let app_requestBody, user_requestBody
    let app_id
    let admin_id = config.get('admin.corp_id')
    let userName = config.get('admin.username')
    let randGuid
    let res

    before(async function () {
        try {
            group_name = "My Account\\Avijit Test Automation"
            app_requestBody = applicationsPayload.postApplications(admin_id, group_name)

            res = await requests.postApplications(app_requestBody)
            app_id = res.body.app_id
            console.log("app_id is " + app_id)

            randGuid = common_utils.createGUID()

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C30147: POST > Users > Validate not able to create user with US region corresponding to post applications with CA corp_id', async function () {
        user_requestBody = usersPayload.postUsers(randGuid, group_name)
        user_requestBody.user.email_address = common_utils.randEmail()
        res = await requests.postUsers(user_requestBody, userName, admin_id)
        assert.equal(res.status, 404, 'Actual status is ' + res.status)
    })

    after(async function () {
        await requests.delApplications(app_id, app_requestBody)
    })
})