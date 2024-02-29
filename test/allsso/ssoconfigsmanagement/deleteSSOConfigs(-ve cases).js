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

describe('DELETE /sso/configs/sso_config_id (+) - Validate response *sso* *end-to-end*', function () {
    this.timeout(timeout)
    let ssoGroupsRequestBody, ssoApplicationsRequestBody, ssoConfigsRequestBody
    let admin_id = config.get('admin.corp_id')
    let oauth_group, client_id, sso_config_id
    let enabled = true
    let randGuid
    let res

    before(async function () {
        try {
            ssoGroupsRequestBody = ssoGroupsPayload.postSSOGroups()

            res = await requests.postSSOGroups(ssoGroupsRequestBody)
            oauth_group = res.body.oauth_group

            ssoApplicationsRequestBody = ssoApplicationsPayload.postSSOApplications(oauth_group, enabled)

            res = await requests.postSSOApplications(ssoApplicationsRequestBody)
            client_id = res.body.client_id

            ssoConfigsRequestBody = ssoConfigsPayload.postSSOConfigs(oauth_group, admin_id, client_id)

            res = await requests.postSSOConfigs(ssoConfigsRequestBody)
            sso_config_id = res.body.sso_config_id

            res = await requests.deleteSSOConfigs(sso_config_id)

            res = await requests.getSSOConfigs(sso_config_id)

            randGuid = common_utils.createGUID()

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C31296: DELETE > SSO > Config > Internal > sso_config_id has an inactive status > Validate 404 Not Found is returned', async function () {
        res = await requests.deleteSSOConfigs(sso_config_id)
        assert.equal(res.status, 404, 'Actual status is '+res.status)

        assert.equal(res.body.errors[0].error_code, 'SSO002', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'SSO config not found: '+sso_config_id, 'Actual developer_message is '+res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'SSO config not found.', 'Actual user_message is '+res.body.errors[0].user_message)
    })

    it('C31297: DELETE > SSO > Config > Internal > sso_config_id does not exist > Validate 404 Not Found is returned', async function () {
        res = await requests.deleteSSOConfigs(randGuid)
        assert.equal(res.status, 404, 'Actual status is '+res.status)

        assert.equal(res.body.errors[0].error_code, 'SSO002', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'SSO config not found: '+randGuid, 'Actual developer_message is '+res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'SSO config not found.', 'Actual user_message is '+res.body.errors[0].user_message)
    })

    after(async function() {
        await requests.deleteSSOApplications(client_id)
        await requests.deleteSSOGroups(oauth_group)
    })
})