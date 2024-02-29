/**
 * Import required packages
 */
require('mocha')

var config = require('config')
var assert = require('chai').assert

const requests = require('../../../common/setup/request')
const ssoGroupsPayload = require('../../../common/datasource/createSSOGroups')

const timeout = config.get('timeout')

describe('PATCH /sso/groups (-) - Validate response *sso* *end-to-end*', function () {
    this.timeout(timeout)
    let ssoGroupsRequestBody
    let oauth_group, group_name, group_description
    let res

    before(async function () {
        try {
            ssoGroupsRequestBody = ssoGroupsPayload.postSSOGroups()

            res = await requests.postSSOGroups(ssoGroupsRequestBody)
            oauth_group = res.body.oauth_group
            group_name = res.body.group_name
            group_description = res.body.group_description

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C31515: PATCH > SSO > Groups > Internal > passing oauth_group > Validate 400 Bad Request is returned', async function () {
        res = await requests.patchSSOGroups({"oauth_group": oauth_group, "group_name": group_name, "group_description": group_description}, oauth_group)
        assert.equal(res.status, 400, 'Actual status code is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'GEN013', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'Request body not readable or missing: Unrecognized field \"oauth_group\" (class com.j2.core.api.model.request.sso.SsoOAuthGroupUpdateRequest), not marked as ignorable', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Invalid request.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C31517: PATCH > SSO > Groups > Internal > group_name field is empty string > Validate 400 Bad Request is returned', async function () {
        res = await requests.patchSSOGroups({"group_name": "", "group_description": group_description}, oauth_group)
        assert.equal(res.status, 400, 'Actual status code is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'SSO015', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'SSO group name cannot be blank.', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'SSO request validation exception.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C31519: PATCH > SSO > Groups > Internal > group_description field is empty string > Validate 400 Bad Request is returned', async function () {
        res = await requests.patchSSOGroups({"group_name": group_name, "group_description": ""}, oauth_group)
        assert.equal(res.status, 400, 'Actual status code is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'SSO015', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'SSO group description cannot be blank.', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'SSO request validation exception.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C31520: PATCH > SSO > Groups > Internal > not existing property >  Validate 400 Bad Request is returned', async function () {
        res = await requests.patchSSOGroups({"invalid": "invalid property", "group_name": group_name, "group_description": group_description}, oauth_group)
        assert.equal(res.status, 400, 'Actual status code is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'GEN013', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'Request body not readable or missing: Unrecognized field \"invalid\" (class com.j2.core.api.model.request.sso.SsoOAuthGroupUpdateRequest), not marked as ignorable', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Invalid request.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    after(async function() {
        await requests.deleteSSOGroups(oauth_group)
    })
})