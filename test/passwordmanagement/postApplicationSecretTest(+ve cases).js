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

describe('POST /applications/app_id/secrets (+) - Validate response *end-to-end*', function () {
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

    it('C20960: POST Applications > Secrets > Create new secret > Internal - Validate new secret is created passing all params *regression* *smoke*', async function () {
        appSecretRequestBody = applicationSecretPayload.postApplicationsSecrets(false)
        delete appSecretRequestBody.enabled
        appSecretRequestBody.expiration = '2025-02-14T06:15:07.261+0000'
        res = await requests.postApplicationsAppIdSecrets(app_id_int, appSecretRequestBody, admin_id)
        assert.equal(res.status, 201, 'Actual status is '+res.status)
        assert.isNotNull(res.body.api_access_secret, 'api_access_secret has no content')
        assert.equal(res.body.description, appSecretRequestBody.description, 'Actual description value is ' + res.body.description)
        assert.equal(res.body.enabled, true, 'Actual enabled boolean value is ' + res.body.enabled)
        assert.uuid(res.body.secret_id, 'v4')
    })

    it('C23170: POST Applications > Secrets > Create new secret > External - Validate new secret is created passing all params *regression* *external* *smoke*', async function () {
        appSecretRequestBody = applicationSecretPayload.postApplicationsSecrets(false)
        delete appSecretRequestBody.enabled
        appSecretRequestBody.expiration = '2025-02-14T06:15:07.261+0000'
        res = await requests.postApplicationsAppIdSecretsExt(app_id_ext, appSecretRequestBody, access_token, userName)
        assert.equal(res.status, 201, 'Actual status is '+res.status)
        assert.isNotNull(res.body.api_access_secret, 'api_access_secret has no content')
        assert.equal(res.body.description, appSecretRequestBody.description, 'Actual description value is ' + res.body.description)
        assert.equal(res.body.enabled, true, 'Actual enabled boolean value is ' + res.body.enabled)
        assert.uuid(res.body.secret_id, 'v4')
    })

    it('C20961: POST > Applications > Secrets - Create new secret > Internal > Validate new secret is created not passing any params *regression* *internal*', async function () {
        appSecretRequestBody = applicationSecretPayload.postApplicationsSecrets(false)
        delete appSecretRequestBody.enabled
        delete appSecretRequestBody.description
        res = await requests.postApplicationsAppIdSecrets(app_id_int, appSecretRequestBody, admin_id)
        assert.equal(res.status, 201, 'Actual status is '+res.status)
        assert.isNotNull(res.body.api_access_secret, 'api_access_secret has no content')
        assert.include(res.body.description, 'API Secret ', 'Actual description is ' + res.body.description)
        assert.equal(res.body.enabled, true, 'Actual enabled boolean value is ' + res.body.enabled)
        assert.uuid(res.body.secret_id, 'v4')
    })

    it('C23171: POST > Applications > Secrets - Create new secret > External > Validate new secret is created not passing any params *regression* *external*', async function () {
        appSecretRequestBody = applicationSecretPayload.postApplicationsSecrets(false)
        delete appSecretRequestBody.enabled
        delete appSecretRequestBody.description
        res = await requests.postApplicationsAppIdSecretsExt(app_id_ext, appSecretRequestBody, access_token, userName)
        assert.equal(res.status, 201, 'Actual status is '+res.status)
        assert.isNotNull(res.body.api_access_secret, 'api_access_secret has no content')
        assert.include(res.body.description, 'API Secret ', 'Actual description is ' + res.body.description)
        assert.equal(res.body.enabled, true, 'Actual enabled boolean value is ' + res.body.enabled)
        assert.uuid(res.body.secret_id, 'v4')
    })

    it('C27724: POST > Applications > Secrets - Internal - Validate secret_id is in UUID format *regression*', async function () {
        appSecretRequestBody = applicationSecretPayload.postApplicationsSecrets(true)
        res = await requests.postApplicationsAppIdSecrets(app_id_int, appSecretRequestBody, admin_id)
        assert.equal(res.status, 201, 'Actual status is '+res.status)
        assert.uuid(res.body.secret_id, 'v4')
    })

    it('C27724: POST > Applications > Secrets - Validate secret_id is in UUID format *regression*', async function () {
        appSecretRequestBody = applicationSecretPayload.postApplicationsSecrets(true)
        res = await requests.postApplicationsAppIdSecretsExt(app_id_ext, appSecretRequestBody, access_token, userName)
        assert.equal(res.status, 201, 'Actual status is '+res.status)
        assert.uuid(res.body.secret_id, 'v4')
    })

    it('C27735: POST > Applications > Secrets - Validate if by default, enabled value is true if not posting secret with no enabled field *regression*', async function () {
        appSecretRequestBody = applicationSecretPayload.postApplicationsSecrets(true)
        delete appSecretRequestBody.enabled
        res = await requests.postApplicationsAppIdSecrets(app_id_int, appSecretRequestBody, admin_id)
        assert.equal(res.status, 201, 'Actual status is '+res.status)
        assert.equal(res.body.enabled, true, 'Actual enabled boolean value is ' + res.body.enabled)
    })

    it('C27735: POST > Applications > Secrets - Validate if by default, enabled value is true if not posting secret with no enabled field *regression*', async function () {
        appSecretRequestBody = applicationSecretPayload.postApplicationsSecrets(true)
        delete appSecretRequestBody.enabled
        res = await requests.postApplicationsAppIdSecretsExt(app_id_ext, appSecretRequestBody, access_token, userName)
        assert.equal(res.status, 201, 'Actual status is '+res.status)
        assert.equal(res.body.enabled, true, 'Actual enabled boolean value is ' + res.body.enabled)
    })

    after(async function () {
        await requests.delApplicationsExt(app_id_ext, appRequestBody_ext, access_token)
        await requests.delApplications(app_id_int, appRequestBody_int)
    })
})