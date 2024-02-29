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

describe('POST users (+ve) - Verify user response *end-to-end*', function () {

    this.timeout(timeout)
    let group_name
    let app_requestBody, user_requestBody
    let admin_id = config.get('admin.corp_id')
    let userName = config.get('admin.username')
    let group_name_with_api_enabled = "My Account\\Avijit Test Automation\\API Enabled Test"
    let app_id_group_with_api_enabled = config.get('data.api_enabled') 
    let app_id
    let res

    before(async function () {
        try {

            group_name = "My Account\\Avijit Test Automation\\Child Group Test"
            app_requestBody = applicationsPayload.postApplications(admin_id, group_name)

            res = await requests.postApplications(app_requestBody)
            app_id = res.body.app_id
            console.log("app_id is " + app_id)

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it.only('C38186: POST > Users > Creation > Validate successful message when Creating a user with No API in a group that has API disabled', async function () {
        user_requestBody = usersPayload.postUsers(app_id, group_name)
        user_requestBody.user.email_address = common_utils.randEmail()
        user_requestBody.user.receive_enabled = false
        delete user_requestBody.number_preferences.services_api_app_id

        res = await requests.postUsers(user_requestBody, userName, admin_id)
        assert.equal(res.statusCode, 201, 'Actual status code is ' + res.statusCode)
    })

    it.skip('C38192: POST > Users > Creation > Validate successful message when Creating a user with API in a group that has API enabled', async function () {
        user_requestBody = usersPayload.postUsers(app_id_group_with_api_enabled, group_name_with_api_enabled)
        user_requestBody.user.email_address = common_utils.randEmail()
        user_requestBody.user.receive_enabled = true

        res = await requests.postUsers(user_requestBody, userName, admin_id)
        assert.equal(res.statusCode, 201, 'Actual status code is ' + res.statusCode)
    })

    it('C38193: POST > Users > Creation > Validate error message when Creating a user with API in a group that has API disabled', async function () {
        user_requestBody = usersPayload.postUsers(app_id, group_name)
        user_requestBody.user.email_address = common_utils.randEmail()
        user_requestBody.user.receive_enabled = true
        user_requestBody.number_preferences.services_api_app_id = app_id

        res = await requests.postUsers(user_requestBody, userName, admin_id)
        assert.equal(res.statusCode, 201, 'Actual status code is ' + res.statusCode)
    })

    it('C38194: POST > Users > Creation > Validate successful message when Creating a user with No API in a subgroup that has API disabled', async function () {
        user_requestBody = usersPayload.postUsers(app_id, group_name)
        user_requestBody.user.email_address = common_utils.randEmail()
        user_requestBody.user.receive_enabled = false
        delete user_requestBody.number_preferences.services_api_app_id

        res = await requests.postUsers(user_requestBody, userName, admin_id)
        assert.equal(res.statusCode, 201, 'Actual status code is ' + res.statusCode)
    })

    it('C38195: POST > Users > Creation > Validate successful message when Creating a user with No API in a subgroup that has API enabled', async function () {
        user_requestBody = usersPayload.postUsers(app_id, group_name_with_api_enabled)
        user_requestBody.user.email_address = common_utils.randEmail()
        user_requestBody.user.receive_enabled = false
        delete user_requestBody.number_preferences.services_api_app_id

        res = await requests.postUsers(user_requestBody, userName, admin_id)
        assert.equal(res.statusCode, 201, 'Actual status code is ' + res.statusCode)
    })

    it.skip('C38197: POST > Users > Creation > Validate successful message when Creating a user with API in a subgroup that has API enabled', async function () {
        user_requestBody = usersPayload.postUsers(app_id_group_with_api_enabled, group_name_with_api_enabled)
        user_requestBody.user.email_address = common_utils.randEmail()
        user_requestBody.user.receive_enabled = true

        res = await requests.postUsers(user_requestBody, userName, admin_id)
        assert.equal(res.statusCode, 201, 'Actual status code is ' + res.statusCode)
    })

    after(async function () {
        await requests.delApplications(app_id, app_requestBody)
    })
})