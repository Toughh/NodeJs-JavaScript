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

describe('PUT /sso/applications (+) - Validate response *sso* *end-to-end*', function () {
    this.timeout(timeout)
    let ssoGroupsRequestBody, ssoApplicationsRequestBody
    let oauth_group, redirect_url, redirect_url_error, client_id
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

    it('C31455: PUT > SSO > Applications > Internal > Reset SSO Application Secret > Validate new secret is returned', async function () {  
        res = await requests.putSSOApplications(client_id)
        assert.equal(res.status, 200, 'Actual status is ' + res.status)
        assert.exists(res.body.client_secret, 'client_secret does not exist')
    })

    afterEach(async function() {
        await requests.deleteSSOApplications(client_id)
        await requests.deleteSSOGroups(oauth_group)
    })
})