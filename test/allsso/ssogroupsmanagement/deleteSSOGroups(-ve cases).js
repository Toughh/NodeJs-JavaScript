/**
 * Import required packages
 */
require('mocha')

var config = require('config')
var assert = require('chai').assert

const requests = require('../../../common/setup/request')

const ssoGroupsPayload = require('../../../common/datasource/createSSOGroups')
const ssoApplicationsPayload = require('../../../common/datasource/createSSOApplications')

const timeout = config.get('timeout')

describe('DELETE /sso/groups (-) - Validate response *sso* *end-to-end*', function () {
    this.timeout(timeout)
    let ssoGroupsRequestBody
    let oauth_group, not_exist_oauth_group
    let res

    before(async function () {
        try {
            ssoGroupsRequestBody = ssoGroupsPayload.postSSOGroups()
            oauth_group = ssoGroupsRequestBody.oauth_group

            res = await requests.postSSOGroups(ssoGroupsRequestBody)

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C31522: DELETE > SSO > Groups > Internal > oauth_group has an inactive status > Validate 404 Not Found is returned *sso*', async function () {
        res = await requests.deleteSSOGroups(oauth_group)
        assert.equal(res.status, 204, 'Actual status is ' + res.status)
        
        res = await requests.deleteSSOGroups(oauth_group)
        assert.equal(res.status, 404, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'SSO014', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'SSO oauth group not found: '+oauth_group, 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'SSO oauth group not found.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C31523: DELETE > SSO > Groups > Internal > oauth_group does not exist > Validate 404 Not Found is returned', async function () {
        not_exist_oauth_group = '11111111-2222-3333-4444-555555555555'
        res = await requests.deleteSSOGroups(not_exist_oauth_group)
        assert.equal(res.status, 404, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'SSO014', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'SSO oauth group not found: '+not_exist_oauth_group, 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'SSO oauth group not found.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })
})

describe('DELETE /sso/groups (-) - Validate response *sso* *end-to-end*', function () {
    this.timeout(timeout)
    let ssoGroupsRequestBody, ssoApplicationsRequestBody
    let oauth_group, client_id
    let enabled = true
    let res

    before(async function () {
        try {
            ssoGroupsRequestBody = ssoGroupsPayload.postSSOGroups()

            res = await requests.postSSOGroups(ssoGroupsRequestBody)
            oauth_group = res.body.oauth_group

            ssoApplicationsRequestBody = ssoApplicationsPayload.postSSOApplications(oauth_group, enabled)

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C31524: DELETE > SSO > Groups > Internal > oauth_group has assigned sso application > Validate 400 Bad Request is returned', async function () {
        res = await requests.postSSOApplications(ssoApplicationsRequestBody)
        assert.equal(res.status, 201, 'Actual status is ' + res.status)
        client_id = res.body.client_id 

        res = await requests.deleteSSOGroups(oauth_group)
        assert.equal(res.status, 400, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'SSO015', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'Active SSO OAuth App with such an oauth group exists.', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'SSO request validation exception.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    after(async function() {
        await requests.deleteSSOApplications(client_id)
        await requests.deleteSSOGroups(oauth_group)
    })
})