/**
 * Import required packages
 */
require('mocha')
require('../../common/util/testrail-util')

var config = require('config')
var assert = require('chai').assert

const requests = require('../../common/setup/request')

const timeout = config.get('timeout')

describe('Get Numbers (-) - Verify error message *end-to-end*', function () {
    this.timeout(timeout)
    let res
    let userName = config.get('admin.username')

    it('C27368: Get > Numbers > Assigned > Validate if valid Response code is 400 for invalid path parameter in /numbers/assigned/unassigned end point *smoke*', async function () {
        res = await requests.getNumberAssigned(userName, '10a', '80a')
        assert.equal(res.status, 400, 'Actual status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'GEN014', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ResultCode', 'Actual element_name is '+res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, "Invalid number.", 'Actual element_name is '+res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Invalid number.', 'Actual user_message is '+res.body.errors[0].user_message)
    })
})