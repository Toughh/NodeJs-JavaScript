/**
 * Import required packages
 */
require('mocha')
require('../../common/util/testrail-util')

var config = require('config')
var assert = require('chai').assert

const requests = require('../../common/setup/request')
const applicationsPayload = require('../../common/datasource/createApplication')

const timeout = config.get('timeout')

describe('GET Health (-) - Verify response *end-to-end*', function () {
    this.timeout(timeout)
    let res
    let Non_exist_group_name
    let app_requestBody
    let admin_id = config.get('admin.corp_id')

    before(async function () {

        Non_exist_group_name = "My Account\\Group Not Exist"
        app_requestBody = applicationsPayload.postApplications(admin_id, Non_exist_group_name)

    })

    it('C6439: GET > Health - Validate detailed info is hidden for unauthorized users *smoke*', async function () {
        res = await requests.getHealth('WRONG')
        assert.equal(res.status, 401, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'AUT002', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'BadCredentialsException', 'Actual element_name is ' + res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'Account not found.', 'Actual error_code is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'The administrator ID, username or password are incorrect.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C7295: POST > Applications > Create application non existing group > Validate application is not created for a non existing group', async function () {
        res = await requests.postApplications(app_requestBody)
        assert.equal(res.status, 400, 'Actual status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'GEN007', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ResultCode', 'Actual element_name is '+res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'Invalid group name.', 'Actual error_code is '+res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Invalid group name.', 'Actual user_message is '+res.body.errors[0].user_message)
    })

    it('C20921: GET > City > Validate error message return for invalid area code', async function () {
        res = await requests.getCitiesAreaCode(1111)
        assert.equal(res.status, 400, 'Actual status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'USC041', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ResultCode', 'Actual element_name is '+res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'Invalid Area Code for this request.', 'Actual error_code is '+res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Invalid Area Code for this request.', 'Actual user_message is '+res.body.errors[0].user_message)
    })

    it('C21048: GET > City > Validate error message return for area code which has no city assigned', async function () {
        res = await requests.getCitiesAreaCode(809)
        assert.equal(res.status, 200, 'Actual status is '+res.status)
        assert.isArray(res.body)
    })
})