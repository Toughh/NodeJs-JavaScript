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

describe('DELETE /sso/applications (-) - Validate response *sso* *end-to-end*', function () {
    this.timeout(timeout)
    let ssoGroupsRequestBody, ssoApplicationsRequestBody, ssoConfigsRequestBody
    let oauth_group, client_id, sso_config_id
    let enabled = true
    let reseller_Id = config.get('admin.corp_id')
    let res

    before(async function () {
        try {
            not_exist_client_id = common_utils.createGUID()

            ssoGroupsRequestBody = ssoGroupsPayload.postSSOGroups()

            res = await requests.postSSOGroups(ssoGroupsRequestBody)
            oauth_group = res.body.oauth_group

            ssoApplicationsRequestBody = ssoApplicationsPayload.postSSOApplications(oauth_group, enabled)

            res = await requests.postSSOApplications(ssoApplicationsRequestBody)
            client_id = res.body.client_id

            ssoConfigsRequestBody = ssoConfigsPayload.postSSOConfigs(oauth_group, reseller_Id, client_id)

            res = await requests.postSSOConfigs(ssoConfigsRequestBody)
            sso_config_id = res.body.sso_config_id

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C31391: DELETE > SSO > Applications > Internal > client_id not exist > Validate 400 bad request is returned', async function () {
        res = await requests.deleteSSOApplications(not_exist_client_id)
        assert.equal(res.status, 404, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'SSO004', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'SSO application not found: '+not_exist_client_id, 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'SSO application not found.', 'Actual user_message is ' + res.body.errors[0].user_message)              
    })

    it('C31469: DELETE > SSO > Applications > Internal > sso_config exist for application > Validate 400 bad request is returned', async function () {
        res = await requests.deleteSSOApplications(client_id)
        assert.equal(res.status, 400, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'SSO015', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'Exists an active OAuth config for this OAuth application.', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'SSO request validation exception.', 'Actual user_message is ' + res.body.errors[0].user_message)              
    })

    after(async function() {
        await requests.deleteSSOConfigs(sso_config_id)
        await requests.deleteSSOApplications(client_id)
        await requests.deleteSSOGroups(oauth_group)
    })
})