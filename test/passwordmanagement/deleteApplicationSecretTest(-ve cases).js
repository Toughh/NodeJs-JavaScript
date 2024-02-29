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
const common_utils = require('../../common/util/commonUtils')

const timeout = config.get('timeout')

describe('DELETE /applications/app_id/secrets (-) - Validate response *end-to-end*', function () {
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
            appSecretRequestBody.expiration = '2025-02-14T06:15:07.261+0000'

            res = await requests.postApplicationsAppIdSecrets(app_id_int, appSecretRequestBody, admin_id)
            secret_id_int = res.body.secret_id

            res = await requests.postApplicationsAppIdSecretsExt(app_id_ext, appSecretRequestBody, access_token, userName)
            secret_id_ext = res.body.secret_id

            randGuid = common_utils.createGUID()

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C20980: DELETE Applications > Secrets > Internal - Validate error passing not existing app-id *regression* *smoke*', async function () {
        res = await requests.delApplicationsAppIdSecretsSecretId(randGuid, appSecretRequestBody, secret_id_int, admin_id)
        assert.equal(res.status, 404, 'Actual Status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'APP007', 'Actual error_coe is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ResultCode', 'Actual element_name is ' +res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'Application does not exist.', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Application does not exist.', 'Actual user_message is ' +res.body.errors[0].user_message)
    })

    it('C20981: DELETE Applications > Secrets > Internal - Validate error passing empty app-id *regression*', async function () {
        res = await requests.delApplicationsAppIdSecretsSecretId(``, appSecretRequestBody, secret_id_int, admin_id)
        assert.equal(res.status, 404, 'Actual Status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'Not Found', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'No message available', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'No message available', 'Actual user_message is ' +res.body.errors[0].user_message)
    })

    it('C20982: DELETE Applications > Secrets > Internal - Validate error passing invalid secret-id *regression*', async function () {
        res = await requests.delApplicationsAppIdSecretsSecretId(app_id_int, appSecretRequestBody, `invalid`, admin_id)
        assert.equal(res.status, 404, 'Actual Status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'APP013', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ResultCode', 'Actual element_name is ' +res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'No application secret found', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'No application secret found', 'Actual user_message is ' +res.body.errors[0].user_message)
    })

    it('C20983: DELETE Applications > Secrets > Internal - Validate error passing inactive secret-id *regression*', async function () {
        res = await requests.delApplicationsAppIdSecretsSecretId(app_id_int, appSecretRequestBody, secret_id_int, admin_id)
        assert.equal(res.status, 204, 'Actual Status is '+res.status)
        res = await requests.delApplicationsAppIdSecretsSecretId(app_id_int, appSecretRequestBody, secret_id_int, admin_id)
        assert.equal(res.status, 404, 'Actual Status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'APP013', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ResultCode', 'Actual error_code is '+res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'No application secret found', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'No application secret found', 'Actual user_message is ' +res.body.errors[0].user_message)
    })

    it('C23190: DELETE Applications > Secrets > External - Validate error passing inactive secret-id *regression*', async function () {
        res = await requests.delApplicationsAppIdSecretsSecretId(app_id_ext, appSecretRequestBody, secret_id_ext, admin_id)
        assert.equal(res.status, 204, 'Actual Status is '+res.status)
        res = await requests.delApplicationsAppIdSecretsSecretId(app_id_ext, appSecretRequestBody, secret_id_ext, admin_id)
        assert.equal(res.status, 404, 'Actual Status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'APP013', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ResultCode', 'Actual error_code is '+res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'No application secret found', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'No application secret found', 'Actual user_message is ' +res.body.errors[0].user_message)
    })

    it('C20984: DELETE Applications > Secrets > Internal - Validate error passing not existing secret-id *regression*', async function () {
        res = await requests.delApplicationsAppIdSecretsSecretId(app_id_int, appSecretRequestBody, randGuid, admin_id)
        assert.equal(res.status, 404, 'Actual Status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'APP013', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ResultCode', 'Actual error_code is '+res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'No application secret found', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'No application secret found', 'Actual user_message is ' +res.body.errors[0].user_message)
    })

    it('C20985: DELETE Applications > Secrets > Internal - Validate error passing empty secret-id *regression*', async function () {
        res = await requests.delApplicationsAppIdSecretsSecretId(app_id_int, appSecretRequestBody, ``, admin_id)
        assert.equal(res.status, 400, 'Actual Status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'GEN010', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, "Request method 'DELETE' not supported", 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Unsupported request.', 'Actual user_message is ' +res.body.errors[0].user_message)
    })

    it('C23192: DELETE Applications > Secrets > External - Validate error passing empty secret-id *regression*', async function () {
        res = await requests.delApplicationsAppIdSecretsSecretIdExt(app_id_ext, appSecretRequestBody, ``, access_token, admin_id)
        assert.equal(res.status, 400, 'Actual Status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'GEN010', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, "Request method 'DELETE' not supported", 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Unsupported request.', 'Actual user_message is ' +res.body.errors[0].user_message)
    })

    it('C23187: DELETE Applications > Secrets > External - Validate error passing not existing app-id *regression*', async function () {
        res = await requests.delApplicationsAppIdSecretsSecretIdExt(randGuid, appSecretRequestBody, secret_id_ext, access_token, admin_id)
        assert.equal(res.status, 404, 'Actual Status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'APP007', 'Actual error_coe is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ResultCode', 'Actual element_name is ' +res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'Application does not exist.', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Application does not exist.', 'Actual user_message is ' +res.body.errors[0].user_message)
    })

    it('C23188: DELETE Applications > Secrets > External - Validate error passing empty app-id *regression*', async function () {
        res = await requests.delApplicationsAppIdSecretsSecretIdExt(``, appSecretRequestBody, secret_id_ext, access_token, admin_id)
        assert.equal(res.status, 404, 'Actual Status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'Not Found', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'No message available', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'No message available', 'Actual user_message is ' +res.body.errors[0].user_message)
    })

    it('C23189: DELETE Applications > Secrets > External - Validate error passing invalid secret-id *regression*', async function () {
        res = await requests.delApplicationsAppIdSecretsSecretIdExt(app_id_ext, appSecretRequestBody, '123', access_token, admin_id)
        assert.equal(res.status, 404, 'Actual Status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'APP013', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ResultCode', 'Actual element_name is ' +res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'No application secret found', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'No application secret found', 'Actual user_message is ' +res.body.errors[0].user_message)
    })

    it('C23191: DELETE Applications > Secrets > External - Validate error passing not existing secret-id *regression*', async function () {
        res = await requests.delApplicationsAppIdSecretsSecretIdExt(app_id_int, appSecretRequestBody, randGuid, access_token, admin_id)
        assert.equal(res.status, 404, 'Actual Status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'APP013', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ResultCode', 'Actual error_code is '+res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'No application secret found', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'No application secret found', 'Actual user_message is ' +res.body.errors[0].user_message)
    })

    after(async function () {
        await requests.delApplicationsExt(app_id_ext, appRequestBody_ext, access_token)
        await requests.delApplications(app_id_int, appRequestBody_int)
    })
})