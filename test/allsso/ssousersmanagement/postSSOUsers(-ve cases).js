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

describe('POST /sso/users (-) - Validate response *sso* *end-to-end*', function () {
    this.timeout(timeout)
    let group_name, app_id, fax_number, sso_config_id, customer_key, email, sso_name_id, oauth_group, client_id, sso_user_id
    let appRequestBody, userRequestBody, ssoApplicationsRequestBody, ssoGroupsRequestBody, ssoConfigsRequestBody, ssoUsersRequestBody
    let reseller_id = config.get('admin.corp_id')
    let userName = config.get('admin.username')
    let randGuid
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

            randGuid = common_utils.createGUID()

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C31146: POST > SSO > Users > Internal > sso_config_id field is missing > Validate 400 Bad Request is returned', async function () {
        ssoUsersRequestBody = ssoUsersPayload.postSSOUsers(sso_config_id, email, customer_key, true)
        delete ssoUsersRequestBody.sso_config_id
        res = await requests.postSSOUsers(ssoUsersRequestBody)
        assert.equal(res.status, 400, 'Actual status code is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'SSO015', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'SSO config id is not specified.', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'SSO request validation exception.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C31147: POST > SSO > Users > Internal > email field is missing > Validate 400 Bad Request is returned', async function () {
        ssoUsersRequestBody = ssoUsersPayload.postSSOUsers(sso_config_id, email, customer_key, true)
        delete ssoUsersRequestBody.email
        res = await requests.postSSOUsers(ssoUsersRequestBody)
        assert.equal(res.status, 400, 'Actual status code is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'SSO015', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'SSO user email is not specified.', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'SSO request validation exception.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C31148: POST > SSO > Users > Internal > customer_key field is missing > Validate 400 Bad Request is returned', async function () {
        ssoUsersRequestBody = ssoUsersPayload.postSSOUsers(sso_config_id, email, customer_key, true)
        delete ssoUsersRequestBody.customer_key
        res = await requests.postSSOUsers(ssoUsersRequestBody)
        assert.equal(res.status, 400, 'Actual status code is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'SSO015', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'SSO user customer key is not specified.', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'SSO request validation exception.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C31149: POST > SSO > Users > Internal > sso_name_id field is missing > Validate 400 Bad Request is returned', async function () {
        ssoUsersRequestBody = ssoUsersPayload.postSSOUsers(sso_config_id, email, customer_key, true)
        delete ssoUsersRequestBody.sso_name_id
        res = await requests.postSSOUsers(ssoUsersRequestBody)
        assert.equal(res.status, 400, 'Actual status code is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'SSO015', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'SSO user name id is not specified.', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'SSO request validation exception.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C31150: POST > SSO > Users > Internal > sso_config_id does not exist > Validate 404 Not found is returned', async function () {
        ssoUsersRequestBody = ssoUsersPayload.postSSOUsers(sso_config_id, email, customer_key, true)
        ssoUsersRequestBody.sso_config_id = randGuid
        res = await requests.postSSOUsers(ssoUsersRequestBody)
        assert.equal(res.status, 404, 'Actual status code is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'SSO002', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'SSO config not found: ' + randGuid+'.', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'SSO config not found.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C31151: POST > SSO > Users > Internal > email invalid format > Validate 400 Bad Request is returned', async function () {
        ssoUsersRequestBody = ssoUsersPayload.postSSOUsers(sso_config_id, email, customer_key, true)
        ssoUsersRequestBody.email = 'INVALID'
        res = await requests.postSSOUsers(ssoUsersRequestBody)
        assert.equal(res.status, 400, 'Actual status code is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'SSO015', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'Email address is not valid.', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'SSO request validation exception.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C31154: POST > SSO > Users > Internal > customer_key does not belong to reseller_id > Validate 400 Bad Request is returned', async function () {
        ssoUsersRequestBody = ssoUsersPayload.postSSOUsers(sso_config_id, email, customer_key, true)
        ssoUsersRequestBody.customer_key = '1111111'

        res = await requests.postSSOUsers(ssoUsersRequestBody)
        assert.equal(res.status, 400, 'Actual status code is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'CUS001', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'Customer does not belong to Admin.', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Customer does not belong to Admin.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C31152: POST > SSO > Users > Internal > email not unique > Validate 400 Bad Request is returned', async function () {
        res = await requests.deleteSSOUsers(sso_user_id)
        ssoUsersRequestBody = ssoUsersPayload.postSSOUsers(sso_config_id, email, customer_key, true)

        res = await requests.postSSOUsers(ssoUsersRequestBody)
        assert.equal(res.status, 201, 'Actual status code is ' + res.status)
        sso_user_id = res.body.sso_user_id

        sso_name_id = common_utils.randEmail()
        ssoUsersRequestBody.sso_name_id = sso_name_id

        res = await requests.postSSOUsers(ssoUsersRequestBody)
        assert.equal(res.status, 400, 'Actual status code is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'SSO011', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'SSO user email is not unique.', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'SSO user email is not unique.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C31155: POST > SSO > Users > Internal > sso_name_id not unique > Validate 400 Bad Request is returned', async function () {
        ssoUsersRequestBody = ssoUsersPayload.postSSOUsers(sso_config_id, email, customer_key, true)
        email = common_utils.randEmail()
        ssoUsersRequestBody.email = email

        res = await requests.postSSOUsers(ssoUsersRequestBody)
        assert.equal(res.status, 400, 'Actual status code is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'SSO012', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'SSO user name Id is not unique.', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'SSO user name Id is not unique.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    after(async function () {
        await requests.delApplications(app_id, appRequestBody)
        await requests.deleteSSOUsers(sso_user_id)
        await requests.deleteSSOConfigs(sso_config_id)
        await requests.deleteSSOApplications(client_id)
        await requests.deleteSSOGroups(oauth_group)
    })
})