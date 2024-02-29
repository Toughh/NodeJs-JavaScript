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
const applicationsPayload = require('../../common/datasource/createApplication')

const timeout = config.get('timeout')

describe('PATCH applications (-) - verify response  *end-to-end*', function () {
    this.timeout(timeout)
    let group_name
    let app_requestBody, app_id
    let admin_id = config.get('admin.corp_id')
    let res

    beforeEach(async function () {
        try {
            group_name = "My Account\\Avijit Test Automation"
            app_requestBody = applicationsPayload.postApplications(admin_id, group_name)

            res = await requests.postApplications(app_requestBody)
            app_id = res.body.app_id
            console.log("app_id is " + app_id)
        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C29514: PATCH > Applications - Validate error if passing invalid group_name that does not exist *smoke*', async function () {
        app_requestBody.group_name = "Not_Existing_Group_Name"
        res = await requests.patchApplications(app_id, app_requestBody, admin_id)
        assert.equal(res.status, 400, 'Actual status code is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'GEN007', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ResultCode', 'Actual element_name is '+res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'Invalid group name.', 'Actual error_code is '+res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Invalid group name.', 'Actual user_message is '+res.body.errors[0].user_message)
    })

    //no error on passing invalid email
    it.skip('C30106: PATCH > Applications - Validate error on passing invalid contact_email', async function () {
        app_requestBody.contact_email = 'InvalidEmail123'
        res = await requests.patchApplications(app_id, app_requestBody, admin_id)
        assert.equal(res.status, 400, 'Actual Status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'APP010', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ValidationResult', 'Actual element_name is ' +res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'Incorrect email format.', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Incorrect email format.', 'Actual user_message is ' +res.body.errors[0].user_message)
    })

    it('C32059: PATCH > Applications > Send only region in the body > Validate status code 400', async function () {
        res = await requests.patchApplications(app_id, {'region': 'US'}, admin_id)
        assert.equal(res.status, 400, 'Actual Status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'GEN013', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'Request body not readable or missing: Unrecognized field "region" (class com.j2.core.api.model.request.ApplicationRequest), not marked as ignorable', 'Actual developer_message is '+res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Invalid request.', 'Actual user_message is '+res.body.errors[0].user_message)
    })

    it('C33069: PATCH > Applications - Validate that error message displayed when pass invalid element in body', async function () {
        delete app_requestBody.company_name
        app_requestBody.company = 'Wrong Key Company'
        res = await requests.patchApplications(app_id, app_requestBody, admin_id)
        assert.equal(res.status, 400, 'Actual status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'GEN013', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'Request body not readable or missing: Unrecognized field "company" (class com.j2.core.api.model.request.ApplicationRequest), not marked as ignorable', 'Actual error_code is '+res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Invalid request.', 'Actual user_message is '+res.body.errors[0].user_message)
    })

    afterEach(async function () {
        res = await requests.delApplications(app_id, app_requestBody)
        assert.equal(res.status, 204, 'Actual status is '+res.status)
    })
})