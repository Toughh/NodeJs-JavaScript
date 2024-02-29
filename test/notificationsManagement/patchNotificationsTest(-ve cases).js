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

describe('PATCH notifications (-) - Verify response *end-to-end*', function () {
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

    it('C32471: PATCH Notifications > Validate allowed secret_key length is within 32-1024 characters *smoke*', async function () {
        notification_requestBody = editNotificationPayload.patchNotification(false)
        notification_requestBody.hmac_secret = common_utils.randString('', 1025)
        res = await requests.patchNotification(par_app_id, notification_id, notification_requestBody)
        assert.equal(res.status, 400, 'Actual status code is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'NOT014', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ValidationResult', 'Actual element_name is ' + res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'Secret key length must be between [32, 1024].', 'Actual error_code is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Invalid secret key length.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    after(async function () {
        await requests.delApplications(par_app_id, par_requestBody)
    })
})