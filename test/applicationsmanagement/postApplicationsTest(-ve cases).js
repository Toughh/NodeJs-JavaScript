/**
 * Import required packages
 */
require('mocha')
require('../../common/util/testrail-util')

var config = require('config')
var assert = require('chai').assert

const requests = require('../../common/setup/request')
const applicationsPayload = require('../../common/datasource/createApplication')
const applicationSecretPayload = require('../../common/datasource/createApplicationSecrets')

const timeout = config.get('timeout')

describe('POST /applications (-) *end-to-end*', function () {
    this.timeout(timeout)
    let par_group_name, child_group_name
    let par_app_requestBody, child_app_requestBody
    let par_app_id, child_app_id
    let admin_id = config.get('admin.corp_id')
    let res

    before(async function () {
        try {
            par_group_name = "My Account\\Avijit Test Automation"
            par_app_requestBody = applicationsPayload.postApplications(admin_id, par_group_name)

            child_group_name = "My Account\\Avijit Test Automation\\Child Group Test"
            child_app_requestBody = applicationsPayload.postApplications(admin_id, child_group_name)

            res = await requests.postApplications(par_app_requestBody)
            par_app_id = res.body.app_id
            console.log("Parent app_id is " + par_app_id)

            res = await requests.postApplications(child_app_requestBody)
            child_app_id = res.body.app_id
            console.log("Child app_id is " + child_app_id)

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C28038: POST Applications > Validate error if group_id is already associated to an application - verify response', async function () {
        res = await requests.postApplications(par_app_requestBody)
        assert.equal(res.status, 400, 'Actual status code is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'GEN007', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ResultCode', 'Actual element_name is '+res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, "Group name is already associated to an application", 'Actual error_code is '+res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Invalid group name.', 'Actual user_message is '+res.body.errors[0].user_message)
    })
    
    it('C28037: POST Applications > Validate error if child group_id corresponding to parent group_id is already associated to an application - verify response', async function () {
        res = await requests.postApplications(child_app_requestBody)
        assert.equal(res.status, 400, 'Actual status code is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'GEN007', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ResultCode', 'Actual element_name is '+res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'Group name is already associated to an application', 'Actual error_code is '+res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Invalid group name.', 'Actual user_message is '+res.body.errors[0].user_message)
    }) 

    it('C28035: POST Applications > Validate error if group_name is NOT passed - verify response', async function () {
        delete par_app_requestBody.group_name
        res = await requests.postApplications(par_app_requestBody)
        assert.equal(res.status, 400, 'Actual status code is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'APP003', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ValidationResult', 'Actual element_name is '+res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'The Group name cannot be empty.', 'Actual error_code is '+res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'The Group name cannot be empty.', 'Actual user_message is '+res.body.errors[0].user_message)
    })

    it('C10142: POST Applications > Validate group name is mandatory', async function () {
        appSecretRequestBody = applicationSecretPayload.postApplicationsSecrets(false)
        delete par_app_requestBody.group_name
        res = await requests.postApplications(par_app_requestBody)
        assert.equal(res.status, 400, 'Actual status code is '+res.status)
    })

    it('C27734: POST > Applications > Secrets - Validate error on expiration field if posted incorrect datetime format', async function () {
        appSecretRequestBody = applicationSecretPayload.postApplicationsSecrets(false)
        appSecretRequestBody.expiration = '2020-11-16'
        res = await requests.postApplicationsAppIdSecrets(123, appSecretRequestBody, admin_id)
        assert.equal(res.status, 400, 'Actual status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'GEN013', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'Request body not readable or missing: Cannot deserialize value of type `java.time.Instant` from String "2020-11-16": Failed to deserialize java.time.Instant: (java.time.format.DateTimeParseException) Text ' + "'" + '2020-11-16' + "'" + ' could not be parsed at index 10', 'Actual developer_message is '+res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Invalid request.', 'Actual user_message is '+res.body.errors[0].user_message)
    })

    it('C27736: POST > Applications > Secrets - Validate response on posting invalid admin_username', async function () {
        appSecretRequestBody = applicationSecretPayload.postApplicationsSecrets(false)
        res = await requests.postApplicationsAppIdSecrets(par_app_id, appSecretRequestBody, 'Invalid')
        assert.equal(res.status, 401, 'Actual status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'AUT002', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'BadCredentialsException', 'Actual element_name is '+res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'Account not found.', 'Actual error_code is '+res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'The administrator ID, username or password are incorrect.', 'Actual user_message is '+res.body.errors[0].user_message)
    })

    it('C27737: POST > Applications > Secrets - Validate response on posting invalid app_id', async function () {
        appSecretRequestBody = applicationSecretPayload.postApplicationsSecrets(false)
        res = await requests.postApplicationsAppIdSecrets(par_app_id, appSecretRequestBody, '37666')
        assert.equal(res.status, 401, 'Actual status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'AUT002', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'BadCredentialsException', 'Actual element_name is '+res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'Account not found.', 'Actual error_code is '+res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'The administrator ID, username or password are incorrect.', 'Actual user_message is '+res.body.errors[0].user_message)
    })

    it('C21049: POST > Applications - Validate that error message displayed when pass invalid element in body', async function () {
        delete par_app_requestBody.company_name
        par_app_requestBody.company = 'Wrong Key Company'
        res = await requests.postApplications(par_app_requestBody)
        assert.equal(res.status, 400, 'Actual status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'GEN013', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'Request body not readable or missing: Unrecognized field "company" (class com.j2.core.api.model.request.ApplicationRequest), not marked as ignorable', 'Actual error_code is '+res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Invalid request.', 'Actual user_message is '+res.body.errors[0].user_message)
    })

    it('C32058: POST > Applications > region field in the body > Validate error with 400', async function () {
        delete par_app_requestBody.company
        par_app_requestBody.region = 'US'
        res = await requests.postApplications(par_app_requestBody)
        assert.equal(res.status, 400, 'Actual status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'GEN013', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'Request body not readable or missing: Unrecognized field "region" (class com.j2.core.api.model.request.ApplicationRequest), not marked as ignorable', 'Actual developer_message is '+res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Invalid request.', 'Actual user_message is '+res.body.errors[0].user_message)
    })

    after(async function () {
        await requests.delApplications(child_app_id, child_app_requestBody)
        await requests.delApplications(par_app_id, par_app_requestBody)
    })
})

describe('POST /applications after patch- Validate response *end-to-end*', function () {
    this.timeout(timeout)
    let par_group_name, child_group_name
    let par_appRequestBody, child_appRequestBody
    let par_app_id, child_app_id
    let admin_id = config.get('admin.corp_id')
    let res

    before(async function () {
        try {
            par_group_name = "My Account\\Avijit Test Automation"
            par_appRequestBody = applicationsPayload.postApplications(admin_id, par_group_name)

            child_group_name = "My Account\\Avijit Test Automation\\Child Group Test"

            res = await requests.postApplications(par_appRequestBody)
            assert.equal(res.status, 201, 'Actual status is ' + res.status)
            par_app_id = res.body.app_id
            console.log("Parent app_id is " + par_app_id)

            par_appRequestBody.group_name = child_group_name
            res = await requests.patchApplications(par_app_id, par_appRequestBody, admin_id)
            assert.equal(res.status, 200, 'Actual status is ' + res.status)
            child_app_id = res.body.app_id

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C30128: POST > Applications >  Validate error while post application with child_group after post application with parent group followed by patch application with child_group *smoke*', async function () {
        child_appRequestBody = applicationsPayload.postApplications(admin_id, child_group_name)
        res = await requests.postApplications(child_appRequestBody)
        assert.equal(res.status, 400, 'Actual status code is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'GEN007', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ResultCode', 'Actual element_name is '+res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'Group name is already associated to an application', 'Actual error_code is '+res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Invalid group name.', 'Actual user_message is '+res.body.errors[0].user_message)
    })

    it('C36783: POST > Applications >  Validate error while post application with invalid content type', async function () {
        child_appRequestBody = applicationsPayload.postApplications(admin_id, child_group_name)
        res = await requests.postAppWithInvalidContentType(child_appRequestBody)
        assert.equal(res.status, 400, 'Actual status code is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'GEN013', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, "Content type 'applications/json;charset=UTF-8' not supported", 'Actual error_code is '+res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Invalid request.', 'Actual user_message is '+res.body.errors[0].user_message)
    })

    after(async function () {
        await requests.delApplications(child_app_id, child_appRequestBody)
        await requests.delApplications(par_app_id, par_appRequestBody)
    })
})