/**
 * Import required packages
 */
require('mocha')

var config = require('config')
var assert = require('chai').assert

const requests = require('../../../common/setup/request')

const timeout = config.get('timeout')

describe('DELETE /sso/users (-) - Validate response *sso* *end-to-end*', function () {
    this.timeout(timeout)
    let nonExist_sso_user_id
    let res

    it('C31264: DELETE > SSO > Users > Internal > sso_user_id does not exist > Validate 404 Not Found error is returned', async function () {
        nonExist_sso_user_id = '11111111-2222-3333-4444-555555555555'
        res = await requests.deleteSSOUsers(nonExist_sso_user_id)
        assert.equal(res.status, 404, 'Actual status code is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'SSO006', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'SSO user not found: ' + nonExist_sso_user_id, 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'SSO user not found.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })
})