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

describe('DELETE /sso/applications (+) - Validate response *sso* *end-to-end*', function () {
    this.timeout(timeout)
    let ssoGroupsRequestBody, ssoApplicationsRequestBody
    let oauth_group, client_id
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

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C31390: DELETE > SSO > Applications > Internal > Validate SSO application is deleted', async function () {
        res = await requests.deleteSSOApplications(client_id)
        assert.equal(res.status, 204, 'Actual status is '+res.status)

        res = await requests.getSSOApplications(client_id)
        assert.equal(res.status, 404, 'Actual status is '+res.status)
    })

    after(async function() {
        await requests.deleteSSOApplications(client_id)
        await requests.deleteSSOGroups(oauth_group)
    })
})