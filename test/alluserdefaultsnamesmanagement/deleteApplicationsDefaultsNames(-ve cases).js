/**
 * Import required packages
 */
require('mocha')
require('../../common/util/testrail-util')

var config = require('config')
var assert = require('chai').assert

const requests = require('../../common/setup/request')

const timeout = config.get('timeout')

describe('DELETE /applications/defaults/names/id (-) - Verify response *end-to-end*', function () {
    this.timeout(timeout)
    let res

    it('C27002: DELETE user default name > default name using not existing id > Validate 404 Not Found is returned *regression* *smoke*', async function () {
        res = await requests.deleteApplicationsDefaultsNamesId('000')
        assert.equal(res.status, 404, 'Actual status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'DFN002', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ValidationResult', 'Actual element_name is ' + res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'Defaults name does not exist for Id provided.', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Defaults name does not exist for Id provided.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })
})