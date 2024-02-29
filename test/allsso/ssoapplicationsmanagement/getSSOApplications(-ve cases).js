/**
 * Import required packages
 */
require('mocha')

var config = require('config')
var assert = require('chai').assert

const requests = require('../../../common/setup/request')
const common_utils = require('../../../common/util/commonUtils')
const timeout = config.get('timeout')

describe('GET /sso/applications (-) - Validate response *sso* *end-to-end*', function () {
    this.timeout(timeout)
    let not_exist_client_id
    let res

    it('C31389: GET > SSO > Applications > Internal > client_id does not exist > Validate 404 Not Found is returned', async function () {
        not_exist_client_id = common_utils.createGUID()
        res = await requests.getSSOApplications(not_exist_client_id)
        assert.equal(res.status, 404, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'SSO004', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'SSO application not found: '+not_exist_client_id, 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'SSO application not found.', 'Actual user_message is ' + res.body.errors[0].user_message)              
    })
})