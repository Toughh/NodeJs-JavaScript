/**
 * Import required packages
 */
require('mocha')

var config = require('config')
var assert = require('chai').assert

const requests = require('../../../common/setup/request')

const timeout = config.get('timeout')

describe('GET /sso/users (-) - Validate response *sso* *end-to-end*', function () {
    this.timeout(timeout)
    let not_exist_sso_user_id, not_exist_users_customer_key
    let res

    it('C31157: GET > SSO > Users > Internal > sso_user_id does not exist > Validate 404 Not Found error is returned', async function () {
        not_exist_sso_user_id = '11111111-2222-3333-4444-555555555555'
        res = await requests.getSSOUsers(not_exist_sso_user_id)
        assert.equal(res.status, 404, 'Actual status code is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'SSO006', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'SSO user not found: ' + not_exist_sso_user_id, 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'SSO user not found.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C32034: GET > SSO > Users > customer_key > Internal > Validate 400 returned if user has existing customer_key but not sso user', async function () {
        not_exist_users_customer_key = '11111111'
        res = await requests.getUsersCustomerKeySSO(not_exist_users_customer_key)
        assert.equal(res.status, 404, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'SSO006', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'SSO user with customer key not found: ' + not_exist_users_customer_key, 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'SSO user not found.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })
})