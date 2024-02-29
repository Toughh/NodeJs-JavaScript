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

describe('DELETE /users/api-users/user_id/defaults/default_name (+) - Verify new user created *end-to-end*', function () {
    this.timeout(timeout)
    let group_name
    let appRequestBody, userRequestBody, userDefaultNamesRequestBody
    let app_id, user_id, customer_key, fax_number
    let admin_id = config.get('admin.corp_id')
    let userName = config.get('admin.username')
    let default_name = 'outbound_caller_id'
    let default_value = '12312312312'
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

            userDefaultNamesRequestBody = userDefaultsNamesPayload.postUserDefaultDefaultName(default_name, default_value, true)

            res = await requests.postUsersApiUsersUserIdDefaults(userDefaultNamesRequestBody, user_id)

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C22103: DELETE > User Defaults > Delete user default > Validate each user default could be deleted from fax user *regression* *smoke*', async function () {
        res = await requests.deleteUsersApiUsersUserIdDefaultsDefaultName(user_id, default_name)
        assert.equal(res.status, 204, 'Actual status is ' + res.status)
    })

    after(async function () {
        await requests.delApplications(app_id, appRequestBody)
    })
})