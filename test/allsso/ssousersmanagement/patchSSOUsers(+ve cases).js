/**
 * Import required packages
 */
require('mocha')

var config = require('config')
var assert = require('chai').assert
const chai = require('chai')
chai.use(require('chai-uuid'))

const requests = require('../../../common/setup/request')
const common_utils = require('../../../common/util/commonUtils')

const applicationsPayload = require('../../../common/datasource/createApplication')
const usersPayload = require('../../../common/datasource/createUser')
const ssoGroupsPayload = require('../../../common/datasource/createSSOGroups')
const ssoApplicationsPayload = require('../../../common/datasource/createSSOApplications')
const ssoConfigsPayload = require('../../../common/datasource/createSSOConfigs')
const ssoUsersPayload = require('../../../common/datasource/createSSOUsers')

const timeout = config.get('timeout')

describe('PATCH /sso/users (+) - Validate response *sso* *end-to-end*', function () {
    this.timeout(timeout)
    let group_name, app_id, fax_number, sso_config_id, customer_key, email, oauth_group, client_id, sso_user_id
    let appRequestBody, userRequestBody, ssoApplicationsRequestBody, ssoGroupsRequestBody, ssoConfigsRequestBody, ssoUsersRequestBody
    let reseller_id = config.get('admin.corp_id')
    let userName = config.get('admin.username')
    let enabled = true
    let updated_email
    let res

    before(async function () {
        try {
            group_name = "My Account\\Avijit Test Automation"
            appRequestBody = applicationsPayload.postApplications(reseller_id, group_name)

            res = await requests.postApplications(appRequestBody)
            app_id = res.body.app_id
            console.log("app_id is " + app_id)

            userRequestBody = usersPayload.postUsers(app_id, group_name)
            userRequestBody.user.email_address = common_utils.randEmail()
            email = userRequestBody.user.email_address

            res = await requests.postUsers(userRequestBody, userName, reseller_id)
            customer_key = res.body.fax_numbers[0].customer_key
            fax_number = res.body.fax_numbers[0].fax_number

            ssoGroupsRequestBody = ssoGroupsPayload.postSSOGroups()

            res = await requests.postSSOGroups(ssoGroupsRequestBody)
            oauth_group = res.body.oauth_group

            ssoApplicationsRequestBody = ssoApplicationsPayload.postSSOApplications(oauth_group, enabled)

            res = await requests.postSSOApplications(ssoApplicationsRequestBody)
            client_id = res.body.client_id

            ssoConfigsRequestBody = ssoConfigsPayload.postSSOConfigs(oauth_group, reseller_id, client_id)

            res = await requests.postSSOConfigs(ssoConfigsRequestBody)
            sso_config_id = res.body.sso_config_id

            ssoUsersRequestBody = ssoUsersPayload.postSSOUsers(sso_config_id, email, customer_key, true)

            res = await requests.postSSOUsers(ssoUsersRequestBody)
            sso_user_id = res.body.sso_user_id

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C31255: PATCH > SSO > Users > Internal > email > Validate SSO user details are updated', async function () {
        updated_email = common_utils.randEmail()
        res = await requests.patchSSOUsers({"email": updated_email}, sso_user_id)
        assert.equal(res.status, 200, 'Actual status is ' + res.status)
        assert.equal(res.body.email, updated_email, 'Actual email is '+res.body.email)

        res = await requests.getSSOUsers(sso_user_id)
        assert.equal(res.status, 200, 'Actual status is ' + res.status)
        assert.equal(res.body.email, updated_email, 'Actual email is '+res.body.email)
    })

    it('C31256: PATCH > SSO > Users > Internal > sso_name_id > Validate SSO user details are updated', async function () {
        updated_email = common_utils.randEmail()
        res = await requests.patchSSOUsers({"sso_name_id": updated_email}, sso_user_id)
        assert.equal(res.status, 200, 'Actual status is ' + res.status)
        assert.equal(res.body.sso_name_id, updated_email, 'Actual sso_name_id is '+res.body.sso_name_id)

        res = await requests.getSSOUsers(sso_user_id)
        assert.equal(res.status, 200, 'Actual status is ' + res.status)
        assert.equal(res.body.sso_name_id, updated_email, 'Actual sso_name_id is '+res.body.sso_name_id)
    })

    it('C31257: PATCH > SSO > Users > Internal > enabled > Validate SSO user details are updated', async function () {
        res = await requests.patchSSOUsers({"enabled": false}, sso_user_id)
        assert.equal(res.status, 200, 'Actual status is ' + res.status)
        assert.equal(res.body.enabled, false, 'Actual enabled boolean value is '+res.body.enabled)

        res = await requests.getSSOUsers(sso_user_id)
        assert.equal(res.status, 200, 'Actual status is ' + res.status)
        assert.equal(res.body.enabled, false, 'Actual sso_name_id is '+res.body.enabled)
    })

    after(async function () {
        await requests.delApplications(app_id, appRequestBody)
        await requests.deleteSSOUsers(sso_user_id)
        await requests.deleteSSOConfigs(sso_config_id)
        await requests.deleteSSOApplications(client_id)
        await requests.deleteSSOGroups(oauth_group)
    })
})