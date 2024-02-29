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
const editNotificationPayload = require('../../common/datasource/editNotification')

const common_utils = require('../../common/util/commonUtils')

const timeout = config.get('timeout')

describe('PATCH notifications (+) - Verify response *end-to-end*', function () {
    this.timeout(timeout)
    let par_group_name
    let par_requestBody
    let par_app_id
    let admin_id = config.get('admin.corp_id')
    let notification_requestBody, notification_id, notify_destination
    let direction = 'INBOUND'
    let type = 'WEBHOOK'
    let event_type = 'FAX_PEEK_PAGE'
    let res

    before(async function () {
        try {
            par_group_name = "My Account\\Avijit Test Automation"
            par_requestBody = applicationsPayload.postApplications(admin_id, par_group_name)

            res = await requests.postApplications(par_requestBody)
            par_app_id = res.body.app_id
            console.log("Parent app_id is " + par_app_id)

            notification_requestBody = notificationPayload.postNotification(direction, type, event_type)
            res = await requests.postNotification(par_app_id, notification_requestBody)
            notification_id = res.body.notification_id
            notify_destination = res.body.notify_destination

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C27742: PATCH Notifications > Edit Webhook > Validated exiting webhook can be disabled *smoke*', async function () {
        notification_requestBody = editNotificationPayload.patchNotification(false)
        notification_requestBody.notify_destination = 'https://testingpurpose.com'
        res = await requests.patchNotification(par_app_id, notification_id, notification_requestBody)
        assert.equal(res.status, 200, 'Actual status code is ' + res.status)
        assert.equal(res.body.app_id, par_app_id, 'Generated app_id is not same as par_app_id')
        assert.equal(res.body.direction, direction, 'Actual direction is ' + res.body.direction)
        assert.equal(res.body.enabled, false, 'Actual enabled boolean value is ' + res.body.enabled)
        assert.equal(res.body.event_type, event_type, 'Actual user_message is ' + res.body.event_type)
        assert.equal(res.body.notification_id, notification_id, 'notification_id does not match')
        assert.notEqual(res.body.notify_destination, notify_destination, 'Not able to patch notify_destination')
        assert.equal(res.body.status, 'A', 'Actual status is ' + res.body.status)
        assert.equal(res.body.type, type, 'Actual user_message is ' + res.body.type)
    })

    it('C27743: PATCH Notifications > Edit Webhook > Validated exiting webhook notification url can be modified', async function () {
        notification_requestBody = editNotificationPayload.patchNotification(false)
        res = await requests.patchNotification(par_app_id, notification_id, notification_requestBody)
        assert.equal(res.status, 200, 'Actual status code is ' + res.status)
        assert.equal(res.body.app_id, par_app_id, 'Generated app_id is not same as par_app_id')
        assert.equal(res.body.direction, direction, 'Actual direction is ' + res.body.direction)
        assert.equal(res.body.enabled, false, 'Actual enabled boolean value is ' + res.body.enabled)
        assert.equal(res.body.event_type, event_type, 'Actual user_message is ' + res.body.event_type)
        assert.equal(res.body.notification_id, notification_id, 'notification_id does not match')
        assert.include(res.body.notify_destination, 'https://', 'Actual notification_destination is ' + res.body.notify_destination)
        assert.equal(res.body.status, 'A', 'Actual status is ' + res.body.status)
        assert.equal(res.body.type, type, 'Actual user_message is ' + res.body.type)   
    })

    it('C32469: PATCH Notifications > Validated exiting notify config secret_key can be modified', async function () {
        notification_requestBody = editNotificationPayload.patchNotification(false)
        notification_requestBody.hmac_secret = common_utils.randString(``, 33)
        hmac_secret = notification_requestBody.hmac_secret
        res = await requests.patchNotification(par_app_id, notification_id, notification_requestBody)
        assert.equal(res.status, 200, 'Actual status code is ' + res.status)
        assert.notExists(res.body.hmac_secret, 'hmac_secret exists')
    })

    it('C32918: PATCH Notifications > Validate able to patch by only passing secret_key', async function () {
        notification_requestBody = editNotificationPayload.patchNotification(false)
        delete notification_requestBody.enabled
        delete notification_requestBody.notify_destination
        notification_requestBody.hmac_secret = common_utils.randString(``, 33)
        res = await requests.patchNotification(par_app_id, notification_id, notification_requestBody)
        assert.equal(res.status, 200, 'Actual status code is ' + res.status)
        assert.notExists(res.body.hmac_secret, 'hmac_secret exists')
    })

    it('C33323: Patch Notifications > Validate if able to edit key with hmac_secret instead of secret_key along with other required key value pair', async function () {
        notification_requestBody.hmac_secret = common_utils.randString(``, 1024)
        hmac_secret = notification_requestBody.hmac_secret
        delete notification_requestBody.direction
        delete notification_requestBody.type
        delete notification_requestBody.event_type
        res = await requests.patchNotification(par_app_id, notification_id, notification_requestBody)
        assert.equal(res.status, 200, 'Actual status code is '+res.status)
        assert.notExists(res.body.hmac_secret, 'hmac_secret exists')
    })

    after(async function () {
        await requests.delApplications(par_app_id, par_requestBody)
    })
})