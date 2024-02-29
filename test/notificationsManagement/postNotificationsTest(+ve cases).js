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

const common_utils = require('../../common/util/commonUtils')

const timeout = config.get('timeout')

describe('POST notifications (+) - Verify response *end-to-end*', function () {
    this.timeout(timeout)
    let par_group_name
    let par_requestBody
    let par_app_id
    let admin_id = config.get('admin.corp_id')
    let notification_requestBody
    let direction = 'OUTBOUND', direction1 = 'INBOUND'
    let type = 'WEBHOOK', type1 = 'FAX_CONFIRM'
    let event_type = 'FAX_PEEK_PAGE'
    let hmac_secret
    let res

    before(async function () {
        try {
            par_group_name = "My Account\\Avijit Test Automation"
            par_requestBody = applicationsPayload.postApplications(admin_id, par_group_name)

            res = await requests.postApplications(par_requestBody)
            par_app_id = res.body.app_id
            console.log("Parent app_id is " + par_app_id)

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C27740: POST Notifications > New Outbound Webhook > Validated new webhook is created for an application and enabled *smoke*', async function () {
        notification_requestBody = notificationPayload.postNotification(direction1, type, event_type)
        res = await requests.postNotification(par_app_id, notification_requestBody)
        assert.equal(res.status, 201, 'Actual status code is '+res.status)
        assert.equal(res.body.app_id, par_app_id, 'Generated app_id is not same as par_app_id')
        assert.equal(res.body.direction, direction1, 'Actual direction is '+res.body.direction)
        assert.equal(res.body.enabled, true, 'Actual enabled boolean value is '+res.body.enabled)
        assert.equal(res.body.event_type, event_type, 'Actual user_message is '+res.body.event_type)
        assert.uuid(res.body.notification_id, 'v4')
        assert.include(res.body.notify_destination, 'https://', 'Actual notification_destination is '+res.body.notify_destination)
        assert.equal(res.body.status, 'A', 'Actual status is '+res.body.status)
        assert.equal(res.body.type, type, 'Actual user_message is '+res.body.type)
    })

    it('C27745: POST Notifications > New Outbound Webhook > Type FAX_CONFIRM > Validated new webhook is created for an application and enabled', async function () {
        notification_requestBody = notificationPayload.postNotification(direction, type1, event_type)
        res = await requests.postNotification(par_app_id, notification_requestBody)
        assert.equal(res.status, 201, 'Actual status code is '+res.status)
        assert.equal(res.body.app_id, par_app_id, 'Generated app_id is not same as par_app_id')
        assert.equal(res.body.direction, direction, 'Actual direction is '+res.body.direction)
        assert.equal(res.body.enabled, true, 'Actual enabled boolean value is '+res.body.enabled)
        assert.equal(res.body.event_type, event_type, 'Actual user_message is '+res.body.event_type)
        assert.uuid(res.body.notification_id, 'v4')
        assert.include(res.body.notify_destination, 'https://', 'Actual notification_destination is '+res.body.notify_destination)
        assert.equal(res.body.status, 'A', 'Actual status is '+res.body.status)
        assert.equal(res.body.type, type1, 'Actual user_message is '+res.body.type)
    })

    it('C27746: POST Notifications > New Inbound Webhook > Type FAX_CONFIRM > Validated new webhook is created for an application and enabled *smoke*', async function () {
        notification_requestBody = notificationPayload.postNotification(direction1, type1, event_type)
        res = await requests.postNotification(par_app_id, notification_requestBody)
        assert.equal(res.status, 201, 'Actual status code is '+res.status)
        assert.equal(res.body.app_id, par_app_id, 'Generated app_id is not same as par_app_id')
        assert.equal(res.body.direction, direction1, 'Actual direction is '+res.body.direction)
        assert.equal(res.body.enabled, true, 'Actual enabled boolean value is '+res.body.enabled)
        assert.equal(res.body.event_type, event_type, 'Actual user_message is '+res.body.event_type)
        assert.uuid(res.body.notification_id, 'v4')
        assert.include(res.body.notify_destination, 'https://', 'Actual notification_destination is '+res.body.notify_destination)
        assert.equal(res.body.status, 'A', 'Actual status is '+res.body.status)
        assert.equal(res.body.type, type1, 'Actual user_message is '+res.body.type)
    })

    it('C27741: POST Notifications > New Inbound Webhook > Validated new webhook is created for an application and enabled', async function () {
        notification_requestBody = notificationPayload.postNotification(direction, type, event_type)
        res = await requests.postNotification(par_app_id, notification_requestBody)
        assert.equal(res.status, 201, 'Actual status code is '+res.status)
        assert.equal(res.body.app_id, par_app_id, 'Generated app_id is not same as par_app_id')
        assert.equal(res.body.direction, direction, 'Actual direction is '+res.body.direction)
        assert.equal(res.body.enabled, true, 'Actual enabled boolean value is '+res.body.enabled)
        assert.equal(res.body.event_type, event_type, 'Actual user_message is '+res.body.event_type)
        assert.uuid(res.body.notification_id, 'v4')
        assert.include(res.body.notify_destination, 'https://', 'Actual notification_destination is '+res.body.notify_destination)
        assert.equal(res.body.status, 'A', 'Actual status is '+res.body.status)
        assert.equal(res.body.type, type, 'Actual user_message is '+res.body.type)
    })

    it('C27742: POST Notifications > Edit Webhook > Validated exiting webhook can be disabled.', async function () {
        notification_requestBody = notificationPayload.postNotification(direction, type, event_type)
        res = await requests.postNotification(par_app_id, notification_requestBody)
        assert.equal(res.status, 201, 'Actual status code is '+res.status)
        assert.equal(res.body.app_id, par_app_id, 'Generated app_id is not same as par_app_id')
        assert.equal(res.body.direction, direction, 'Actual direction is '+res.body.direction)
        assert.equal(res.body.enabled, true, 'Actual enabled boolean value is '+res.body.enabled)
        assert.equal(res.body.event_type, event_type, 'Actual user_message is '+res.body.event_type)
        assert.uuid(res.body.notification_id, 'v4')
        assert.include(res.body.notify_destination, 'https://', 'Actual notification_destination is '+res.body.notify_destination)
        assert.equal(res.body.status, 'A', 'Actual status is '+res.body.status)
        assert.equal(res.body.type, type, 'Actual user_message is '+res.body.type)
    })

    it('C29699: POST Notifications > Validate if enable boolean value is false if posting enable set to false', async function () {
        notification_requestBody = notificationPayload.postNotification(direction1, type, event_type)
        notification_requestBody.enabled = false
        res = await requests.postNotification(par_app_id, notification_requestBody)
        assert.equal(res.status, 201, 'Actual status code is '+res.status)
        assert.equal(res.body.app_id, par_app_id, 'Generated app_id is not same as par_app_id')
        assert.equal(res.body.direction, direction1, 'Actual direction is '+res.body.direction)
        assert.equal(res.body.enabled, false, 'Actual enabled boolean value is '+res.body.enabled)
        assert.equal(res.body.event_type, event_type, 'Actual user_message is '+res.body.event_type)
        assert.uuid(res.body.notification_id, 'v4')
        assert.include(res.body.notify_destination, 'https://', 'Actual notification_destination is '+res.body.notify_destination)
        assert.equal(res.body.status, 'A', 'Actual status is '+res.body.status)
        assert.equal(res.body.type, type, 'Actual user_message is '+res.body.type)
    })

    it('C32468: POST Notifications > Validate secret_key is generated if not passed in the request', async function () {
        notification_requestBody = notificationPayload.postNotification(direction1, type, event_type)
        notification_requestBody.enabled = true
        res = await requests.postNotification(par_app_id, notification_requestBody)
        assert.equal(res.status, 201, 'Actual status code is '+res.status)
        assert.exists(res.body.hmac_secret, 'hmac_secret does not exist')
    })

    it('C32470: POST Notifications > Validate notification config is created with exact secret_key', async function () {
        notification_requestBody = notificationPayload.postNotification(direction1, type, event_type)
        notification_requestBody.enabled = true
        notification_requestBody.hmac_secret = common_utils.randString(``, 33)
        hmac_secret = notification_requestBody.hmac_secret
        res = await requests.postNotification(par_app_id, notification_requestBody)
        assert.equal(res.status, 201, 'Actual status code is '+res.status)
        assert.equal(res.body.hmac_secret, hmac_secret, 'Actual hmac_secret is ' +res.body.hmac_secret)

        notification_requestBody.hmac_secret = common_utils.randString(``, 1024)
        hmac_secret = notification_requestBody.hmac_secret
        res = await requests.postNotification(par_app_id, notification_requestBody)
        assert.equal(res.status, 201, 'Actual status code is '+res.status)
        assert.equal(res.body.hmac_secret, hmac_secret, 'Actual hmac_secret is ' +res.body.hmac_secret)
    })

    it('C33322: POST Notifications > Validate notification config is created with exact secret_key', async function () {
        notification_requestBody = notificationPayload.postNotification(direction1, type, event_type)
        notification_requestBody.enabled = true
        notification_requestBody.hmac_secret = common_utils.randString(``, 33)
        hmac_secret = notification_requestBody.hmac_secret
        res = await requests.postNotification(par_app_id, notification_requestBody)
        assert.equal(res.status, 201, 'Actual status code is '+res.status)
        assert.equal(res.body.hmac_secret, hmac_secret, 'Actual hmac_secret is ' +res.body.hmac_secret)

        notification_requestBody.hmac_secret = common_utils.randString(``, 1024)
        hmac_secret = notification_requestBody.hmac_secret
        res = await requests.postNotification(par_app_id, notification_requestBody)
        assert.equal(res.status, 201, 'Actual status code is '+res.status)
        assert.equal(res.body.hmac_secret, hmac_secret, 'Actual hmac_secret is ' +res.body.hmac_secret)
    })

    after(async function () {
        await requests.delApplications(par_app_id, par_requestBody)
    })
})