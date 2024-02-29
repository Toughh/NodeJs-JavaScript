/**
 * Import required packages
 */
require('mocha')

var config = require('config')
var assert = require('chai').assert

const requests = require('../../../common/setup/request')

const ssoGroupsPayload = require('../../../common/datasource/createSSOGroups')
const ssoApplicationsPayload = require('../../../common/datasource/createSSOApplications')

const common_utils = require('../../../common/util/commonUtils')

const timeout = config.get('timeout')

describe('PATCH /sso/applications (-) - Validate response *sso* *end-to-end*', function () {
    this.timeout(timeout)
    let ssoGroupsRequestBody, ssoApplicationsRequestBody
    let oauth_group, redirect_url, redirect_url_error, client_id
    let not_exist_oauth_group, update_redirect_url, update_redirect_url_error
    let empty_oauth_group
    let enabled = true
    let randGuid
    let res

    beforeEach(async function () {
        try {
            ssoGroupsRequestBody = ssoGroupsPayload.postSSOGroups()

            res = await requests.postSSOGroups(ssoGroupsRequestBody)
            oauth_group = res.body.oauth_group

            ssoApplicationsRequestBody = ssoApplicationsPayload.postSSOApplications(oauth_group, enabled)

            res = await requests.postSSOApplications(ssoApplicationsRequestBody)
            client_id = res.body.client_id
            redirect_url = res.body.redirect_url
            redirect_url_error = res.body.redirect_url_error
            enabled = res.body.enabled

            randGuid = common_utils.createGUID()

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C31385: PATCH > SSO > Applications > Internal > oauth_group does not exist > Validate 404 Not Found is returned', async function () {
        not_exist_oauth_group = common_utils.randString('not_exist_oauth_group ', 6)
        
        res = await requests.patchSSOApplications({"oauth_group": not_exist_oauth_group}, client_id)
        assert.equal(res.status, 404, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'SSO014', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'SSO oauth group not found: '+not_exist_oauth_group, 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'SSO oauth group not found.', 'Actual user_message is ' + res.body.errors[0].user_message)       
    })

    it('C31464: PATCH > SSO > Applications > Internal > oauth_group is empty > Validate 400 is returned', async function () {        
        res = await requests.patchSSOApplications({'oauth_group': ''}, client_id)
        assert.equal(res.status, 400, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'SSO015', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'SSO OAuth Apps group cannot be blank.', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'SSO request validation exception.', 'Actual user_message is ' + res.body.errors[0].user_message)       
    })

    it('C31386: PATCH > SSO > Applications > Internal > redirect_url is empty > Validate 400 is returned', async function () {
        res = await requests.patchSSOApplications({"redirect_url": ''}, client_id)
        assert.equal(res.status, 400, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'SSO015', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'SSO OAuth Apps redirect URL cannot be blank.', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'SSO request validation exception.', 'Actual user_message is ' + res.body.errors[0].user_message)       
    })

    it('C31387: PATCH > SSO > Applications > Internal > redirect_url_error is empty > Validate 400 is returned', async function () {
        res = await requests.patchSSOApplications({"redirect_url_error": ''}, client_id)
        assert.equal(res.status, 400, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'SSO015', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'SSO OAuth Apps redirect error URL cannot be blank.', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'SSO request validation exception.', 'Actual user_message is ' + res.body.errors[0].user_message)       
    })

    it('C31465: PATCH > SSO > Applications > Internal > client_id does not exist > Validate 400 Not Found is returned', async function () {
        not_exist_client_id = randGuid
        res = await requests.patchSSOApplications({"oauth_group": oauth_group}, randGuid)
        assert.equal(res.status, 404, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'SSO004', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'SSO application not found: '+not_exist_client_id, 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'SSO application not found.', 'Actual user_message is ' + res.body.errors[0].user_message)       
    })

    afterEach(async function() {
        await requests.deleteSSOApplications(client_id)
        await requests.deleteSSOGroups(oauth_group)
    })
})