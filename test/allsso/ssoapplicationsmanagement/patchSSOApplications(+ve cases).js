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

describe('PATCH /sso/applications (+) - Validate response *sso* *end-to-end*', function () {
    this.timeout(timeout)
    let ssoGroupsRequestBody, ssoApplicationsRequestBody
    let oauth_group, redirect_url, redirect_url_error, client_id
    let update_oauth_group, update_redirect_url, update_redirect_url_error
    let enabled = true
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

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C31381: PATCH > SSO > Applications > Internal >  oauth_group > Validate SSO application is updated', async function () {
        update_oauth_group = 'USER'
        
        res = await requests.patchSSOApplications({"oauth_group": update_oauth_group}, client_id)
        assert.equal(res.status, 200, 'Actual status is ' + res.status)
        assert.equal(res.body.client_id, client_id, 'Actual client_id is '+client_id)
        assert.equal(res.body.redirect_url, redirect_url, 'Actual redirect_url is ' + res.body.redirect_url)
        assert.equal(res.body.redirect_url_error, redirect_url_error, 'Actual redirect_url_error is ' + res.body.redirect_url_error)   
        assert.equal(res.body.enabled, enabled, 'Actual enabled boolean value is ' + res.body.enabled)
        assert.equal(res.body.oauth_group, update_oauth_group, 'Actual oauth_group is '+oauth_group)
        assert.exists(res.body.create_date, 'create_date does not exist')
        assert.exists(res.body.update_date, 'update_date does not exist')
    })

    it('C31382: PATCH > SSO > Applications > Internal > redirect_url > Validate SSO application is updated', async function () {
        update_redirect_url = 'http://www.' + common_utils.randString('redirecturl', 8) + ".com"
        
        res = await requests.patchSSOApplications({"redirect_url": update_redirect_url}, client_id)
        assert.equal(res.status, 200, 'Actual status is ' + res.status)
        assert.equal(res.body.client_id, client_id, 'Actual client_id is '+client_id)
        assert.equal(res.body.redirect_url, update_redirect_url, 'Actual redirect_url is ' + res.body.redirect_url)
        assert.equal(res.body.redirect_url_error, redirect_url_error, 'Actual redirect_url_error is ' + res.body.redirect_url_error)   
        assert.equal(res.body.enabled, enabled, 'Actual enabled boolean value is ' + res.body.enabled)
        assert.equal(res.body.oauth_group, oauth_group, 'Actual oauth_group is '+oauth_group)
        assert.exists(res.body.create_date, 'create_date does not exist')
        assert.exists(res.body.update_date, 'update_date does not exist')
    })

    it('C31383: PATCH > SSO > Applications > Internal > redirect_url_error > Validate SSO application is updated', async function () {
        update_redirect_url_error = 'http://www.' + common_utils.randString('redirecturlerror', 8) + ".com"
        
        res = await requests.patchSSOApplications({"redirect_url_error": update_redirect_url_error}, client_id)
        assert.equal(res.status, 200, 'Actual status is ' + res.status)
        assert.equal(res.body.client_id, client_id, 'Actual client_id is '+client_id)
        assert.equal(res.body.redirect_url, redirect_url, 'Actual redirect_url is ' + res.body.redirect_url)
        assert.equal(res.body.redirect_url_error, update_redirect_url_error, 'Actual redirect_url_error is ' + res.body.redirect_url_error)   
        assert.equal(res.body.enabled, enabled, 'Actual enabled boolean value is ' + res.body.enabled)
        assert.equal(res.body.oauth_group, oauth_group, 'Actual oauth_group is '+oauth_group)
        assert.exists(res.body.create_date, 'create_date does not exist')
        assert.exists(res.body.update_date, 'update_date does not exist')
    })

    it('C31384: PATCH > SSO > Applications > Internal > enabled > Validate SSO application is updated', async function () {
        update_enabled = false
        
        res = await requests.patchSSOApplications({"enabled": update_enabled}, client_id)
        assert.equal(res.status, 200, 'Actual status is ' + res.status)
        assert.equal(res.body.client_id, client_id, 'Actual client_id is '+client_id)
        assert.equal(res.body.redirect_url, redirect_url, 'Actual redirect_url is ' + res.body.redirect_url)
        assert.equal(res.body.redirect_url_error, redirect_url_error, 'Actual redirect_url_error is ' + res.body.redirect_url_error)   
        assert.equal(res.body.enabled, update_enabled, 'Actual enabled boolean value is ' + res.body.enabled)
        assert.equal(res.body.oauth_group, oauth_group, 'Actual oauth_group is '+oauth_group)
        assert.exists(res.body.create_date, 'create_date does not exist')
        assert.exists(res.body.update_date, 'update_date does not exist')
    })

    afterEach(async function() {
        await requests.deleteSSOApplications(client_id)
        await requests.deleteSSOGroups(oauth_group)
    })
})