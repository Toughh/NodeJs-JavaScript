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

describe('POST /sso/users (+) - Validate response *sso* *end-to-end*', function () {
    this.timeout(timeout)
    let group_name, app_id, fax_number, customer_key, email, sso_name_id, oauth_group, client_id, sso_user_id, sso_config_id
    let appRequestBody, userRequestBody, ssoApplicationsRequestBody, ssoGroupsRequestBody, ssoConfigsRequestBody, ssoUsersRequestBody
    let reseller_id = config.get('admin.corp_id')
    let userName = config.get('admin.username')
    let enabled = true
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
            sso_name_id = ssoUsersRequestBody.sso_name_id
            sso_user_id = ssoUsersRequestBody.sso_user_id

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C31145: POST > SSO > Users > Internal > Validate SSO user is created when sending all fields', async function () {
        res = await requests.postSSOUsers(ssoUsersRequestBody)
        assert.equal(res.status, 201, 'Actual status is ' + res.status)
        assert.uuid(res.body.sso_user_id, 'v4')
        assert.equal(res.body.sso_config_id, sso_config_id, 'Actual sso_config_id is '+res.body.sso_config_id)
        assert.equal(res.body.customer_key, customer_key, 'Actual customer_key is '+res.body.customer_key)
        assert.equal(res.body.email, email, 'Actual email is '+res.body.email)
        assert.equal(res.body.enabled, enabled, 'Actual enabled boolean value is '+res.body.enabled)
        assert.equal(res.body.sso_name_id, sso_name_id, 'Actual sso_name_id is '+res.body.sso_name_id)
    })

    after(async function () {
        await requests.delApplications(app_id, appRequestBody)
        await requests.deleteSSOUsers(sso_user_id)
        await requests.deleteSSOConfigs(sso_config_id)
        await requests.deleteSSOApplications(client_id)
        await requests.deleteSSOGroups(oauth_group)
    })
})

