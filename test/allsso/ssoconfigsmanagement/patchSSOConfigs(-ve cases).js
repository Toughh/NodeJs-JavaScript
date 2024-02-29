/**
 * Import required packages
 */
require('mocha')

var config = require('config')
var assert = require('chai').assert

const requests = require('../../../common/setup/request')
const ssoGroupsPayload = require('../../../common/datasource/createSSOGroups')
const ssoApplicationsPayload = require('../../../common/datasource/createSSOApplications')
const ssoConfigsPayload = require('../../../common/datasource/createSSOConfigs')
const common_utils = require('../../../common/util/commonUtils')

const timeout = config.get('timeout')

describe('PATCH /sso/configs (-) - Validate response *sso* *end-to-end*', function () {
    this.timeout(timeout)
    let ssoGroupsRequestBody, ssoApplicationsRequestBody, ssoConfigsRequestBody
    let reseller_id = config.get('admin.corp_id')
    let oauth_group, client_id, sso_config_id
    let enabled = true
    let idp_sso_url, idp_oauth_client_id
    let randomGuid
    let res

    before(async function () {
        try {
            ssoGroupsRequestBody = ssoGroupsPayload.postSSOGroups()

            res = await requests.postSSOGroups(ssoGroupsRequestBody)
            oauth_group = res.body.oauth_group

            ssoApplicationsRequestBody = ssoApplicationsPayload.postSSOApplications(oauth_group, enabled)

            res = await requests.postSSOApplications(ssoApplicationsRequestBody)
            client_id = res.body.client_id

            ssoConfigsRequestBody = ssoConfigsPayload.postSSOConfigs(oauth_group, reseller_id, client_id)

            idp_sso_url = ssoConfigsRequestBody.idp_sso_url
            idp_oauth_client_id = ssoConfigsRequestBody.idp_oauth_client_id

            res = await requests.postSSOConfigs(ssoConfigsRequestBody)
            sso_config_id = res.body.sso_config_id

            randGuid = common_utils.createGUID()

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C31314: PATCH > SSO > Config > Internal > idp_oauth_client_id > Validate 400 Bad Request is returned', async function () {
        res = await requests.patchSSOConfigs({"idp_oauth_client_id": idp_oauth_client_id, "oauth_group": "AUTOMATION_TEST_GROUP"}, sso_config_id)
        assert.equal(res.status, 400, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'SSO015', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'SSO config group does not match with SSO app group.', 'Actual developer_message is '+res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'SSO request validation exception.', 'Actual user_message is '+res.body.errors[0].user_message)
    })

    it('C31316: PATCH > SSO > Config > Internal > oauth_group_id > Validate 400 Bad Request is returned', async function () {
        res = await requests.patchSSOConfigs({"oauth_group": "AUTOMATION_TEST_GROUP"}, sso_config_id)
        assert.equal(res.status, 400, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'SSO015', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'SSO config group does not match with SSO app group.', 'Actual developer_message is '+res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'SSO request validation exception.', 'Actual user_message is '+res.body.errors[0].user_message)        
    })

    it('C31321: PATCH > SSO > Config > Internal > idp_oauth_client_id and auth_group_id are not linked in one group in DB > Validate 400 Bad Request is returned', async function () {
        res = await requests.patchSSOConfigs({"idp_oauth_client_id": idp_oauth_client_id, "oauth_group": "AUTOMATION_TEST_GROUP"}, sso_config_id)
        assert.equal(res.status, 400, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'SSO015', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'SSO config group does not match with SSO app group.', 'Actual developer_message is '+res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'SSO request validation exception.', 'Actual user_message is '+res.body.errors[0].user_message)
    })

    it('C31294: PATCH > SSO > Config > Internal > Invalid idp_sso_url > Validate 400 Bad Request is returned', async function () {
        res = await requests.patchSSOConfigs({"idp_sso_url": "INVALID"}, sso_config_id)
        assert.equal(res.status, 400, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'SSO015', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'SSO IDP url format is invalid: INVALID', 'Actual developer_message is '+res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'SSO request validation exception.', 'Actual user_message is '+res.body.errors[0].user_message)
    })

    it('C31298: PATCH > SSO > Config > Internal > Invalid idp_oauth_client_id > Validate 400 Bad Request is returned', async function () {
        res = await requests.patchSSOConfigs({"idp_oauth_client_id": "INVALID"}, sso_config_id)
        assert.equal(res.status, 404, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'SSO004', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'SSO application not found: INVALID', 'Actual developer_message is '+res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'SSO application not found.', 'Actual user_message is '+res.body.errors[0].user_message)
    })

    it('C31299: PATCH > SSO > Config > Internal > Invalid auth_scope > Validate 400 Bad Request is returned', async function () {
        res = await requests.patchSSOConfigs({"idp_oauth_client_id": "INVALID"}, sso_config_id)
        assert.equal(res.status, 404, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'SSO004', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'SSO application not found: INVALID', 'Actual developer_message is '+res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'SSO application not found.', 'Actual user_message is '+res.body.errors[0].user_message)
    })

    it('C32020: PATCH > SSO > Config > Internal > X509_cert field is invalid > Validate 400 Bad Request is returned', async function () {
        res = await requests.patchSSOConfigs({"X509_cert": "Invalid_Format_X509_Cert"}, sso_config_id)
        assert.equal(res.status, 400, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'SSO015', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'Invalid format of SSO certificate.', 'Actual developer_message is '+res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'SSO request validation exception.', 'Actual user_message is '+res.body.errors[0].user_message)
    })

    it('C32021: PATCH > SSO > Config > Internal > X509_cert field is outdated > Validate 400 Bad Request is returned', async function () {
        res = await requests.patchSSOConfigs({"X509_cert": "MIICXjCCAcegAwIBAgIBADANBgkqhkiG9w0BAQ0FADBMMQswCQYDVQQGEwJ1czETMBEGA1UECAwKQ2FsaWZvcm5pYTERMA8GA1UECgwISjJHbG9iYWwxFTATBgNVBAMMDGoyZ2xvYmFsLmNvbTAeFw0yMTA1MTAwOTU4MjdaFw0yMTA1MDkwOTU4MjdaMEwxCzAJBgNVBAYTAnVzMRMwEQYDVQQIDApDYWxpZm9ybmlhMREwDwYDVQQKDAhKMkdsb2JhbDEVMBMGA1UEAwwMajJnbG9iYWwuY29tMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDVIa0iQWlqi8lLRVSeV0TXgrxp6Y1AvhyfPkFJ5FIE7/DMYadYfjAgjBBRtJ7cPqpXPQxg4qOTuT5w1VtkXWQfz8BpSGUgCFkAocDwoQl3lpqgPZNhh3p5eMz2a0YXxN/UlBJa3Th6kwfeHnmaekVWSBJaVrxmgVX8Ka937o5yuwIDAQABo1AwTjAdBgNVHQ4EFgQUHW8g+x/VpPBQOXkLaT/MioRNERIwHwYDVR0jBBgwFoAUHW8g+x/VpPBQOXkLaT/MioRNERIwDAYDVR0TBAUwAwEB/zANBgkqhkiG9w0BAQ0FAAOBgQCFhq+ivPXziLXM6xYrOOtwERttzlWdqfOqNsYzawp1HbM+xdOykyCgg/Ni8oc99l5eRVejySbsIt9yJkUNBa4T8/e4DpEMwdr8mplTjuoe9Kt+CER6GTKYr92S8BGwm6aiyh1UAV//n+u6zoixOSWQOX/FZOI7BXrBLgLp23CW7g=="}, sso_config_id)
        assert.equal(res.status, 400, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'SSO015', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'SSO certificate is out of validity period.', 'Actual developer_message is '+res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'SSO request validation exception.', 'Actual user_message is '+res.body.errors[0].user_message)
    })

    it('C31300: PATCH > SSO > Config > Internal > sso_config_id has status inactive > Validate 400 Bad Request is returned', async function () {
        res = await requests.deleteSSOConfigs(sso_config_id)
        assert.equal(res.status, 204, 'Actual status is ' + res.status)

        res = await requests.patchSSOConfigs({"idp_sso_url": idp_sso_url}, sso_config_id)
        assert.equal(res.status, 404, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'SSO002', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'SSO config not found: '+sso_config_id, 'Actual developer_message is '+res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'SSO config not found.', 'Actual user_message is '+res.body.errors[0].user_message)
    })

    it('C31301: PATCH > SSO > Config > Internal > sso_config_id has status inactive > Validate 400 Bad Request is returned', async function () {
        res = await requests.patchSSOConfigs({"idp_sso_url": idp_sso_url}, randomGuid)
        assert.equal(res.status, 404, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'SSO002', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'SSO config not found: '+randomGuid, 'Actual developer_message is '+res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'SSO config not found.', 'Actual user_message is '+res.body.errors[0].user_message)
    })

    after(async function() {
        await requests.deleteSSOConfigs(sso_config_id)
        await requests.deleteSSOApplications(client_id)
        await requests.deleteSSOGroups(oauth_group)
    })
})