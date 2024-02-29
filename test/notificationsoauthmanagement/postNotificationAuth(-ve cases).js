/**
 * Import required packages
 */
require('mocha')
require('../../common/util/testrail-util')

var config = require('config')
var assert = require('chai').assert

const requests = require('../../common/setup/request')
const applicationsPayload = require('../../common/datasource/createApplication')
const notificationPayload = require('../../common/datasource/createNotification')
const notificationAuthPayload = require('../../common/datasource/createNotificationAuth')
const common_utils = require('../../common/util/commonUtils')

const timeout = config.get('timeout')

describe('POST notifications Auth (-) - Verify response *end-to-end*', function () {
    this.timeout(timeout)
    let group_name
    let app_requestBody
    let app_id, notify_id, randGuid
    let admin_id = config.get('admin.corp_id')
    let notificationRequestBody, notificationAuthRequestBody
    let direction = 'INBOUND'
    let type = 'WEBHOOK'
    let event_type = 'FAX_PEEK_PAGE'
    let res

    before(async function () {
        try {
            group_name = "My Account\\Avijit Test Automation"
            app_requestBody = applicationsPayload.postApplications(admin_id, group_name)

            res = await requests.postApplications(app_requestBody)
            app_id = res.body.app_id
            console.log("app_id is " + app_id)

            notificationRequestBody = notificationPayload.postNotification(direction, type, event_type)
            res = await requests.postNotification(app_id, notificationRequestBody)
            notify_id = res.body.notification_id

            randGuid = common_utils.createGUID()

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C28044: POST Notifications auth > Validate new notification auth is NOT created not passing client_id *smoke*', async function () {
        notificationAuthRequestBody = notificationAuthPayload.postNotificationAuth()
        notificationAuthRequestBody.client_id = ""
        res = await requests.postApplicationsNotificationsAuth(app_id, notificationAuthRequestBody, notify_id)
        assert.equal(res.status, 400, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'NAUT004', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ValidationResult', 'Actual element_name is ' + res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'Client Id must be provided.', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Client Id must be provided.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C28045: POST Notifications auth > Validate new notification auth is NOT created not passing client_secret', async function () {
        notificationAuthRequestBody = notificationAuthPayload.postNotificationAuth()
        notificationAuthRequestBody.client_secret = ""
        res = await requests.postApplicationsNotificationsAuth(app_id, notificationAuthRequestBody, notify_id)
        assert.equal(res.status, 400, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'NAUT005', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ValidationResult', 'Actual element_name is ' + res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'Client secret must be provided.', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Client secret must be provided.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C28046: POST Notifications auth > Validate new notification auth is NOT created not passing token_endpoint', async function () {
        notificationAuthRequestBody = notificationAuthPayload.postNotificationAuth()
        notificationAuthRequestBody.token_endpoint = ""
        res = await requests.postApplicationsNotificationsAuth(app_id, notificationAuthRequestBody, notify_id)
        assert.equal(res.status, 400, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'NAUT006', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ValidationResult', 'Actual element_name is ' + res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, "Token endpoint needs to start with 'https://'", 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, "Token endpoint needs to start with 'https://'", 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C28047: POST Notifications auth > Validate new notification auth is NOT created passing invalid token_endpoint', async function () {
        notificationAuthRequestBody = notificationAuthPayload.postNotificationAuth()
        notificationAuthRequestBody.token_endpoint = "Invalid_token_endpoint"
        res = await requests.postApplicationsNotificationsAuth(app_id, notificationAuthRequestBody, notify_id)
        assert.equal(res.status, 400, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'NAUT006', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ValidationResult', 'Actual element_name is ' + res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, "Token endpoint needs to start with 'https://'", 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, "Token endpoint needs to start with 'https://'", 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C28048: POST Notifications auth > Validate new notification auth is NOT created not passing grant_type', async function () {
        notificationAuthRequestBody = notificationAuthPayload.postNotificationAuth()
        notificationAuthRequestBody.grant_type = ""
        res = await requests.postApplicationsNotificationsAuth(app_id, notificationAuthRequestBody, notify_id)
        assert.equal(res.status, 400, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'NAUT010', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ValidationResult', 'Actual element_name is ' + res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'Invalid grant type value. Allowed values: [client_credentials].', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Invalid grant type value. Allowed values: [client_credentials].', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C28049: POST Notifications auth > Validate new notification auth is NOT created passing invalid grant_type', async function () {
        notificationAuthRequestBody = notificationAuthPayload.postNotificationAuth()
        notificationAuthRequestBody.grant_type = "Invalid_grant_type"
        res = await requests.postApplicationsNotificationsAuth(app_id, notificationAuthRequestBody, notify_id)
        assert.equal(res.status, 400, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'NAUT010', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ValidationResult', 'Actual element_name is ' + res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'Invalid grant type value. Allowed values: [client_credentials].', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Invalid grant type value. Allowed values: [client_credentials].', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C28050: POST Notifications auth > Validate new notification auth is NOT created not passing body', async function () {
        res = await requests.postApplicationsNotificationsAuth(app_id, ``, notify_id)
        assert.equal(res.status, 400, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'GEN013', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'Request body not readable or missing', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Invalid request.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C28051: POST Notifications auth > Validate new notification auth is NOT created passing invalid body', async function () {
        res = await requests.postApplicationsNotificationsAuth(app_id, { "invalidBody": "invalidBody" }, notify_id)
        assert.equal(res.status, 400, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'GEN013', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'Request body not readable or missing: Unrecognized field "invalidBody" (class com.j2.core.api.model.request.NotificationAuthCreateRequest), not marked as ignorable', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Invalid request.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C28052: POST Notifications auth > Validate new notification auth is NOT created passing not existing app-id', async function () {
        notificationAuthRequestBody = notificationAuthPayload.postNotificationAuth()
        res = await requests.postApplicationsNotificationsAuth(randGuid, notificationAuthRequestBody, notify_id)
        assert.equal(res.status, 404, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'NAUT003', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ValidationResult', 'Actual element_name is ' + res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'Application not found', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Application not found', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C28053: POST Notifications auth > Validate new notification auth is NOT created passing not existing notification-id', async function () {
        notificationAuthRequestBody = notificationAuthPayload.postNotificationAuth()
        res = await requests.postApplicationsNotificationsAuth(app_id, notificationAuthRequestBody, randGuid)
        assert.equal(res.status, 404, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'NAUT011', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ValidationResult', 'Actual element_name is ' + res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'Notification config not found', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Notification config not found', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C28117: POST Notifications auth > Validate maximum 3 notification auths are allowed', async function () {
        notificationAuthRequestBody = notificationAuthPayload.postNotificationAuth()
        try {
            for (i = 1; i <= 3; i++) {
                res = await requests.postApplicationsNotificationsAuth(app_id, notificationAuthRequestBody, notify_id)
                assert.equal(res.status, 201, 'Actual status is ' + res.status)
            }
        } catch (e) { console.log(e) }

        res = await requests.postApplicationsNotificationsAuth(app_id, notificationAuthRequestBody, notify_id)
        assert.equal(res.status, 400, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'NAUT012', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ValidationResult', 'Actual element_name is ' + res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'Number of auth records per notify config reached the limit of 3.', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Number of auth records per notify config reached the limit of 3.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    after(async function () {
        await requests.delApplications(app_id, app_requestBody)
    })
})