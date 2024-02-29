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

describe('GET /sso/configs/sso_config_id (+) - Validate response *sso* *end-to-end*', function () {
    this.timeout(timeout)
    let ssoGroupsRequestBody, ssoApplicationsRequestBody, ssoConfigsRequestBody
    let reseller_id = config.get('admin.corp_id')
    let oauth_group, client_id, sso_config_id
    let enabled = true
    let idp_sso_url, idp_entity_id, idp_oauth_client_id, X509_cert
    let acs_url, sp_entity_id
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
            enabled = ssoConfigsRequestBody.enabled
            X509_cert = ssoConfigsRequestBody.X509_cert

            res = await requests.postSSOConfigs(ssoConfigsRequestBody)
            sso_config_id = res.body.sso_config_id
            acs_url = res.body.acs_url
            create_date = res.body.create_date
            update_date = res.body.update_date
            sp_entity_id = res.body.sp_entity_id

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C31266: GET > SSO > Config > Internal > Validate SSO config details are returned', async function () {
        res = await requests.getSSOConfigs(sso_config_id)
        assert.equal(res.status, 200, 'Actual status is ' + res.status)

        assert.equal(res.body.sso_config_id, sso_config_id, 'Actual sso_config_id is '+res.body.sso_config_id)
        assert.equal(res.body.idp_sso_url, idp_sso_url, 'Actual idp_sso_url is ' + res.body.idp_sso_url)
        assert.equal(res.body.idp_entity_id, idp_entity_id, 'Actual idp_entity_id is ' + res.body.idp_entity_id)
        assert.equal(res.body.X509_cert, X509_cert, 'Actual X509_cert is ' + res.body.X509_cert)
        assert.equal(res.body.enabled, true, 'Actual enabled boolean value is ' + res.body.enabled)
        assert.equal(res.body.idp_oauth_client_id, idp_oauth_client_id, 'Actual idp_oauth_client_id is ' + res.body.idp_oauth_client_id)
        assert.equal(res.body.reseller_id, reseller_id, 'Actual reseller_id is ' + res.body.reseller_id)
        assert.equal(res.body.oauth_group, oauth_group, 'Actual oauth_group_id is ' + res.body.oauth_group)
        assert.equal(res.body.acs_url, acs_url, 'Actual acs_url is '+res.body.acs_url)
        assert.equal(res.body.sp_entity_id, sp_entity_id, 'Actual sp_entity_id is '+res.body.sp_entity_id)
        assert.exists(res.body.create_date, 'create_date does not exist')
        assert.exists(res.body.update_date, 'update_date does not exist')
    })

    after(async function() {
        await requests.deleteSSOConfigs(sso_config_id)   
        await requests.deleteSSOApplications(client_id)
        await requests.deleteSSOGroups(oauth_group)
    })
})