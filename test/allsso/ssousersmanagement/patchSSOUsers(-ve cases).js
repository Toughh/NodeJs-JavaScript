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

describe('PATCH /sso/users (-) - Validate response *sso* *end-to-end*', function () {
    this.timeout(timeout)
    let group_name1, app_id1, sso_config_id1, customer_key1, email1, oauth_group1, client_id1, sso_name_id1, sso_user_id1
    let group_name2, app_id2, sso_config_id2, customer_key2, email2, oauth_group2, client_id2, sso_name_id2, sso_user_id2
    let appRequestBody1, userRequestBody1, ssoGroupsRequestBody1, ssoApplicationsRequestBody1, ssoConfigsRequestBody1, ssoUsersRequestBody1
    let appRequestBody2, userRequestBody2, ssoUsersRequestBody2
    let reseller_id = config.get('admin.corp_id')
    let userName = config.get('admin.username')
    let enabled = true
    let invalid_email, notExist_sso_name_id
    let fax_number1, fax_number2
    let res

    before(async function () {
        try {
            group_name1 = "My Account\\Avijit Test Automation"
            appRequestBody1 = applicationsPayload.postApplications(reseller_id, group_name1)

            res = await requests.postApplications(appRequestBody1)
            app_id1 = res.body.app_id
            console.log("app_id is " + app_id1)

            userRequestBody1 = usersPayload.postUsers(app_id1, group_name1)
            userRequestBody1.user.email_address = common_utils.randEmail()
            email1 = userRequestBody1.user.email_address

            res = await requests.postUsers(userRequestBody1, userName, reseller_id)
            customer_key1 = res.body.fax_numbers[0].customer_key
            fax_number1 = res.body.fax_numbers[0].fax_number

            ssoGroupsRequestBody1 = ssoGroupsPayload.postSSOGroups()

            res = await requests.postSSOGroups(ssoGroupsRequestBody1)
            oauth_group1 = res.body.oauth_group

            ssoApplicationsRequestBody1 = ssoApplicationsPayload.postSSOApplications(oauth_group1, enabled)

            res = await requests.postSSOApplications(ssoApplicationsRequestBody1)
            client_id1 = res.body.client_id

            ssoConfigsRequestBody1 = ssoConfigsPayload.postSSOConfigs(oauth_group1, reseller_id, client_id1)

            res = await requests.postSSOConfigs(ssoConfigsRequestBody1)
            sso_config_id1 = res.body.sso_config_id

            ssoUsersRequestBody1 = ssoUsersPayload.postSSOUsers(sso_config_id1, email1, customer_key1, true)

            res = await requests.postSSOUsers(ssoUsersRequestBody1)
            sso_user_id1 = res.body.sso_user_id
            email1 = res.body.email
            sso_name_id1 = res.body.sso_name_id

            group_name2 = "My Account\\Avijit Test Automation\\Child Group Test"
            appRequestBody2 = applicationsPayload.postApplications(reseller_id, group_name2)

            res = await requests.postApplications(appRequestBody2)
            app_id2 = res.body.app_id
            console.log("app_id is " + app_id2)

            userRequestBody2 = usersPayload.postUsers(app_id2, group_name2)
            userRequestBody2.user.email_address = common_utils.randEmail()
            email2 = userRequestBody2.user.email_address

            res = await requests.postUsers(userRequestBody2, userName, reseller_id)
            customer_key2 = res.body.fax_numbers[0].customer_key
            fax_number2 = res.body.fax_numbers[0].fax_number

            ssoUsersRequestBody2 = ssoUsersPayload.postSSOUsers(sso_config_id1, email2, customer_key2, true)
            ssoUsersRequestBody2.sso_name_id = common_utils.randEmail()

            res = await requests.postSSOUsers(ssoUsersRequestBody2)
            sso_user_id2 = res.body.sso_user_id
            email2 = res.body.email
            sso_name_id2 = res.body.sso_name_id

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C31258: PATCH > SSO > Users > Internal > email invalid format > Validate 400 Bad Request is returned', async function () {
        invalid_email = 'invalid_email'
        res = await requests.patchSSOUsers({"email": invalid_email}, sso_user_id1)
        assert.equal(res.status, 400, 'Actual status code is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'SSO015', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'Email address is not valid.', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'SSO request validation exception.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C31262: PATCH > SSO > Users > Internal > sso_name_id does not exist > Validate 400 Bad Request is returned', async function () {
        notExist_sso_name_id = common_utils.createGUID()
        res = await requests.patchSSOUsers({"sso_name_id": sso_name_id1}, notExist_sso_name_id)
        assert.equal(res.status, 404, 'Actual status code is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'SSO006', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'SSO user not found: '+notExist_sso_name_id, 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'SSO user not found.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C31259: PATCH > SSO > Users > Internal > email not unique > Validate 400 Bad Request is returned', async function () {
        res = await requests.patchSSOUsers({"email": email1, "sso_name_id": sso_name_id1, "enabled": true}, sso_user_id1)
        assert.equal(res.status, 200, 'Actual status code is '+res.status)

        res = await requests.patchSSOUsers({"email": email2}, sso_user_id1)
        assert.equal(res.status, 400, 'Actual status code is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'SSO011', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'SSO user email is not unique.', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'SSO user email is not unique.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C31260: PATCH > SSO > Users > Internal > sso_name_id not unique > Validate 400 Bad Request is returned', async function () {
        res = await requests.patchSSOUsers({"email": email1, "sso_name_id": sso_name_id1, "enabled": false}, sso_user_id1)
        assert.equal(res.status, 200, 'Actual status code is '+res.status)

        res = await requests.patchSSOUsers({"sso_name_id": sso_name_id2}, sso_user_id1)
        assert.equal(res.status, 400, 'Actual status code is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'SSO012', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'SSO user name Id is not unique.', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'SSO user name Id is not unique.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C31261: PATCH > SSO > Users > Internal > sso_name_id is empty > Validate 400 Bad Request is returned', async function () {
        res = await requests.patchSSOUsers({"sso_name_id": ""}, sso_user_id1)
        assert.equal(res.status, 400, 'Actual status code is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'SSO015', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'SSO user name id cannot be blank.', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'SSO request validation exception.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    after(async function () {
        await requests.delApplications(app_id2, appRequestBody2)
        await requests.deleteSSOUsers(sso_user_id2)
        await requests.deleteSSOConfigs(sso_config_id2)
        await requests.deleteSSOApplications(client_id2)
        await requests.deleteSSOGroups(oauth_group2)

        await requests.delApplications(app_id1, appRequestBody1)
        await requests.deleteSSOUsers(sso_user_id1)
        await requests.deleteSSOConfigs(sso_config_id1)
        await requests.deleteSSOApplications(client_id1)
        await requests.deleteSSOGroups(oauth_group1)
    })
})