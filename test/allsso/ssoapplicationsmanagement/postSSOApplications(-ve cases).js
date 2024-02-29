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

describe('POST /sso/applications (-) - Validate response *sso* *end-to-end*', function () {
    this.timeout(timeout)
    let ssoGroupsRequestBody, ssoApplicationsRequestBody
    let oauth_group
    let enabled = true
    let client_id
    let not_exist_oauth_group
    let res

    before(async function () {
        try {
            ssoGroupsRequestBody = ssoGroupsPayload.postSSOGroups()

            res = await requests.postSSOGroups(ssoGroupsRequestBody)
            oauth_group = res.body.oauth_group

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C31375: POST > SSO > Applications > Internal > oauth_group does not exist > Validate 404 Not Found is returned', async function () {
        not_exist_oauth_group = 'oauth_group_not_exist'
        ssoApplicationsRequestBody = ssoApplicationsPayload.postSSOApplications(not_exist_oauth_group, enabled)
        
        res = await requests.postSSOApplications(ssoApplicationsRequestBody)
        assert.equal(res.status, 404, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'SSO014', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'SSO oauth group not found: '+not_exist_oauth_group, 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'SSO oauth group not found.', 'Actual user_message is ' + res.body.errors[0].user_message)       
    })

    it('C31376: POST > SSO > Applications > Internal > oauth_group is empty string > Validate 400 Not Found is returned', async function () {
        ssoApplicationsRequestBody = ssoApplicationsPayload.postSSOApplications(oauth_group, enabled)
        ssoApplicationsRequestBody.oauth_group = ''
        
        res = await requests.postSSOApplications(ssoApplicationsRequestBody)
        assert.equal(res.status, 400, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'SSO015', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'SSO OAuth group is not specified.', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'SSO request validation exception.', 'Actual user_message is ' + res.body.errors[0].user_message)       
    })

    it('C31462: POST > SSO > Applications > Internal > redirect_url is empty string > Validate 400 Bad Request is returned', async function () {
        ssoApplicationsRequestBody = ssoApplicationsPayload.postSSOApplications(oauth_group, enabled)
        ssoApplicationsRequestBody.redirect_url = ''
        
        res = await requests.postSSOApplications(ssoApplicationsRequestBody)
        assert.equal(res.status, 400, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'SSO015', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'SSO redirect URL is not specified.', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'SSO request validation exception.', 'Actual user_message is ' + res.body.errors[0].user_message)       
    })

    it('C31377: POST > SSO > Applications > Internal > redirect_url_error is empty string > Validate 400 Bad Request is returned', async function () {
        ssoApplicationsRequestBody = ssoApplicationsPayload.postSSOApplications(oauth_group, enabled)
        ssoApplicationsRequestBody.redirect_url_error = ''
        
        res = await requests.postSSOApplications(ssoApplicationsRequestBody)
        assert.equal(res.status, 400, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'SSO015', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'SSO redirect error URL is not specified.', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'SSO request validation exception.', 'Actual user_message is ' + res.body.errors[0].user_message)       
    })

    it('C31378: POST > SSO > Applications > Internal > oauth_group is missing > Validate 400 Bad Request is returned', async function () {
        ssoApplicationsRequestBody = ssoApplicationsPayload.postSSOApplications(oauth_group, enabled)
        delete ssoApplicationsRequestBody.oauth_group
        
        res = await requests.postSSOApplications(ssoApplicationsRequestBody)
        assert.equal(res.status, 400, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'SSO015', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'SSO OAuth group is not specified.', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'SSO request validation exception.', 'Actual user_message is ' + res.body.errors[0].user_message)       
    })

    it('C31379: POST > SSO > Applications > Internal > redirect_url is missing > Validate 400 Bad Request is returned', async function () {
        ssoApplicationsRequestBody = ssoApplicationsPayload.postSSOApplications(oauth_group, enabled)
        delete ssoApplicationsRequestBody.redirect_url
        
        res = await requests.postSSOApplications(ssoApplicationsRequestBody)
        assert.equal(res.status, 400, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'SSO015', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'SSO redirect URL is not specified.', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'SSO request validation exception.', 'Actual user_message is ' + res.body.errors[0].user_message)       
    })

    it('C31380: POST > SSO > Applications > Internal > redirect_url_error is missing > Validate 400 Bad Request is returned', async function () {
        ssoApplicationsRequestBody = ssoApplicationsPayload.postSSOApplications(oauth_group, enabled)
        delete ssoApplicationsRequestBody.redirect_url_error
        
        res = await requests.postSSOApplications(ssoApplicationsRequestBody)
        assert.equal(res.status, 400, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'SSO015', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'SSO redirect error URL is not specified.', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'SSO request validation exception.', 'Actual user_message is ' + res.body.errors[0].user_message)       
    })

    after(async function() {
        await requests.deleteSSOGroups(oauth_group)
    })
})