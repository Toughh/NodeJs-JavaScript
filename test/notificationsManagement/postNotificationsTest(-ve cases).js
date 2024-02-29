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

describe('POST notifications (-) - Verify response *end-to-end*', function () {
    this.timeout(timeout)
    let par_group_name
    let par_requestBody
    let par_app_id
    let admin_id = config.get('admin.corp_id')
    let notification_requestBody
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

    it('C24309: POST Notifications > Validate invalid event_types is not allowed *smoke*', async function () {
        notification_requestBody = notificationPayload.postNotification('OUTBOUND', 'WEBHOOK', 'Invalid')
        res = await requests.postNotification(par_app_id, notification_requestBody)
        assert.equal(res.status, 400, 'Actual status code is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'NOT012', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ValidationResult', 'Actual element_name is '+res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, "Invalid event type value. Allowed values: [FAX_PEEK_PAGE, FAX_PEEK_FAX].", 'Actual error_code is '+res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Invalid event type value. Allowed values: [FAX_PEEK_PAGE, FAX_PEEK_FAX].', 'Actual user_message is '+res.body.errors[0].user_message)
    })

    it('C24364: POST Notifications > External > Validate invalid event_types is not allowed *smoke*', async function () {
        notification_requestBody = notificationPayload.postNotification('OUTBOUND', 'WEBHOOK', 'Invalid')
        res = await requests.postNotificationExt(par_app_id, notification_requestBody)
        assert.equal(res.status, 400, 'Actual status code is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'NOT012', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ValidationResult', 'Actual element_name is '+res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, "Invalid event type value. Allowed values: [FAX_PEEK_PAGE, FAX_PEEK_FAX].", 'Actual error_code is '+res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Invalid event type value. Allowed values: [FAX_PEEK_PAGE, FAX_PEEK_FAX].', 'Actual user_message is '+res.body.errors[0].user_message)
    })

    it('C24310: POST Notifications > Validate error if exceeding post max notification', async function () {
        this.timeout(90000)
        notification_requestBody = notificationPayload.postNotification('OUTBOUND', 'WEBHOOK', 'FAX_PEEK_PAGE')
        try {
            for (i = 1; i <= 15; i++) {
                res = await requests.postNotification(par_app_id, notification_requestBody)
                assert.equal(res.status, 201, 'Actual status code is ' + res.status)
            }
        } catch (e) { console.log(e) }
        try {
            for (i = 1; i <= 16; i++) {
                res = await requests.postNotification(par_app_id, notification_requestBody)
            }
        } catch (e) { console.log(e) }
        
        assert.equal(res.status, 400, 'Actual status code is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'NOT013', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ValidationResult', 'Actual element_name is ' + res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'Number of notification configs reached the limit of 15.', 'Actual error_code is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Number of notification configs reached the limit of 15.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C24365: POST Notifications > External > Validate maximum 15 active configs is allowed', async function () {
        this.timeout(100000)
        notification_requestBody = notificationPayload.postNotification('OUTBOUND', 'WEBHOOK', 'FAX_PEEK_PAGE')
        try {
            for (i = 1; i <= 15; i++) {
                res = await requests.postNotificationExt(par_app_id, notification_requestBody)
                assert.equal(res.status, 201, 'Actual status code is ' + res.status)
            }
        } catch (e) { console.log(e) }
        try {
            for (i = 1; i <= 16; i++) {
                res = await requests.postNotificationExt(par_app_id, notification_requestBody)
            }
        } catch (e) { console.log(e) }
        
        assert.equal(res.status, 400, 'Actual status code is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'NOT013', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ValidationResult', 'Actual element_name is ' + res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'Number of notification configs reached the limit of 15.', 'Actual error_code is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Number of notification configs reached the limit of 15.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C32467: POST Notifications > Validate allowed secret_key length is within 32-1024 characters *smoke*', async function () {
        notification_requestBody = notificationPayload.postNotification('INBOUND', 'FAX_CONFIRM', 'FAX_PEEK_PAGE')
        notification_requestBody.hmac_secret = common_utils.randString(``, 31)
        res = await requests.postNotification(par_app_id, notification_requestBody)
        assert.equal(res.status, 400, 'Actual status code is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'NOT014', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ValidationResult', 'Actual element_name is '+res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'Secret key length must be between [32, 1024].', 'Actual error_code is '+res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Invalid secret key length.', 'Actual user_message is '+res.body.errors[0].user_message)
    
        notification_requestBody.hmac_secret = common_utils.randString(``, 1025)
        res = await requests.postNotification(par_app_id, notification_requestBody)
        assert.equal(res.status, 400, 'Actual status code is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'NOT014', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ValidationResult', 'Actual element_name is '+res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'Secret key length must be between [32, 1024].', 'Actual error_code is '+res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Invalid secret key length.', 'Actual user_message is '+res.body.errors[0].user_message)
    })

    it('C36784: Post > Notifications > Validate error while post notifications with invalid content type', async function () {
        notification_requestBody = notificationPayload.postNotification('OUTBOUND', 'WEBHOOK', 'FAX_PEEK_PAGE')
        res = await requests.postNotificationWithInvalidContentType(par_app_id, notification_requestBody)
        assert.equal(res.status, 400, 'Actual status code is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'GEN013', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, "Content type 'applications/json;charset=UTF-8' not supported", 'Actual error_code is '+res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Invalid request.', 'Actual user_message is '+res.body.errors[0].user_message)
    })

    after(async function () {
        await requests.delApplications(par_app_id, par_requestBody)
    })
})