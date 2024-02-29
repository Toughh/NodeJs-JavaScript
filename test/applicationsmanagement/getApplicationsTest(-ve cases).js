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

describe('GET applications - Verify Inactive user *end-to-end*', function () {
    this.timeout(timeout)
    let par_group_name, child_group_name
    let par_app_requestBody, child_app_requestBody
    let par_app_id, child_app_id
    let admin_id = config.get('admin.corp_id')
    let res_par, res_child, res

    before(async function () {
        try {
            par_group_name = "My Account\\Avijit Test Automation"
            par_app_requestBody = applicationsPayload.postApplications(admin_id, par_group_name)

            res_par = await requests.postApplications(par_app_requestBody)
            par_app_id = res_par.body.app_id
            console.log("Parent app_id is " + par_app_id)

            child_group_name = "My Account\\Avijit Test Automation\\Child Group Test"
            child_app_requestBody = applicationsPayload.postApplications(admin_id, child_group_name)

            res_child = await requests.postApplications(child_app_requestBody)
            child_app_id = res_child.body.app_id
            console.log("Child app_id is " + child_app_id)

            await requests.delApplications(child_app_id, child_app_requestBody)

            await requests.delApplications(par_app_id, par_app_requestBody)

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C11042: GET > Applications > Parent Group > Validate inactive notification details in the application info not displayed *smoke*', async function () {
        res = await requests.getApplications(par_app_id)
    })

    it('C11042: GET > Applications > Child Group > Validate inactive notification details in the application info not displayed', async function () {
        res = await requests.getApplications(child_app_id)
    })

    afterEach(async function () {
        assert.equal(res.status, 404, 'Actual Status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'APP007', 'Actual error_coe is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ResultCode', 'Actual element_name is ' +res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'Application does not exist.', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Application does not exist.', 'Actual user_message is ' +res.body.errors[0].user_message)
    })
})