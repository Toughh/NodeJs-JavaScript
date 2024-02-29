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

describe('POST users with PFNP (+ve) - Verify user response *end-to-end*', function () {

    this.timeout(timeout)
    let group_name_with_PFNP, sub_group_name_with_PFNP
    let app_requestBody1, app_requestBody2, user_requestBody
    let admin_id = config.get('admin.corp_id')
    let userName = config.get('admin.username')
    let app_id1, app_id2
    let res

    before(async function () {
        try {

            group_name_with_PFNP = "My Account\\Avijit Test Automation\\PFNP Test"
            sub_group_name_with_PFNP = "My Account\\Avijit Test Automation\\PFNP Test\\Sub Group PFNP Test"

            app_requestBody1 = applicationsPayload.postApplications(admin_id, group_name_with_PFNP)
            res = await requests.postApplications(app_requestBody1)
            app_id1 = res.body.app_id
            console.log("app_id is " + app_id1)

            app_requestBody2 = applicationsPayload.postApplications(admin_id, sub_group_name_with_PFNP)
            res = await requests.postApplications(app_requestBody2)
            app_id2 = res.body.app_id
            console.log("app_id is " + app_id2)

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C38820: POST > Users > Validate SUCCESS message for a group with PFNP', async function () {
        user_requestBody = usersPayload.postUsers(app_id1, group_name_with_PFNP)
        user_requestBody.user.email_address = common_utils.randEmail()

        res = await requests.postUsers(user_requestBody, userName, admin_id)
        assert.equal(res.statusCode, 201, 'Actual status code is ' + res.statusCode)
    })

    it('C38821: POST > Users > Validate SUCCESS message for group without PFNP but subgroup with PFNP', async function () {
        user_requestBody = usersPayload.postUsers(app_id2, sub_group_name_with_PFNP)
        user_requestBody.user.email_address = common_utils.randEmail()

        res = await requests.postUsers(user_requestBody, userName, admin_id)
        assert.equal(res.statusCode, 201, 'Actual status code is ' + res.statusCode)
    })

    after(async function () {
        await requests.delApplications(app_id2, app_requestBody2)
        await requests.delApplications(app_id1, app_requestBody1)
    })
})