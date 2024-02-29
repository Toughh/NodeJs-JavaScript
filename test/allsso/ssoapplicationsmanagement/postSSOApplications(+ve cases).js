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

describe('POST /sso/applications (+) - Validate response *sso* *end-to-end*', function () {
    this.timeout(timeout)
    let ssoGroupsRequestBody, ssoApplicationsRequestBody
    let oauth_group, redirect_url, redirect_url_error
    let enabled = true
    let client_id
    let res

    before(async function () {
        try {
            ssoGroupsRequestBody = ssoGroupsPayload.postSSOGroups()

            res = await requests.postSSOGroups(ssoGroupsRequestBody)
            oauth_group = res.body.oauth_group

            ssoApplicationsRequestBody = ssoApplicationsPayload.postSSOApplications(oauth_group, enabled)
            redirect_url = ssoApplicationsRequestBody.redirect_url
            redirect_url_error = ssoApplicationsRequestBody.redirect_url_error

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C31374: POST > SSO > Applications > Internal > Create SSO Application > Validate SSO application is created', async function () {
        res = await requests.postSSOApplications(ssoApplicationsRequestBody)
        assert.equal(res.status, 201, 'Actual status is ' + res.status)
        client_id = res.body.client_id
        assert.uuid(res.body.client_id, 'v4')
        assert.isString(res.body.client_secret, 'client_secret is not string type')
        assert.equal(res.body.enabled, enabled, 'Actual status is ' + res.body.enabled)
        assert.equal(res.body.oauth_group, oauth_group, 'Actual oauth_group is ' + res.body.oauth_group)
        assert.equal(res.body.redirect_url, redirect_url, 'Actual redirect_url is ' + res.body.redirect_url)
        assert.equal(res.body.redirect_url_error, redirect_url_error, 'Actual redirect_url_error is ' + res.body.redirect_url_error)
        assert.exists(res.body.create_date, 'create_date does not exist')
        assert.exists(res.body.update_date, 'update_date does not exist')
    })

    after(async function() {
        await requests.deleteSSOApplications(client_id)
        await requests.deleteSSOGroups(oauth_group)
    })
})