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

describe('PATCH notifications Auth (-) - Verify response *end-to-end*', function () {
    this.timeout(timeout)
    let group_name
    let app_requestBody
    let app_id, notify_id, notify_auth_id
    let admin_id = config.get('admin.corp_id')
    let notificationRequestBody, notificationAuthRequestBody
    let direction ='INBOUND'
    let type = 'WEBHOOK'
    let event_type = 'FAX_PEEK_PAGE'
    let randGuid
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

            notificationAuthRequestBody = notificationAuthPayload.postNotificationAuth()

            res = await requests.postApplicationsNotificationsAuth(app_id, notificationAuthRequestBody, notify_id)
            notify_auth_id = res.body.auth_id

            randGuid = common_utils.createGUID()

            notificationAuthRequestBody = notificationAuthPayload.patchNotificationAuth(false)

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C28055: PATCH Notifications auth > Validate invalid parameter is not ignored', async function () {
        notificationAuthRequestBody.client_id = 'updated_client_id'
        notificationAuthRequestBody.client_secret = 'updated_client_secret'       
        res = await requests.patchApplicationsNotificationsAuth(app_id, notificationAuthRequestBody, notify_id, notify_auth_id)
        assert.equal(res.status, 400, 'Actual status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'GEN013', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'Request body not readable or missing: Unrecognized field "client_id" (class com.j2.core.api.model.request.NotificationAuthPatchRequest), not marked as ignorable', 'Actual developer_message is' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Invalid request.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C28056: PATCH Notifications auth > Validate notification auth data is NOT updated passing not existing app-id *smoke*', async function () {      
        notificationAuthRequestBody = notificationAuthPayload.patchNotificationAuth(false)
        res = await requests.patchApplicationsNotificationsAuth(randGuid, notificationAuthRequestBody, notify_id, notify_auth_id)
        assert.equal(res.status, 404, 'Actual status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'NAUT003', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ValidationResult', 'Actual element_name is ' + res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'Application not found', 'Actual developer_message is' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Application not found', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C28057: PATCH Notifications auth > Validate notification auth data is NOT updated passing not existing notification id', async function () {      
        notificationAuthRequestBody = notificationAuthPayload.patchNotificationAuth(false)
        res = await requests.patchApplicationsNotificationsAuth(app_id, notificationAuthRequestBody, randGuid, notify_auth_id)
        assert.equal(res.status, 404, 'Actual status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'NAUT011', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ValidationResult', 'Actual element_name is ' + res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'Notification config not found', 'Actual developer_message is' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Notification config not found', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C28058: PATCH Notifications auth > Validate notification auth data is NOT updated passing not existing notification id', async function () {      
        notificationAuthRequestBody = notificationAuthPayload.patchNotificationAuth(false)
        res = await requests.patchApplicationsNotificationsAuth(app_id, notificationAuthRequestBody, notify_id, randGuid)
        assert.equal(res.status, 404, 'Actual status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'NAUT001', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ResultCode', 'Actual element_name is ' + res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'Requested notification authentication not found.', 'Actual developer_message is' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Requested notification authentication not found.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C28059: PATCH Notifications auth > Validate new notification auth is not updated not passing body', async function () {      
        notificationAuthRequestBody = notificationAuthPayload.patchNotificationAuth(false)
        res = await requests.patchApplicationsNotificationsAuth(app_id, ``, notify_id, notify_auth_id)
        assert.equal(res.status, 400, 'Actual status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'GEN013', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'Request body not readable or missing', 'Actual developer_message is' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Invalid request.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C28060: PATCH Notifications auth > Validate new notification auth is not updated passing invalid body', async function () {      
        res = await requests.patchApplicationsNotificationsAuth(app_id, {}, notify_id, notify_auth_id)
        assert.equal(res.status, 400, 'Actual status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'NAUT002', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ValidationResult', 'Actual element_name is ' + res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'No editable values passed in', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'No editable values passed in', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    after(async function () {
        await requests.delApplications(app_id, app_requestBody)
    })
})