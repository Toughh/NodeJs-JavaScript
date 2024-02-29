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

describe('PATCH /users/api-users/user_id/default/default_name (+) - Verify default user returned *end-to-end*', function () {
    this.timeout(timeout)
    let group_name
    let appRequestBody, userRequestBody, userDefaultNamesRequestBody
    let app_id, user_id, fax_number, customer_key
    let admin_id = config.get('admin.corp_id')
    let userName = config.get('admin.username')
    let default_name = 'outbound_header_options'
    let updated_default_value = "{\"default_value\": \"updated_outbound_header_options_value\", \"enabled\": false}"
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

            userDefaultNamesRequestBody = userDefaultsNamesPayload.postUserDefaultDefaultName(default_name, 'outbound_header_options_value', true)
            delete userDefaultNamesRequestBody.enabled

            res = await requests.postUsersApiUsersUserIdDefaults(userDefaultNamesRequestBody, user_id)

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C22101: PATCH > User Defaults > Validate each User Default is updated *regression* *smoke*', async function () {
        res = await requests.patchUsersApiUsersUserIdDefaultsDefaultName(user_id, 'outbound_header_options', updated_default_value)
        assert.equal(res.status, 200, 'Actual status is '+res.status)
        assert.equal(res.body.default_name, default_name, 'Actual response is '+res.body.default_name)
        assert.equal(res.body.default_value, 'updated_outbound_header_options_value', 'Actual response is '+res.body.default_value)
        assert.equal(res.body.enabled, false, 'Actual response is '+res.body.enabled)
    })

    after(async function () {
        await requests.delApplications(app_id, appRequestBody)
    })
})