/**
 * Import required packages
 */
require('mocha')

var config = require('config')
var assert = require('chai').assert
const chai = require('chai')
chai.use(require('chai-uuid'))

const requests = require('../../../common/setup/request')
const ssoGroupsPayload = require('../../../common/datasource/createSSOGroups')
const ssoApplicationsPayload = require('../../../common/datasource/createSSOApplications')
const ssoConfigsPayload = require('../../../common/datasource/createSSOConfigs')

const timeout = config.get('timeout')

describe('PATCH /sso/configs (+) - Validate response *sso* *end-to-end*', function () {
    this.timeout(timeout)
    let ssoGroupsRequestBody, ssoApplicationsRequestBody, ssoConfigsRequestBody
    let reseller_id = config.get('admin.corp_id')
    let oauth_group, client_id, sso_config_id
    let enabled = true
    let idp_sso_url, idp_entity_id, X509_cert
    let updated_idp_sso_url, updated_idp_entity_id, updated_X509_cert, updated_enabled, updated_idp_oauth_client_id, updated_oauth_group
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
            idp_entity_id = ssoConfigsRequestBody.idp_entity_id
            idp_oauth_client_id = ssoConfigsRequestBody.idp_oauth_client_id
            oauth_group = ssoConfigsRequestBody.oauth_group
            X509_cert = ssoConfigsRequestBody.X509_cert

            res = await requests.postSSOConfigs(ssoConfigsRequestBody)
            sso_config_id = res.body.sso_config_id

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C31302: PATCH > SSO > Config > Internal > idp_sso_url > Validate SSO Config details are updated', async function () {
        updated_idp_sso_url = idp_sso_url+".Update"
        res = await requests.patchSSOConfigs({"idp_sso_url": updated_idp_sso_url}, sso_config_id)
        assert.equal(res.status, 200, 'Actual status is ' + res.status)
        assert.equal(res.body.sso_config_id, sso_config_id, 'Actual sso_config_id is '+res.body.sso_config_id)
        assert.equal(res.body.idp_sso_url, updated_idp_sso_url, 'Actual idp_sso_url is ' + res.body.idp_sso_url)
    })

    it('C31305: PATCH > SSO > Config > Internal > idp_entity_id > Validate SSO Config details are updated', async function () {
        updated_idp_entity_id = idp_entity_id+".Update"
        res = await requests.patchSSOConfigs({"idp_entity_id": updated_idp_entity_id}, sso_config_id)
        assert.equal(res.status, 200, 'Actual status is ' + res.status)
        assert.equal(res.body.sso_config_id, sso_config_id, 'Actual sso_config_id is '+res.body.sso_config_id)
        assert.equal(res.body.idp_entity_id, updated_idp_entity_id, 'Actual idp_entity_id is ' + res.body.idp_entity_id)
    })

    it('C31307: PATCH > SSO > Config > Internal > X509_cert > Validate SSO Config details are updated', async function () {
        updated_X509_cert = 'MIICsDCCAhmgAwIBAgIBADANBgkqhkiG9w0BAQ0FADB1MQswCQYDVQQGEwJ1czETMBEGA1UECAwKQ2FsaWZvcm5pYTERMA8GA1UECgwISjJHbG9iYWwxFTATBgNVBAMMDGoyZ2xvYmFsLmNvbTEnMCUGCSqGSIb3DQEJARYYYXZpaml0LnNhbm5pZ3JhaGlAajIuY29tMB4XDTIxMDUwMzExNTIwNVoXDTIyMDUwMzExNTIwNVowdTELMAkGA1UEBhMCdXMxEzARBgNVBAgMCkNhbGlmb3JuaWExETAPBgNVBAoMCEoyR2xvYmFsMRUwEwYDVQQDDAxqMmdsb2JhbC5jb20xJzAlBgkqhkiG9w0BCQEWGGF2aWppdC5zYW5uaWdyYWhpQGoyLmNvbTCBnzANBgkqhkiG9w0BAQEFAAOBjQAwgYkCgYEAv+1ZiKrFPaNKuxZWg0jzO/fwNMMy35R5r6sBkajLGZcUVE1VzvqkWKbTcoChdJmk7uR5mUiKTQ28k3GI9TBhVU9kojzzOPCPEU4ee0xFNcpxVTiT9lEx4Q8OjPrQMVUNKF4XolPWTum2Ssa2p5YoM29HpTulAv5Dpz/OvhQZyYsCAwEAAaNQME4wHQYDVR0OBBYEFDAAKajZLTrFSrILNVjNtVPVsXFTMB8GA1UdIwQYMBaAFDAAKajZLTrFSrILNVjNtVPVsXFTMAwGA1UdEwQFMAMBAf8wDQYJKoZIhvcNAQENBQADgYEADqbEFZ4PSiHuUSoYRm8q1zF9mqxq++kZrySZbxXn8L+nVP6YITuYerBr7wG7j/P/UIAc1rNSDLBYZ36NRfcoQ8v1pYFA02Y4iNO+UxhYf/i2miQ3NlPj23HPEd0rHYh36geAFYFgAJC+a6QXkPifM6OrMJD33D1GVb9yFPgL3xA='
        res = await requests.patchSSOConfigs({"X509_cert": updated_X509_cert}, sso_config_id)
        assert.equal(res.status, 200, 'Actual status is ' + res.status)
        assert.equal(res.body.sso_config_id, sso_config_id, 'Actual sso_config_id is '+res.body.sso_config_id)
        assert.equal(res.body.X509_cert, updated_X509_cert, 'Actual X509_cert is ' + res.body.X509_cert)
    })

    it('C31310: PATCH > SSO > Config > Internal > enabled > Validate SSO Config details are updated', async function () {
        updated_enabled = false
        res = await requests.patchSSOConfigs({"enabled": false}, sso_config_id)
        assert.equal(res.status, 200, 'Actual status is ' + res.status)
        assert.equal(res.body.sso_config_id, sso_config_id, 'Actual sso_config_id is '+res.body.sso_config_id)
        assert.equal(res.body.enabled, updated_enabled, 'Actual enabled boolean value is ' + res.body.enabled)
    })

    it('C31311: PATCH > SSO > Config > Internal > idp_oauth_client_id and auth_group > Validate SSO Config details are updated', async function () {
        updated_idp_oauth_client_id = "myaccount-web"
        updated_oauth_group = "USER"
        res = await requests.patchSSOConfigs({"idp_oauth_client_id": updated_idp_oauth_client_id, "oauth_group": updated_oauth_group}, sso_config_id)
        assert.equal(res.status, 200, 'Actual status is ' + res.status)
        assert.equal(res.body.sso_config_id, sso_config_id, 'Actual sso_config_id is '+res.body.sso_config_id)
        assert.equal(res.body.idp_oauth_client_id, updated_idp_oauth_client_id, 'Actual idp_entity_id is ' + res.body.idp_oauth_client_id)
        assert.equal(res.body.oauth_group, updated_oauth_group, 'Actual oauth_group is ' + res.body.oauth_group)
    })

    after(async function() {
        await requests.deleteSSOConfigs(sso_config_id)   
        await requests.deleteSSOApplications(client_id)
        await requests.deleteSSOGroups(oauth_group)
    })
})