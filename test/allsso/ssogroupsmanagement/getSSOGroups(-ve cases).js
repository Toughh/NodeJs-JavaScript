/**
 * Import required packages
 */
require('mocha')

var config = require('config')
var assert = require('chai').assert

const requests = require('../../../common/setup/request')
const ssoGroupsPayload = require('../../../common/datasource/createSSOGroups')

const timeout = config.get('timeout')

describe('GET /sso/groups (-) - Validate response *sso* *end-to-end*', function () {
    this.timeout(timeout)
    let ssoGroupsRequestBody
    let oauth_group, not_exist_oauth_group, inactive_oauth_group
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

    it('C31510: GET > SSO > Groups > Internal > oauth_group does not exist > Validate 404 Not Found error is returned', async function () {
        not_exist_oauth_group = '11111111-2222-3333-4444-555555555555'
        
        res = await requests.getSSOGroups(not_exist_oauth_group)
        assert.equal(res.status, 404, 'Actual status code is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'SSO014', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'SSO oauth group not found: '+not_exist_oauth_group, 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'SSO oauth group not found.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C31509: GET > SSO > Groups > Internal > oauth_group is inactive > Validate 404 Not Found error is returned', async function () {
        res = await requests.deleteSSOGroups(oauth_group)
        assert.equal(res.status, 204, 'Actual status code is '+res.status)
        inactive_oauth_group = oauth_group
        
        res = await requests.getSSOGroups(inactive_oauth_group)
        assert.equal(res.status, 404, 'Actual status code is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'SSO014', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'SSO oauth group not found: '+inactive_oauth_group, 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'SSO oauth group not found.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })
})