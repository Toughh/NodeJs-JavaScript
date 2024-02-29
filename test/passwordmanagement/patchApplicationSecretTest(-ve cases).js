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
const applicationsPayload = require('../../common/datasource/createApplication')
const applicationSecretPayload = require('../../common/datasource/createApplicationSecrets')

const timeout = config.get('timeout')

describe('PATCH /applications/app_id/secrets/secret_id (-) - Validate response *end-to-end*', function () {
    this.timeout(timeout)
    let group_name_int, group_name_ext
    let appRequestBody_int, appRequestBody_ext, appSecretRequestBody
    let app_id_int, app_id_ext, secret_id_int, secret_id_ext
    let randGuid
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

            appSecretRequestBody = applicationSecretPayload.postApplicationsSecrets(false)

            res = await requests.postApplicationsAppIdSecrets(app_id_int, appSecretRequestBody, admin_id)
            secret_id_int = res.body.secret_id

            res = await requests.postApplicationsAppIdSecretsExt(app_id_ext, appSecretRequestBody, access_token, userName)
            secret_id_ext = res.body.secret_id

            appSecretRequestBody = applicationSecretPayload.postApplicationsSecrets(false)
            delete appSecretRequestBody.enabled
            delete appSecretRequestBody.description

            randGuid = common_utils.createGUID()

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C20968: PATCH Applications > Secrets > Update secret > Internal > Validate secret data is NOT updated passing not existing app-id *regression*', async function () {
        res = await requests.patchApplicationsAppIdSecretsSecretId(randGuid, appSecretRequestBody, secret_id_int, admin_id)
        assert.equal(res.status, 404, 'Actual Status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'APP007', 'Actual error_coe is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ResultCode', 'Actual element_name is ' +res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'Application does not exist.', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Application does not exist.', 'Actual user_message is ' +res.body.errors[0].user_message)
    })

    it('C23176: PATCH Applications > Secrets > Update secret > External > Validate secret data is NOT updated passing not existing app-id *regression*', async function () {
        res = await requests.patchApplicationsAppIdSecretsSecretIdExt(randGuid, appSecretRequestBody, access_token, secret_id_ext, admin_id)
        assert.equal(res.status, 404, 'Actual Status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'APP007', 'Actual error_coe is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ResultCode', 'Actual element_name is ' +res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'Application does not exist.', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Application does not exist.', 'Actual user_message is ' +res.body.errors[0].user_message)
    })

    it('C20969: PATCH Applications > Secrets > Update secret > Internal > Validate secret data is NOT updated passing empty app-id *regression*', async function () {
        res = await requests.patchApplicationsAppIdSecretsSecretId(``, appSecretRequestBody, secret_id_int, admin_id)
        assert.equal(res.status, 404, 'Actual Status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'Not Found', 'Actual error_coe is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'No message available', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'No message available', 'Actual user_message is ' +res.body.errors[0].user_message)
    })

    it('C23177: PATCH Applications > Secrets > Update secret > External > Validate secret data is NOT updated passing empty app-id *regression*', async function () {
        res = await requests.patchApplicationsAppIdSecretsSecretIdExt(``, appSecretRequestBody, access_token, secret_id_ext, admin_id)
        assert.equal(res.status, 404, 'Actual Status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'Not Found', 'Actual error_coe is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'No message available', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'No message available', 'Actual user_message is ' +res.body.errors[0].user_message)
    })

    it('C20970: PATCH Applications > Secrets > Update secret > Internal > Validate secret data is NOT updated passing invalid secret-id *regression*', async function () {
        res = await requests.patchApplicationsAppIdSecretsSecretId(app_id_int, appSecretRequestBody, '123', admin_id)
        assert.equal(res.status, 404, 'Actual Status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'APP013', 'Actual error_coe is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ResultCode', 'Actual error_coe is '+res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'No application secret found', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'No application secret found', 'Actual user_message is ' +res.body.errors[0].user_message)
    })

    it('C23178: PATCH Applications > Secrets > Update secret > External > Validate secret data is NOT updated passing invalid secret-id *regression*', async function () {
        res = await requests.patchApplicationsAppIdSecretsSecretIdExt(app_id_ext, appSecretRequestBody, access_token, '123', admin_id)
        assert.equal(res.status, 404, 'Actual Status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'APP013', 'Actual error_coe is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ResultCode', 'Actual error_coe is '+res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'No application secret found', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'No application secret found', 'Actual user_message is ' +res.body.errors[0].user_message)
    })

    it('C20971: PATCH Applications > Secrets > Update secret > Internal > Validate secret data is NOT updated passing not existing secret-id *regression*', async function () {
        res = await requests.patchApplicationsAppIdSecretsSecretId(app_id_int, appSecretRequestBody, randGuid, admin_id)
        assert.equal(res.status, 404, 'Actual Status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'APP013', 'Actual error_coe is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ResultCode', 'Actual error_coe is '+res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'No application secret found', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'No application secret found', 'Actual user_message is ' +res.body.errors[0].user_message)
    })

    it('C23179: PATCH Applications > Secrets > Update secret > External > Validate secret data is NOT updated passing not existing secret-id *regression*', async function () {
        res = await requests.patchApplicationsAppIdSecretsSecretIdExt(app_id_ext, appSecretRequestBody, access_token, randGuid, admin_id)
        assert.equal(res.status, 404, 'Actual Status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'APP013', 'Actual error_coe is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ResultCode', 'Actual error_coe is '+res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'No application secret found', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'No application secret found', 'Actual user_message is ' +res.body.errors[0].user_message)
    })

    it('C20972: PATCH Applications > Secrets > Update secret > Internal > Validate secret data is NOT updated passing empty secret-id *regression*', async function () {
        res = await requests.patchApplicationsAppIdSecretsSecretId(app_id_int, appSecretRequestBody, ``, admin_id)
        assert.equal(res.status, 400, 'Actual Status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'GEN010', 'Actual error_coe is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, "Request method 'PATCH' not supported", 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Unsupported request.', 'Actual user_message is ' +res.body.errors[0].user_message)
    })

    it('C23180: PATCH Applications > Secrets > Update secret > External > Validate secret data is NOT updated passing empty secret-id *regression*', async function () {
        res = await requests.patchApplicationsAppIdSecretsSecretIdExt(app_id_ext, appSecretRequestBody, access_token, ``, admin_id)
        assert.equal(res.status, 400, 'Actual Status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'GEN010', 'Actual error_coe is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, "Request method 'PATCH' not supported", 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Unsupported request.', 'Actual user_message is ' +res.body.errors[0].user_message)
    })

    it('C23982: PATCH Applications > Secrets > Update secret > Internal > Validate new secret is not created not passing body *regression*', async function () {
        res = await requests.patchApplicationsAppIdSecretsSecretId(app_id_int, ``, secret_id_int, admin_id)
        assert.equal(res.status, 400, 'Actual Status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'GEN013', 'Actual error_coe is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, "Request body not readable or missing", 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Invalid request.', 'Actual user_message is ' +res.body.errors[0].user_message)
    })

    it('C23983: PATCH Applications > Secrets > Update secret > External > Validate new secret is not created not passing body *regression*', async function () {
        res = await requests.patchApplicationsAppIdSecretsSecretIdExt(app_id_ext, ``, access_token, secret_id_ext, admin_id)
        assert.equal(res.status, 400, 'Actual Status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'GEN013', 'Actual error_coe is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, "Request body not readable or missing", 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Invalid request.', 'Actual user_message is ' +res.body.errors[0].user_message)
    })

    it('C24306: PATCH Applications > Secrets > Update secret > Internal > Validate new secret is not created passing invalid body *regression*', async function () {
        res = await requests.patchApplicationsAppIdSecretsSecretId(app_id_int, {"Hello": "Hello"}, secret_id_int, admin_id)
        assert.equal(res.status, 400, 'Actual Status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'GEN013', 'Actual error_coe is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'Request body not readable or missing: Unrecognized field "Hello" (class com.j2.core.api.model.request.ApplicationSecretRequest), not marked as ignorable', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Invalid request.', 'Actual user_message is ' +res.body.errors[0].user_message)
    })

    it('C24308: PATCH Applications > Secrets > Update secret > External > Validate new secret is not created passing invalid body *regression*', async function () {
        res = await requests.patchApplicationsAppIdSecretsSecretIdExt(app_id_ext, {"Hello": "Hello"}, access_token, secret_id_ext, admin_id)
        assert.equal(res.status, 400, 'Actual Status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'GEN013', 'Actual error_coe is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'Request body not readable or missing: Unrecognized field "Hello" (class com.j2.core.api.model.request.ApplicationSecretRequest), not marked as ignorable', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Invalid request.', 'Actual user_message is ' +res.body.errors[0].user_message)
    })

    it('C20975: PATCH Applications > Secrets > Update secret > Internal > Validate secret data is NOT updated passing inactive secret-id *regression*', async function () {
        res = await requests.patchApplicationsAppIdSecretsSecretId(app_id_int, appSecretRequestBody, randGuid, admin_id)
        assert.equal(res.status, 404, 'Actual Status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'APP013', 'Actual error_coe is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ResultCode', 'Actual element_name is ' +res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'No application secret found', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'No application secret found', 'Actual user_message is ' +res.body.errors[0].user_message)
    })

    it('C23181: PATCH Applications > Secrets > Update secret > External > Validate secret data is NOT updated passing inactive secret-id *regression*', async function () {
        res = await requests.patchApplicationsAppIdSecretsSecretIdExt(app_id_ext, appSecretRequestBody, access_token, randGuid, admin_id)
        assert.equal(res.status, 404, 'Actual Status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'APP013', 'Actual error_coe is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ResultCode', 'Actual element_name is ' +res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'No application secret found', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'No application secret found', 'Actual user_message is ' +res.body.errors[0].user_message)
    })

    it('C20966: PATCH Applications > Secrets > Internal > Validate invalid parameter is ignored *regression*', async function () {
        appSecretRequestBody.secret_id = randGuid

        res = await requests.patchApplicationsAppIdSecretsSecretId(app_id_int, appSecretRequestBody, secret_id_int, admin_id)
        assert.equal(res.status, 400, 'Actual Status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'GEN013', 'Actual error_coe is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'Request body not readable or missing: Unrecognized field "secret_id" (class com.j2.core.api.model.request.ApplicationSecretRequest), not marked as ignorable', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Invalid request.', 'Actual user_message is ' +res.body.errors[0].user_message)
    })

    it('C23175: PATCH Applications > Secrets > Update secret > External > Validate invalid parameter is ignored *regression*', async function () {
        appSecretRequestBody.secret_id = randGuid
        secret_id_ext = appSecretRequestBody.secret_id
        res = await requests.patchApplicationsAppIdSecretsSecretIdExt(app_id_ext, appSecretRequestBody, access_token, secret_id_ext, admin_id)
        assert.equal(res.status, 400, 'Actual Status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'GEN013', 'Actual error_coe is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'Request body not readable or missing: Unrecognized field "secret_id" (class com.j2.core.api.model.request.ApplicationSecretRequest), not marked as ignorable', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Invalid request.', 'Actual user_message is ' +res.body.errors[0].user_message)
    })

    after(async function () {
        await requests.delApplicationsExt(app_id_ext, appRequestBody_ext, access_token)
        await requests.delApplications(app_id_int, appRequestBody_int)
    })
})