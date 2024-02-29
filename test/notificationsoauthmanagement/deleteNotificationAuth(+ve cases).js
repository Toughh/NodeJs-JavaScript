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

const timeout = config.get('timeout')

describe('DELETE notifications Auth (+) - Verify response *end-to-end*', function () {
    this.timeout(timeout)
    let group_name
    let app_requestBody
    let app_id, notify_id, notify_auth_id
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

            notificationAuthRequestBody = notificationAuthPayload.postNotificationAuth()

            res = await requests.postApplicationsNotificationsAuth(app_id, notificationAuthRequestBody, notify_id)
            notify_auth_id = res.body.auth_id

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C28068: DELETE Notifications auth > Validate notification auth is deleted *smoke*', async function () {
        res = await requests.deleteApplicationsNotificationsAuth(app_id, notificationAuthRequestBody, notify_id, notify_auth_id)
        assert.equal(res.status, 204, 'Actual status is '+res.status)
    })

    after(async function () {
        await requests.delApplications(app_id, app_requestBody)
    })
})