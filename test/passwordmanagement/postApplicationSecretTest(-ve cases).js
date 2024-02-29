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
const applicationSecretPayload = require('../../common/datasource/createApplicationSecrets')

const timeout = config.get('timeout')

describe('POST /applications/app_id/secrets (-) - Validate response *end-to-end*', function () {
    this.timeout(timeout)
    let group_name_int, group_name_ext
    let appRequestBody_int, appRequestBody_ext, appSecretRequestBody
    let app_id_int, app_id_ext
    let admin_id = config.get('admin.corp_id')
    let userName = config.get('admin.username')
    let password = config.get('admin.password')
    let access_token
    let res

    before(async function () {
        try {
            group_name_int = "My Account\\Avijit Test Automation"
            appRequestBody_int = applicationsPayload.postApplications(admin_id, group_name_int)

            group_name_ext = "My Account\\Avijit Test Automation\\Child Group Test"
            appRequestBody_ext = applicationsPayload.postApplications(admin_id, group_name_ext)

            res = await requests.postApplications(appRequestBody_int)
            app_id_int = res.body.app_id
            console.log("app_id is " + app_id_int)

            res = await requests.postOauthToken(userName, password)
            access_token = res.body.access_token

            res = await requests.postApplicationsExt(appRequestBody_ext, access_token, userName)
            app_id_ext = res.body.app_id
            console.log("app_id is " + app_id_ext)

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C20963: POST > Applications > Secrets - Create new secret > Internal > Validate new secret is not created passing not existing app-id *regression*', async function () {
        appSecretRequestBody = applicationSecretPayload.postApplicationsSecrets(false)
        delete appSecretRequestBody.enabled
        delete appSecretRequestBody.description
        res = await requests.postApplicationsAppIdSecrets('12333', appSecretRequestBody, admin_id)
        assert.equal(res.status, '404', 'Actual status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'APP007', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ResultCode', 'Actual element_name is ' +res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'Application does not exist.', 'Actual developer_message is ' +res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Application does not exist.', 'Actual user_message is '+res.body.errors[0].user_message)
    })

    it('C23172: POST > Applications > Secrets - Create new secret > External > Validate new secret is not created passing not existing app-id *regression*', async function () {
        appSecretRequestBody = applicationSecretPayload.postApplicationsSecrets(false)
        delete appSecretRequestBody.enabled
        delete appSecretRequestBody.description
        res = await requests.postApplicationsAppIdSecretsExt('12333', appSecretRequestBody, access_token, userName)
        assert.equal(res.status, '404', 'Actual status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'APP007', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ResultCode', 'Actual element_name is ' +res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'Application does not exist.', 'Actual developer_message is ' +res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Application does not exist.', 'Actual user_message is '+res.body.errors[0].user_message)
    })

    it('C20964: POST > Applications > Secrets - Create new secret > Internal > Validate new secret is not created passing empty app-id *regression*', async function () {
        appSecretRequestBody = applicationSecretPayload.postApplicationsSecrets(false)
        delete appSecretRequestBody.enabled
        delete appSecretRequestBody.description
        res = await requests.postApplicationsAppIdSecrets(``, appSecretRequestBody, admin_id)
        assert.equal(res.status, 400, 'Actual status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'GEN010', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, "Request method 'POST' not supported", 'Actual developer_message is ' +res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Unsupported request.', 'Actual user_message is '+res.body.errors[0].user_message)
    })

    it('C23173: POST > Applications > Secrets - Create new secret > External > Validate new secret is not created passing empty app-id *regression*', async function () {
        appSecretRequestBody = applicationSecretPayload.postApplicationsSecrets(false)
        delete appSecretRequestBody.enabled
        delete appSecretRequestBody.description
        res = await requests.postApplicationsAppIdSecretsExt(``, appSecretRequestBody, access_token, userName)
        assert.equal(res.status, 400, 'Actual status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'GEN010', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, "Request method 'POST' not supported", 'Actual developer_message is ' +res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Unsupported request.', 'Actual user_message is '+res.body.errors[0].user_message)
    })

    it('C23977: POST > Applications > Secrets - Create new secret > Internal > Validate new secret is not created not passing body *regression*', async function () {
        res = await requests.postApplicationsAppIdSecrets(app_id_int, '', admin_id)
        assert.equal(res.status, 400, 'Actual status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'GEN013', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'Request body not readable or missing', 'Actual developer_message is ' +res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Invalid request.', 'Actual user_message is '+res.body.errors[0].user_message)
    })

    it('C23978: POST > Applications > Secrets - Create new secret > External > Validate new secret is not created not passing body *regression*', async function () {
        res = await requests.postApplicationsAppIdSecretsExt(app_id_ext, ``, access_token, userName)
        assert.equal(res.status, 400, 'Actual status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'GEN013', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'Request body not readable or missing', 'Actual developer_message is ' +res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Invalid request.', 'Actual user_message is '+res.body.errors[0].user_message)
    })

    it('C24305: POST > Applications > Secrets - Create new secret > Internal > Validate new secret is not created passing invalid body *regression*', async function () {
        res = await requests.postApplicationsAppIdSecrets(app_id_int, {"Hello": "Hello"}, admin_id)
        assert.equal(res.status, 400, 'Actual status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'GEN013', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'Request body not readable or missing: Unrecognized field "Hello" (class com.j2.core.api.model.request.ApplicationSecretRequest), not marked as ignorable', 'Actual developer_message is ' +res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Invalid request.', 'Actual user_message is '+res.body.errors[0].user_message)
    })

    it('C24307: POST > Applications > Secrets - Create new secret > External > Validate new secret is not created passing invalid body *regression*', async function () {
        res = await requests.postApplicationsAppIdSecretsExt(app_id_ext, {"Hello": "Hello"}, access_token, userName)
        assert.equal(res.status, 400, 'Actual status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'GEN013', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'Request body not readable or missing: Unrecognized field "Hello" (class com.j2.core.api.model.request.ApplicationSecretRequest), not marked as ignorable', 'Actual developer_message is ' +res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Invalid request.', 'Actual user_message is '+res.body.errors[0].user_message)
    })

    it('C25970: POST > Applications > Secrets - Create new secret > Internal > Validate maximum 10 secrets are allowed *regression*', async function () {
        appSecretRequestBody = applicationSecretPayload.postApplicationsSecrets(false)
        for(i=1; i<10; i++) {
            res = await requests.postApplicationsAppIdSecrets(app_id_int, appSecretRequestBody, admin_id)
            assert.equal(res.status, 201, 'Actual status code is '+res.status)
        }
        res = await requests.postApplicationsAppIdSecrets(app_id_int, appSecretRequestBody, admin_id)
        assert.equal(res.status, 400, 'Actual status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'APP019', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ResultCode', 'Actual error_code is '+res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'Number of application secrets reached the limit of 10.', 'Actual developer_message is ' +res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Number of application secrets reached the limit of 10.', 'Actual user_message is '+res.body.errors[0].user_message)
    })

    it('C25971: POST > Applications > Secrets - Create new secret > External > Validate maximum 10 secrets are allowed *regression*', async function () {
        appSecretRequestBody = applicationSecretPayload.postApplicationsSecrets(false)
        for(i=1; i<10; i++) {
            res = await requests.postApplicationsAppIdSecretsExt(app_id_ext, appSecretRequestBody, access_token, userName)
            assert.equal(res.status, 201, 'Actual status code is '+res.status)
        }
        res = await requests.postApplicationsAppIdSecretsExt(app_id_ext, appSecretRequestBody, access_token, userName)
        assert.equal(res.status, 400, 'Actual status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'APP019', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ResultCode', 'Actual error_code is '+res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'Number of application secrets reached the limit of 10.', 'Actual developer_message is ' +res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Number of application secrets reached the limit of 10.', 'Actual user_message is '+res.body.errors[0].user_message)
    })

    it('C36785: POST > Applications > Secrets > Validate error while post applications secrets with invalid content type', async function () {
        res = await requests.postAppAppIdSecretsExtWithInvalidContentType(app_id_ext, appSecretRequestBody, access_token, userName)
        assert.equal(res.status, 400, 'Actual status code is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'GEN013', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, "Content type 'applications/json;charset=UTF-8' not supported", 'Actual error_code is '+res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Invalid request.', 'Actual user_message is '+res.body.errors[0].user_message)
    })

    after(async function () {
        await requests.delApplicationsExt(app_id_ext, appRequestBody_ext, access_token)
        await requests.delApplications(app_id_int, appRequestBody_int)
    })
})