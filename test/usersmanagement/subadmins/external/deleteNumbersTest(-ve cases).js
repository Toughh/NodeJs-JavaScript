/**
 * Import required packages
 */
require('mocha')
require('../../../../common/util/testrail-util')

var config = require('config')
var assert = require('chai').assert

const requests = require('../../../../common/setup/request')

const timeout = config.get('timeout')

describe('DELETE Numbers (-ve) - Verify error response *end-to-end*', function () {

    this.timeout(timeout)
    let res

    it('C38816: DELETE > Numbers > Validate ERROR when deleting a Fax from user not belonging to subadmins group', async function () {
        const expectedErrorMes = {
            "error_code": "APIU002",
            "element_name": "ValidationResult",
            "developer_message": "Cannot find customer with the specified fax number.",
            "user_message": "Cannot find customer with the specified fax number."
        }

        res = await requests.deleteNumbersFaxNumber('11111111111')
        assert.equal(res.statusCode, 404, 'Actual status code is ' + res.statusCode)
        assert.include(res.body.errors[0], expectedErrorMes, 'Actual Error Message is ' + res.body.errors[0])
    })

    it('C38818: DELETE > Numbers > Validate ERROR when deleting a Fax from user not belonging to subadmins subgroup', async function () {
        const expectedErrorMes = {
            "error_code": "APIU002",
            "element_name": "ValidationResult",
            "developer_message": "Cannot find customer with the specified fax number.",
            "user_message": "Cannot find customer with the specified fax number."
        }

        res = await requests.deleteNumbersFaxNumber('11111111111')
        assert.equal(res.statusCode, 404, 'Actual status code is ' + res.statusCode)
        assert.include(res.body.errors[0], expectedErrorMes, 'Actual Error Message is ' + res.body.errors[0])
    })
})