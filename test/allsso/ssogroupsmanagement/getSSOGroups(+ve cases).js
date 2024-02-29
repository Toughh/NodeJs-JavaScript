/**
 * Import required packages
 */
require('mocha')

var config = require('config')
var assert = require('chai').assert

const requests = require('../../../common/setup/request')
const common_service = require('../../../common/setup/service')

const ssoGroupsPayload = require('../../../common/datasource/createSSOGroups')

const timeout = config.get('timeout')

describe('GET /sso/groups (+) - Validate response *sso* *end-to-end*', function () {
    this.timeout(timeout)
    let ssoGroupsRequestBody
    let oauth_group, group_name, group_description
    let res

    before(async function () {
        try {
            ssoGroupsRequestBody = ssoGroupsPayload.postSSOGroups()

            res = await requests.postSSOGroups(ssoGroupsRequestBody)
            oauth_group = res.body.oauth_group
            group_name = res.body.group_name
            group_description = res.body.group_description

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C31508: GET > SSO > Groups > Internal > Validate SSO oauth group details are returned', async function () {
        res = await requests.getSSOGroups(oauth_group)
        assert.equal(res.status, 200, 'Actual status is ' + res.status)
        assert.equal(res.body.oauth_group, oauth_group, 'Actual status is ' + res.body.oauth_group)
        assert.equal(res.body.group_name, group_name, 'Actual status is ' + res.body.group_name)
        assert.equal(res.body.group_description, group_description, 'Actual status is ' + res.body.group_description)
        assert.exists(res.body.update_date, 'update_date not exist')
    })

    it('C31511: GET > SSO > Groups > Internal > Validate several SSO oauth groups details are returned', async function () {
        res = await requests.getSSOGroups(``)
        assert.equal(res.status, 200, 'Actual status is ' + res.status)
        assert.isAbove(common_service.resArrayLength(res.body), 1, 'Actual array length is/are ' + common_service.resArrayLength(res.body) + ' in length')
    })

    after(async function() {
        await requests.deleteSSOGroups(oauth_group)
    })
})