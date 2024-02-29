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

describe('GET /applications/app_id/secrets (+) - Validate response *end-to-end*', function () {
    this.timeout(timeout)
    let group_name_int, group_name_ext
    let appRequestBody_int, appRequestBody_ext, appSecretRequestBody1, appSecretRequestBody2
    let app_id_int, app_id_ext
    let admin_id = config.get('admin.corp_id')
    let userName = config.get('admin.username')
    let password = config.get('admin.password')
    let access_token
    let expiration1, expiration2, description1, description2, enabled1, enabled2
    let secret_id_int1, secret_id_int2, secret_id_ext1, secret_id_ext2
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

            appSecretRequestBody1 = applicationSecretPayload.postApplicationsSecrets(false)
            appSecretRequestBody1.expiration = '2025-02-14T06:15:07.261+0000'
            expiration1 = appSecretRequestBody1.expiration
            description1 = appSecretRequestBody1.description
            enabled1 = appSecretRequestBody1.enabled

            appSecretRequestBody2 = applicationSecretPayload.postApplicationsSecrets(true)
            appSecretRequestBody2.expiration = '2026-02-14T06:15:07.261+0000'
            expiration2 = appSecretRequestBody2.expiration
            description2 = appSecretRequestBody2.description
            enabled2 = appSecretRequestBody2.enabled

            res = await requests.postApplicationsAppIdSecrets(app_id_int, appSecretRequestBody1, admin_id)
            secret_id_int1 = res.body.secret_id

            res = await requests.postApplicationsAppIdSecrets(app_id_int, appSecretRequestBody2, admin_id)
            secret_id_int2 = res.body.secret_id

            res = await requests.postApplicationsAppIdSecretsExt(app_id_ext, appSecretRequestBody1, access_token, userName)
            secret_id_ext1 = res.body.secret_id

            res = await requests.postApplicationsAppIdSecretsExt(app_id_ext, appSecretRequestBody2, access_token, userName)
            secret_id_ext2 = res.body.secret_id

            randGuid = common_utils.createGUID()

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C23182: GET Applications > Secrets > External - Validate several secrets could be returned *regression*', async function () {
        res = await requests.getApplicationsAppIdSecretsExt(app_id_ext, access_token)
        assert.equal(res.status, 200, 'Actual status is ' + res.status)

        assert.exists(res.body[1].created, 'created does not exist')
        assert.equal(res.body[1].description, description1, 'Actual description value is ' + res.body[1].description)
        assert.equal(res.body[1].enabled, enabled1, 'Actual enabled boolean value is ' + res.body[1].enabled)
        assert.equal(res.body[1].expiration, expiration1, 'Actual expiration is ' + res.body[1].expiration)
        assert.equal(res.body[1].secret_id, secret_id_ext1, 'Actual secret_id is ' + res.body[1].secret_id)

        assert.exists(res.body[2].created, 'created does not exist')
        assert.equal(res.body[2].description, description2, 'Actual description value is ' + res.body[2].description)
        assert.equal(res.body[2].enabled, enabled2, 'Actual enabled boolean value is ' + res.body[2].enabled)
        assert.equal(res.body[2].expiration, expiration2, 'Actual expiration value is ' + res.body[2].expiration2)
        assert.equal(res.body[2].secret_id, secret_id_ext2, 'Actual secret_id is ' + res.body[2].secret_id)
    })

    it('C20973: GET Applications > Secrets > Internal - Validate several secrets could be returned *regression* *smoke*', async function () {
        res = await requests.getApplicationsAppIdSecrets(app_id_int)
        assert.equal(res.status, 200, 'Actual status is ' + res.status)

        assert.exists(res.body[1].created, 'created does not exist')
        assert.equal(res.body[1].description, description1, 'Actual description value is ' + res.body[1].description)
        assert.equal(res.body[1].enabled, enabled1, 'Actual enabled boolean value is ' + res.body[1].enabled)
        assert.equal(res.body[1].expiration, expiration1, 'Actual expiration is ' + res.body[1].expiration)
        assert.equal(res.body[1].secret_id, secret_id_int1, 'Actual secret_id is ' + res.body[1].secret_id)

        assert.exists(res.body[2].created, 'created does not exist')
        assert.equal(res.body[2].description, description2, 'Actual description value is ' + res.body[2].description)
        assert.equal(res.body[2].enabled, enabled2, 'Actual enabled boolean value is ' + res.body[2].enabled)
        assert.equal(res.body[2].expiration, expiration2, 'Actual expiration value is ' + res.body[2].expiration2)
        assert.equal(res.body[2].secret_id, secret_id_int2, 'Actual secret_id is ' + res.body[2].secret_id)
    })

    it('C20974: GET Applications > Secrets > Internal - Validate inactive secret not returned *regression*', async function () {
        res = await requests.getApplicationsAppIdSecrets(app_id_int)
        assert.equal(res.status, 200, 'Actual status is ' + res.status)
        assert.equal(res.body[1].expiration, expiration1, 'expiration is ' + res.body[1].expiration)
    })

    it('C23183: GET Applications > Secrets > External - Validate inactive secret not returned *regression*', async function () {
        res = await requests.getApplicationsAppIdSecretsExt(app_id_ext, access_token)
        assert.equal(res.status, 200, 'Actual status is ' + res.status)
        assert.equal(res.body[1].expiration, expiration1, 'expiration is ' + res.body[1].expiration)
    })

    after(async function () {
        await requests.delApplicationsExt(app_id_ext, appRequestBody_ext, access_token)
        await requests.delApplications(app_id_int, appRequestBody_int)
    })
})