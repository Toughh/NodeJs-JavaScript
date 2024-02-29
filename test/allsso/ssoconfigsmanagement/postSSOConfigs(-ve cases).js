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

const timeout = config.get('timeout')

describe('POST /sso/configs (-) - Validate response *sso* *end-to-end*', function () {
    this.timeout(timeout)
    let ssoGroupsRequestBody, ssoApplicationsRequestBody, ssoConfigsRequestBody
    let reseller_id = config.get('admin.corp_id')
    let oauth_group, client_id
    let enabled = true
    let res

    beforeEach(async function () {
        try {
            ssoGroupsRequestBody = ssoGroupsPayload.postSSOGroups()

            res = await requests.postSSOGroups(ssoGroupsRequestBody)
            oauth_group = res.body.oauth_group

            ssoApplicationsRequestBody = ssoApplicationsPayload.postSSOApplications(oauth_group, enabled)

            res = await requests.postSSOApplications(ssoApplicationsRequestBody)
            client_id = res.body.client_id

            ssoConfigsRequestBody = ssoConfigsPayload.postSSOConfigs(oauth_group, reseller_id, client_id)

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C31271: POST > SSO > Config > Internal > idp_sso_url field is missing > Validate 400 Bad Request is returned', async function () {
        delete ssoConfigsRequestBody.idp_sso_url
        res = await requests.postSSOConfigs(ssoConfigsRequestBody)
        assert.equal(res.status, 400, 'Actual status code is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'SSO015', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'SSO IDP url is not specified.', 'Actual developer_message is '+res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'SSO request validation exception.', 'Actual user_message is '+res.body.errors[0].user_message)
    })

    it('C31272: POST > SSO > Config > Internal > idp_entity_id field is missing > Validate 400 Bad Request is returned', async function () {
        delete ssoConfigsRequestBody.idp_entity_id
        res = await requests.postSSOConfigs(ssoConfigsRequestBody)
        assert.equal(res.status, 400, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'SSO015', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'SSO IDP entity id is not specified.', 'Actual developer_message is '+res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'SSO request validation exception.', 'Actual user_message is '+res.body.errors[0].user_message)
    })

    it('C31273: POST > SSO > Config > Internal > X509_cert field is missing > Validate 400 Bad Request is returned', async function () {
        delete ssoConfigsRequestBody.X509_cert
        res = await requests.postSSOConfigs(ssoConfigsRequestBody)
        assert.equal(res.status, 400, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'SSO015', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'SSO certificate is not specified.', 'Actual developer_message is '+res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'SSO request validation exception.', 'Actual user_message is '+res.body.errors[0].user_message)
    })

    it('C31274: POST > SSO > Config > Internal > idp_oauth_client_id field is missing > Validate 400 Bad Request is returned', async function () {
        delete ssoConfigsRequestBody.idp_oauth_client_id
        res = await requests.postSSOConfigs(ssoConfigsRequestBody)
        assert.equal(res.status, 400, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'SSO015', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'SSO IDP oauth Client id is not specified.', 'Actual developer_message is '+res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'SSO request validation exception.', 'Actual user_message is '+res.body.errors[0].user_message)
    })

    it('C31275: POST > SSO > Config > Internal > reseller_id field is missing > Validate 400 Bad Request is returned', async function () {
        delete ssoConfigsRequestBody.reseller_id
        res = await requests.postSSOConfigs(ssoConfigsRequestBody)
        assert.equal(res.status, 400, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'SSO015', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'Reseller id is not specified.', 'Actual developer_message is '+res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'SSO request validation exception.', 'Actual user_message is '+res.body.errors[0].user_message)
    })

    it('C31276: POST > SSO > Config > Internal > oauth_group_id field is missing > Validate 400 Bad Request is returned', async function () {
        delete ssoConfigsRequestBody.oauth_group
        res = await requests.postSSOConfigs(ssoConfigsRequestBody)
        assert.equal(res.status, 400, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'SSO015', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'SSO oauth group is not specified.', 'Actual developer_message is '+res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'SSO request validation exception.', 'Actual user_message is '+res.body.errors[0].user_message)
    })

    it('C31277: POST > SSO > Config > Internal > empty request body > Validate 400 Bad Request is returned', async function () {
        res = await requests.postSSOConfigs({})
        assert.equal(res.status, 400, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'SSO015', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'SSO IDP url is not specified.', 'Actual developer_message is '+res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'SSO request validation exception.', 'Actual user_message is '+res.body.errors[0].user_message)
    })

    it('C31278: POST > SSO > Config > Internal > idp_sso_url field is invalid > Validate 400 Bad Request is returned', async function () {
        ssoConfigsRequestBody.idp_sso_url = 'Invalid'
        res = await requests.postSSOConfigs(ssoConfigsRequestBody)
        assert.equal(res.status, 400, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'SSO015', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'SSO IDP url format is invalid: '+ssoConfigsRequestBody.idp_sso_url, 'Actual developer_message is '+res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'SSO request validation exception.', 'Actual user_message is '+res.body.errors[0].user_message)
    })

    it('C31279: POST > SSO > Config > Internal > idp_oauth_client_id field is invalid > Validate 400 Bad Request is returned', async function () {
        ssoConfigsRequestBody.idp_oauth_client_id = 'Invalid'
        res = await requests.postSSOConfigs(ssoConfigsRequestBody)
        assert.equal(res.status, 404, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'SSO004', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'SSO application not found: Invalid', 'Actual developer_message is '+res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'SSO application not found.', 'Actual user_message is '+res.body.errors[0].user_message)
    })

    it('C31280: POST > SSO > Config > Internal > reseller_id field is invalid > Validate 400 Bad Request is returned', async function () {
        ssoConfigsRequestBody.reseller_id = '0000'
        res = await requests.postSSOConfigs(ssoConfigsRequestBody)
        assert.equal(res.status, 400, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'SSO013', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'Reseller not found: '+ssoConfigsRequestBody.reseller_id, 'Actual developer_message is '+res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Reseller not found.', 'Actual user_message is '+res.body.errors[0].user_message)
    })

    it('C31281: POST > SSO > Config > Internal > oauth_group field is invalid > Validate 400 Bad Request is returned', async function () {
        ssoConfigsRequestBody.oauth_group = 'Invalid'
        res = await requests.postSSOConfigs(ssoConfigsRequestBody)
        assert.equal(res.status, 404, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'SSO014', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'SSO oauth group not found: '+ssoConfigsRequestBody.oauth_group, 'Actual developer_message is '+res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'SSO oauth group not found.', 'Actual user_message is '+res.body.errors[0].user_message)
    })

    it('C32018: POST > SSO > Config > Internal > X509_cert field is invalid > Validate 400 Bad Request is returned', async function () {
        ssoConfigsRequestBody.X509_cert = 'Invalid_Format_X509_cert'
        res = await requests.postSSOConfigs(ssoConfigsRequestBody)
        assert.equal(res.status, 400, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'SSO015', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'Invalid format of SSO certificate.', 'Actual developer_message is '+res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'SSO request validation exception.', 'Actual user_message is '+res.body.errors[0].user_message)
    })

    it('C32019: POST > SSO > Config > Internal > X509_cert field is invalid > Validate 400 Bad Request is returned', async function () {
        ssoConfigsRequestBody.X509_cert = 'MIICXjCCAcegAwIBAgIBADANBgkqhkiG9w0BAQ0FADBMMQswCQYDVQQGEwJ1czETMBEGA1UECAwKQ2FsaWZvcm5pYTERMA8GA1UECgwISjJHbG9iYWwxFTATBgNVBAMMDGoyZ2xvYmFsLmNvbTAeFw0yMTA1MTAwOTU4MjdaFw0yMTA1MDkwOTU4MjdaMEwxCzAJBgNVBAYTAnVzMRMwEQYDVQQIDApDYWxpZm9ybmlhMREwDwYDVQQKDAhKMkdsb2JhbDEVMBMGA1UEAwwMajJnbG9iYWwuY29tMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDVIa0iQWlqi8lLRVSeV0TXgrxp6Y1AvhyfPkFJ5FIE7/DMYadYfjAgjBBRtJ7cPqpXPQxg4qOTuT5w1VtkXWQfz8BpSGUgCFkAocDwoQl3lpqgPZNhh3p5eMz2a0YXxN/UlBJa3Th6kwfeHnmaekVWSBJaVrxmgVX8Ka937o5yuwIDAQABo1AwTjAdBgNVHQ4EFgQUHW8g+x/VpPBQOXkLaT/MioRNERIwHwYDVR0jBBgwFoAUHW8g+x/VpPBQOXkLaT/MioRNERIwDAYDVR0TBAUwAwEB/zANBgkqhkiG9w0BAQ0FAAOBgQCFhq+ivPXziLXM6xYrOOtwERttzlWdqfOqNsYzawp1HbM+xdOykyCgg/Ni8oc99l5eRVejySbsIt9yJkUNBa4T8/e4DpEMwdr8mplTjuoe9Kt+CER6GTKYr92S8BGwm6aiyh1UAV//n+u6zoixOSWQOX/FZOI7BXrBLgLp23CW7g=='
        res = await requests.postSSOConfigs(ssoConfigsRequestBody)
        assert.equal(res.status, 400, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'SSO015', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'SSO certificate is out of validity period.', 'Actual developer_message is '+res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'SSO request validation exception.', 'Actual user_message is '+res.body.errors[0].user_message)
    })

    afterEach(async function() {  
        await requests.deleteSSOApplications(client_id)
        await requests.deleteSSOGroups(oauth_group)
    })
})