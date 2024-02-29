/**
 * Import required packages
 */
require('mocha')
require('../../common/util/testrail-util')

var config = require('config')
var assert = require('chai').assert
const chai = require('chai')
chai.use(require('chai-uuid'))

const requests = require('../../common/setup/request')

const common_utils = require('../../common/util/commonUtils')

const timeout = config.get('timeout')

describe('Put /applications (-) *end-to-end*', function () {
    this.timeout(timeout)
    let res

    before(async function () {
        try {
            
            rand_app_id = common_utils.createGUID()
        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C36628: Put > Applications - Validate error if app_id does not exist', async function () {
        res = await requests.putApplicationsAppIdRefresh(rand_app_id)
        assert.equal(res.status, 404, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'APP007', 'Actual error_coe is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ResultCode', 'Actual element_name is ' +res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'Application does not exist.', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Application does not exist.', 'Actual user_message is ' +res.body.errors[0].user_message)
    })
})