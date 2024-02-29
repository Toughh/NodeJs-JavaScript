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

describe('DELETE notifications Auth (-) - Verify response *end-to-end*', function () {
    this.timeout(timeout)
    let group_name
    let app_requestBody
    let app_id, notify_id, notify_auth_id
    let admin_id = config.get('admin.corp_id')
    let notificationRequestBody, notificationAuthRequestBody
    let direction = 'INBOUND'
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
            assert.equal(res.status, 201, 'Actual status code is ' + res.status)
            notify_id = res.body.notification_id

            notificationAuthRequestBody = notificationAuthPayload.postNotificationAuth()

            res = await requests.postApplicationsNotificationsAuth(app_id, notificationAuthRequestBody, notify_id)
            notify_auth_id = res.body.auth_id

            randGuid = common_utils.createGUID()

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C28069: DELETE Notifications auth > Validate error passing not existing app-id *smoke*', async function () {
        res = await requests.deleteApplicationsNotificationsAuth(randGuid, notificationAuthRequestBody, notify_id, notify_auth_id)
        assert.equal(res.status, 404, 'Actual status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'NAUT003', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ValidationResult', 'Actual element_name is ' + res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'Application not found', 'Actual developer_message is' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Application not found', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C28070: DELETE Notifications auth > Validate error passing not existing notification id', async function () {
        res = await requests.deleteApplicationsNotificationsAuth(app_id, notificationAuthRequestBody, randGuid, notify_auth_id)
        assert.equal(res.status, 404, 'Actual status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'NAUT011', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ValidationResult', 'Actual element_name is ' + res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'Notification config not found', 'Actual developer_message is' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Notification config not found', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C28071: DELETE Notifications auth > Validate error passing not existing notification auth-id', async function () {
        res = await requests.deleteApplicationsNotificationsAuth(app_id, notificationAuthRequestBody, notify_id, randGuid)
        assert.equal(res.status, 404, 'Actual status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'NAUT001', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ResultCode', 'Actual element_name is ' + res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'Requested notification authentication not found.', 'Actual developer_message is' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Requested notification authentication not found.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    after(async function () {
        await requests.delApplications(app_id, app_requestBody)
    })
})