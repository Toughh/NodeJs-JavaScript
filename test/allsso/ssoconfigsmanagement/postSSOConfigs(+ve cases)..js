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

describe('POST /sso/configs (+) - Validate response *sso* *end-to-end*', function () {
    this.timeout(timeout)
    let ssoGroupsRequestBody, ssoApplicationsRequestBody, ssoConfigsRequestBody
    let reseller_id = config.get('admin.corp_id')
    let oauth_group, client_id, sso_config_id
    let enabled = true
    let idp_sso_url, idp_entity_id, idp_oauth_client_id, X509_cert
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

            idp_sso_url = ssoConfigsRequestBody.idp_sso_url
            idp_entity_id = ssoConfigsRequestBody.idp_entity_id
            idp_oauth_client_id = ssoConfigsRequestBody.idp_oauth_client_id
            oauth_group = ssoConfigsRequestBody.oauth_group
            reseller_id = ssoConfigsRequestBody.reseller_id
            enabled = ssoConfigsRequestBody.enabled
            X509_cert = ssoConfigsRequestBody.X509_cert

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C31269: POST > SSO > Config > Internal > Create SSO Config> Validate SSO config is created when sending only required fields', async function () {
        delete ssoConfigsRequestBody.enabled
        res = await requests.postSSOConfigs(ssoConfigsRequestBody)
        assert.equal(res.status, 201, 'Actual status is ' + res.status)
        sso_config_id = res.body.sso_config_id
        assert.uuid(res.body.sso_config_id, 'v4')
        assert.equal(res.body.idp_sso_url, idp_sso_url, 'Actual idp_sso_url is ' + res.body.idp_sso_url)
        assert.equal(res.body.idp_entity_id, idp_entity_id, 'Actual idp_entity_id is ' + res.body.idp_entity_id)
        assert.equal(res.body.X509_cert, X509_cert, 'Actual X509_cert is ' + res.body.X509_cert)
        assert.equal(res.body.enabled, enabled, 'Actual enabled boolean value is ' + res.body.enabled)
        assert.equal(res.body.idp_oauth_client_id, idp_oauth_client_id, 'Actual idp_oauth_client_id is ' + res.body.idp_oauth_client_id)
        assert.equal(res.body.reseller_id, reseller_id, 'Actual reseller_id is ' + res.body.reseller_id)
        assert.equal(res.body.oauth_group, oauth_group, 'Actual oauth_group_id is ' + res.body.oauth_group)
        assert.include(res.body.acs_url, 'https://')
        assert.include(res.body.sp_entity_id, 'https://')
        assert.exists(res.body.create_date, 'create_date do not exist')
        assert.exists(res.body.update_date, 'update_date do not exist')
    })

    it('C31270: POST > SSO > Config > Internal > Validate SSO config is created when sending all fields', async function () {
        ssoConfigsRequestBody.enabled = true
        res = await requests.postSSOConfigs(ssoConfigsRequestBody)
        assert.equal(res.status, 201, 'Actual status is ' + res.status)
        sso_config_id = res.body.sso_config_id
        assert.uuid(res.body.sso_config_id, 'v4')
        assert.equal(res.body.idp_sso_url, idp_sso_url, 'Actual idp_sso_url is ' + res.body.idp_sso_url)
        assert.equal(res.body.idp_entity_id, idp_entity_id, 'Actual idp_entity_id is ' + res.body.idp_entity_id)
        assert.equal(res.body.X509_cert, X509_cert, 'Actual X509_cert is ' + res.body.X509_cert)
        assert.equal(res.body.enabled, enabled, 'Actual enabled boolean value is ' + res.body.enabled)
        assert.equal(res.body.idp_oauth_client_id, idp_oauth_client_id, 'Actual idp_oauth_client_id is ' + res.body.idp_oauth_client_id)
        assert.equal(res.body.reseller_id, reseller_id, 'Actual reseller_id is ' + res.body.reseller_id)
        assert.equal(res.body.oauth_group, oauth_group, 'Actual oauth_group_id is ' + res.body.oauth_group)
        assert.include(res.body.acs_url, 'https://')
        assert.include(res.body.sp_entity_id, 'https://')
        assert.exists(res.body.create_date, 'create_date do not exist')
        assert.exists(res.body.update_date, 'update_date do not exist')
    })

    it('C32017: POST > SSO > Config > Internal > X509_cert field is valid > Validate sso config is created', async function () {
        res = await requests.postSSOConfigs(ssoConfigsRequestBody)
        assert.equal(res.status, 201, 'Actual status is ' + res.status)
        sso_config_id = res.body.sso_config_id
        assert.uuid(res.body.sso_config_id, 'v4')
        assert.equal(res.body.idp_sso_url, idp_sso_url, 'Actual idp_sso_url is ' + res.body.idp_sso_url)
        assert.equal(res.body.idp_entity_id, idp_entity_id, 'Actual idp_entity_id is ' + res.body.idp_entity_id)
        assert.equal(res.body.X509_cert, X509_cert, 'Actual X509_cert is ' + res.body.X509_cert)
        assert.equal(res.body.enabled, enabled, 'Actual enabled boolean value is ' + res.body.enabled)
        assert.equal(res.body.idp_oauth_client_id, idp_oauth_client_id, 'Actual idp_oauth_client_id is ' + res.body.idp_oauth_client_id)
        assert.equal(res.body.reseller_id, reseller_id, 'Actual reseller_id is ' + res.body.reseller_id)
        assert.equal(res.body.oauth_group, oauth_group, 'Actual oauth_group_id is ' + res.body.oauth_group)
        assert.include(res.body.acs_url, 'https://auth')
        assert.include(res.body.sp_entity_id, 'https://auth')
        assert.exists(res.body.create_date, 'create_date do not exist')
        assert.exists(res.body.update_date, 'update_date do not exist')
    })

    afterEach(async function () {
        await requests.deleteSSOConfigs(sso_config_id)
        await requests.deleteSSOApplications(client_id)
        await requests.deleteSSOGroups(oauth_group)
    })
})