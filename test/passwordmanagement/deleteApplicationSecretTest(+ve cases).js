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

describe('DELETE /applications/app_id/secrets (+) - Validate response *end-to-end*', function () {
    this.timeout(timeout)
    let group_name_int, group_name_ext
    let appRequestBody_int, appRequestBody_ext, appSecretRequestBody
    let app_id_int, app_id_ext, secret_id_int, secret_id_ext
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

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C21031: DELETE Applications > Secrets > Internal - Validate secret is inactivated *regression* *smoke*', async function () {
        res = await requests.delApplicationsAppIdSecretsSecretId(app_id_int, appSecretRequestBody, secret_id_int, admin_id)
        assert.equal(res.status, 204, 'Actual status is '+res.status)
    })

    it('C23186: DELETE Applications > Secrets > External - Validate secret is inactivated *regression* *smoke*', async function () {
        res = await requests.delApplicationsAppIdSecretsSecretIdExt(app_id_ext, appSecretRequestBody, secret_id_ext, access_token, admin_id)
        assert.equal(res.status, 204, 'Actual status is '+res.status)
    })

    after(async function () {
        await requests.delApplicationsExt(app_id_ext, appRequestBody_ext, access_token)
        await requests.delApplications(app_id_int, appRequestBody_int)
    })
})