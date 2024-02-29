/**
 * Import required packages
 */
require('mocha')

var config = require('config')
var assert = require('chai').assert

const requests = require('../../../common/setup/request')
const ssoGroupsPayload = require('../../../common/datasource/createSSOGroups')

const timeout = config.get('timeout')

describe('POST /sso/groups (+) - Validate response *sso* *end-to-end*', function () {
    this.timeout(timeout)
    let ssoGroupsRequestBody
    let oauth_group, group_name, group_description
    let res

    before(async function () {
        ssoGroupsRequestBody = ssoGroupsPayload.postSSOGroups()
        oauth_group = ssoGroupsRequestBody.oauth_group
        group_name = ssoGroupsRequestBody.group_name
        group_description = ssoGroupsRequestBody.group_description
    })

    it('C31499: POST > SSO > Groups > Internal > Validate SSO oauth group is created when sending all fields', async function () {
        res = await requests.postSSOGroups(ssoGroupsRequestBody)
        assert.equal(res.status, 201, 'Actual status is ' + res.status)
        assert.equal(res.body.oauth_group, oauth_group, 'Actual status is ' + res.body.oauth_group)
        assert.equal(res.body.group_name, group_name, 'Actual status is ' + res.body.group_name)
        assert.equal(res.body.group_description, group_description, 'Actual status is ' + res.body.group_description)
    })

    after(async function() {
        await requests.deleteSSOGroups(oauth_group)
    })
})