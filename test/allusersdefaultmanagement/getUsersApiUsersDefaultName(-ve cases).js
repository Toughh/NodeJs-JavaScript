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
const userDefaultsNamesPayload = require('../../common/datasource/createUserDefaultsNames')
const common_utils = require('../../common/util/commonUtils')

const timeout = config.get('timeout')

describe('GET /users/api-users/user_id/default/default-name (-) - Verify default user returned *end-to-end*', function () {
    this.timeout(timeout)
    let group_name
    let appRequestBody, userRequestBody, userDefaultNamesRequestBody1, userDefaultNamesRequestBody2
    let app_id, user_id, customer_key, fax_number
    let admin_id = config.get('admin.corp_id')
    let userName = config.get('admin.username')
    let default_name = 'outbound_caller_id'
    let default_name1 = 'outbound_header_options'
    let default_value = '12312312312'
    let default_value1 = "{\"line_1\": [\"${CSID}\", \"${DATE_TIME2}\", \"${FAX_ID}\", \"Page: ${CURRENT_PAGE} / ${TOTAL_PAGE}\"]}"
    let randGuid
    let res

    before(async function () {
        try {
            group_name = "My Account\\Avijit Test Automation"
            appRequestBody = applicationsPayload.postApplications(admin_id, group_name)

            res = await requests.postApplications(appRequestBody)
            app_id = res.body.app_id
            console.log("app_id is " + app_id)

            userRequestBody = usersPayload.postUsers(app_id, group_name)
            userRequestBody.user.email_address = common_utils.randEmail()

            res = await requests.postUsers(userRequestBody, userName, admin_id)
            user_id = res.body.fax_numbers[0].user_id
            customer_key = res.body.fax_numbers[0].customer_key
            fax_number = res.body.fax_numbers[0].fax_number

            userDefaultNamesRequestBody1 = userDefaultsNamesPayload.postUserDefaultDefaultName(default_name, default_value, true)

            res = await requests.postUsersApiUsersUserIdDefaults(userDefaultNamesRequestBody1, user_id)

            userDefaultNamesRequestBody2 = userDefaultsNamesPayload.postUserDefaultDefaultName(default_name1, default_value1, true)

            res = await requests.postUsersApiUsersUserIdDefaults(userDefaultNamesRequestBody2, user_id)

            randGuid = common_utils.createGUID()

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C22096: GET > User Defaults > Get all user defaults using invalid user-id > Validate 404 Not Found is returned *regression* *smoke*', async function () {
        res = await requests.getUsersApiUsersUserIdDefaults(randGuid)
        assert.equal(res.status, 404, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'APIU024', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ValidationResult', 'Actual element_name is ' + res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'API user not found.', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'API user not found.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C22098: GET > User Defaults > Get user default using not-existing default name > Validate 400 Bad Request is returned *regression*', async function () {
        res = await requests.getUsersApiUsersUserIdDefaults('Invalid')
        assert.equal(res.status, 404, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'APIU024', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ValidationResult', 'Actual element_name is ' + res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'API user not found.', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'API user not found.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C22099: GET > User Defaults > Get user default using not-existing default name > Validate 400 Bad Request is returned *regression*', async function () {
        res = await requests.getUsersApiUsersUserIdDefaults('Invalid')
        assert.equal(res.status, 404, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'APIU024', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ValidationResult', 'Actual element_name is ' + res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'API user not found.', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'API user not found.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C22100: GET > User Defaults > Get user default using invalid user-id > Validate 404 Bad Request is returned *regression*', async function () {
        res = await requests.getUsersApiUsersUserIdDefaults(randGuid)
        assert.equal(res.status, 404, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'APIU024', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ValidationResult', 'Actual element_name is ' + res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'API user not found.', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'API user not found.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    after(async function () {
        await requests.delApplications(app_id, appRequestBody)
    })
})