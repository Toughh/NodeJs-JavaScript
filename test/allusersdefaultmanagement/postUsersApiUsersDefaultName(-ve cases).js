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

describe('POST /users/api-users/user_id/default (-) - Verify new user created *end-to-end*', function () {
    this.timeout(timeout)
    let group_name
    let appRequestBody, userRequestBody, userDefaultsNamesRequestBody
    let app_id, user_id, fax_number, customer_key
    let admin_id = config.get('admin.corp_id')
    let userName = config.get('admin.username')
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
            fax_number = res.body.fax_numbers[0].fax_number
            customer_key = res.body.fax_numbers[0].customer_key

            randGuid = common_utils.createGUID()

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C22090: POST > User Defaults > Invalid default_name > Validate 400 Bad Request is returned *regression*', async function () {
        userDefaultsNamesRequestBody = userDefaultsNamesPayload.postUserDefaultDefaultName('invalid', 'test value', true)
        delete userDefaultsNamesRequestBody.enabled

        res = await requests.postUsersApiUsersUserIdDefaults(userDefaultsNamesRequestBody, user_id)
        assert.equal(res.status, 400, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'APIUDF001', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ResultCode', 'Actual element_name is ' + res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'Not allowed default name.', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Not allowed default name.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C22091: POST > User Defaults > User default with empty default_name > Validate 400 Bad Request is returned *regression*', async function () {
        userDefaultsNamesRequestBody = userDefaultsNamesPayload.postUserDefaultDefaultName("", 'test value', true)
        delete userDefaultsNamesRequestBody.enabled
        
        res = await requests.postUsersApiUsersUserIdDefaults(userDefaultsNamesRequestBody, user_id)
        assert.equal(res.status, 400, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'APIUDF002', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ValidationResult', 'Actual element_name is ' + res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'Default name is empty.', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Default name is empty.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C22092: POST > User Defaults > User default with empty default_value > Validate 400 Bad Request is returned *regression*', async function () {
        userDefaultsNamesRequestBody = userDefaultsNamesPayload.postUserDefaultDefaultName('outbound_header_options', "", true)
        delete userDefaultsNamesRequestBody.enabled
        
        res = await requests.postUsersApiUsersUserIdDefaults(userDefaultsNamesRequestBody, user_id)
        assert.equal(res.status, 400, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'APIUDF003', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ValidationResult', 'Actual element_name is ' + res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'Default value is empty.', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Default value is empty.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C22093: POST > User Defaults > User default using invalid user-id > Validate 404 Not Found is returned *regression*', async function () {
        userDefaultsNamesRequestBody = userDefaultsNamesPayload.postUserDefaultDefaultName('outbound_header_options', fax_number, true)
        delete userDefaultsNamesRequestBody.enabled
        
        res = await requests.postUsersApiUsersUserIdDefaults(userDefaultsNamesRequestBody, randGuid)
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