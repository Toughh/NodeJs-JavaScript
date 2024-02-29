/**
 * Import required packages
 */
require('mocha')

var config = require('config')
var assert = require('chai').assert

const requests = require('../../../common/setup/request')

const ssoGroupsPayload = require('../../../common/datasource/createSSOGroups')

const timeout = config.get('timeout')

describe('POST /sso/groups (-) - Validate response *sso* *end-to-end*', function () {
    this.timeout(timeout)
    let ssoGroupsRequestBody
    let oauth_group
    let res

    it('C31500: POST > SSO > Groups > Internal > oauth_group field is missing > Validate 400 Bad Request is returned', async function () {
        ssoGroupsRequestBody = ssoGroupsPayload.postSSOGroups()
        delete ssoGroupsRequestBody.oauth_group
        res = await requests.postSSOGroups(ssoGroupsRequestBody)
        assert.equal(res.status, 400, 'Actual status code is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'SSO015', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'SSO oauth group is not specified.', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'SSO request validation exception.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C31501: POST > SSO > Groups > Internal > oauth_group field is empty string > Validate 400 Bad Request is returned', async function () {
        ssoGroupsRequestBody = ssoGroupsPayload.postSSOGroups()
        ssoGroupsRequestBody.oauth_group = ""
        res = await requests.postSSOGroups(ssoGroupsRequestBody)
        assert.equal(res.status, 400, 'Actual status code is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'SSO015', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'SSO oauth group is not specified.', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'SSO request validation exception.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C31502: POST > SSO > Groups > Internal > oauth_group field is empty string > Validate 400 Bad Request is returned', async function () {
        ssoGroupsRequestBody = ssoGroupsPayload.postSSOGroups()
        oauth_group = ssoGroupsRequestBody.oauth_group
        res = await requests.postSSOGroups(ssoGroupsRequestBody)
        assert.equal(res.status, 201, 'Actual status code is ' + res.status)
        res = await requests.postSSOGroups(ssoGroupsRequestBody)
        assert.equal(res.status, 400, 'Actual status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'SSO015', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'SSO oauth group already exists: '+oauth_group, 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'SSO request validation exception.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C31503: POST > SSO > Groups > Internal > group_name field is missing > Validate 400 Bad Request is returned', async function () {
        ssoGroupsRequestBody = ssoGroupsPayload.postSSOGroups()
        delete ssoGroupsRequestBody.group_name
        res = await requests.postSSOGroups(ssoGroupsRequestBody)
        assert.equal(res.status, 400, 'Actual status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'SSO015', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'SSO group name is not specified.', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'SSO request validation exception.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C31504: POST > SSO > Groups > Internal > group_name field is empty string > Validate 400 Bad Request is returned', async function () {
        ssoGroupsRequestBody = ssoGroupsPayload.postSSOGroups()
        ssoGroupsRequestBody.group_name = ""
        res = await requests.postSSOGroups(ssoGroupsRequestBody)
        assert.equal(res.status, 400, 'Actual status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'SSO015', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'SSO group name is not specified.', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'SSO request validation exception.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C31505: POST > SSO > Groups > Internal > group_description field is missing > Validate 400 Bad Request is returned', async function () {
        ssoGroupsRequestBody = ssoGroupsPayload.postSSOGroups()
        delete ssoGroupsRequestBody.group_description
        res = await requests.postSSOGroups(ssoGroupsRequestBody)
        assert.equal(res.status, 400, 'Actual status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'SSO015', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'SSO group description is not specified.', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'SSO request validation exception.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C31506: POST > SSO > Groups > Internal > group_description field is empty string > Validate 400 Bad Request is returned', async function () {
        ssoGroupsRequestBody = ssoGroupsPayload.postSSOGroups()
        ssoGroupsRequestBody.group_description = ""
        res = await requests.postSSOGroups(ssoGroupsRequestBody)
        assert.equal(res.status, 400, 'Actual status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'SSO015', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'SSO group description is not specified.', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'SSO request validation exception.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C31507: POST > SSO > Groups > Internal > not existing property > Validate 400 Bad Request is returned', async function () {
        ssoGroupsRequestBody = ssoGroupsPayload.postSSOGroups()
        ssoGroupsRequestBody.invalid = "Invalid Property"
        res = await requests.postSSOGroups(ssoGroupsRequestBody)
        assert.equal(res.status, 400, 'Actual status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'GEN013', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'Request body not readable or missing: Unrecognized field \"invalid\" (class com.j2.core.api.model.request.sso.SsoOAuthGroupCreateRequest), not marked as ignorable', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Invalid request.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    after(async function() {
        await requests.deleteSSOGroups(oauth_group)
    })
})