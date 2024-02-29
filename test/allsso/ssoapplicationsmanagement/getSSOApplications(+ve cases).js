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

describe('GET /sso/applications (+) - Validate response *sso* *end-to-end*', function () {
    this.timeout(timeout)
    let ssoGroupsRequestBody, ssoApplicationsRequestBody
    let oauth_group, client_id, client_secret, redirect_url, redirect_url_error
    let enabled = true
    let res

    before(async function () {
        try {
            ssoGroupsRequestBody = ssoGroupsPayload.postSSOGroups()

            res = await requests.postSSOGroups(ssoGroupsRequestBody)
            oauth_group = res.body.oauth_group

            ssoApplicationsRequestBody = ssoApplicationsPayload.postSSOApplications(oauth_group, enabled)

            res = await requests.postSSOApplications(ssoApplicationsRequestBody)
            client_id = res.body.client_id
            client_secret = res.body.client_secret
            enabled = res.body.enabled
            oauth_group = res.body.oauth_group
            redirect_url = res.body.redirect_url
            redirect_url_error = res.body.redirect_url_error

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C31388: GET > SSO > Applications > Internal > Validate SSO application details are returned', async function () {
        res = await requests.getSSOApplications(client_id)
        assert.equal(res.status, 200, 'Actual status is ' + res.status)
        assert.equal(res.body.client_id, client_id, 'client_id is not same as Poat Applications')
        assert.notExists(res.body.client_secret, 'client_secret exist')
        assert.equal(res.body.enabled, enabled, 'enabled is not same as Post Applications')
        assert.equal(res.body.oauth_group, oauth_group, 'oauth_group is not same as Post Applications')
        assert.equal(res.body.redirect_url, redirect_url, 'redirect_url is not same as Post Applications')
        assert.equal(res.body.redirect_url_error, redirect_url_error, 'redirect_url_error is not same as Post Applications')
        assert.exists(res.body.create_date, 'create_date does not exist')
        assert.exists(res.body.update_date, 'update_date does not exist')
    })

    after(async function() {
        await requests.deleteSSOApplications(client_id)
        await requests.deleteSSOGroups(oauth_group)
    })
})