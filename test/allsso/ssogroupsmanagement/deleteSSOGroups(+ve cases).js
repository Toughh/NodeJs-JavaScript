/**
 * Import required packages
 */
require('mocha')

var config = require('config')
var assert = require('chai').assert

const requests = require('../../../common/setup/request')
const ssoGroupsPayload = require('../../../common/datasource/createSSOGroups')

const timeout = config.get('timeout')

describe('DELETE /sso/groups (+) - Validate response *sso* *end-to-end*', function () {
    this.timeout(timeout)
    let ssoGroupsRequestBody
    let oauth_group
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

    it('C31521: DELETE > SSO > Groups > Internal > Validate SSO oauth group is deleted *sso*', async function () {
        res = await requests.deleteSSOGroups(oauth_group)
        assert.equal(res.status, 204, 'Actual status is ' + res.status)
        
        res = await requests.getSSOGroups(oauth_group)
        assert.equal(res.status, 404, 'Actual status is ' + res.status)
    })
})