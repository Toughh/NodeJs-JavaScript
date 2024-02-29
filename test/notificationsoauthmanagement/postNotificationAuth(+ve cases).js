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

describe('POST notifications Auth (+) - Verify response *end-to-end*', function () {
    this.timeout(timeout)
    let group_name
    let app_requestBody
    let app_id, notify_id
    let client_id, client_secret, token_endpoint, grant_type, scope, description
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
            client_id = notificationAuthRequestBody.client_id
            client_secret = notificationAuthRequestBody.client_secret
            token_endpoint = notificationAuthRequestBody.token_endpoint
            grant_type = notificationAuthRequestBody.grant_type
            scope = notificationAuthRequestBody.scope
            description = notificationAuthRequestBody.description

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C28042: POST Notifications auth > Validate new notification auth is created passing all params *smoke*', async function () {
        res = await requests.postApplicationsNotificationsAuth(app_id, notificationAuthRequestBody, notify_id)
        assert.equal(res.status, 201, 'Actual status is '+res.status)
        assert.equal(res.body.app_id, app_id, 'Generated app_id is not same as applications app_id')
        assert.uuid(res.body.auth_id, 'v4')
        assert.equal(res.body.client_id, client_id, 'Generated client_id is not same as notifications auth payload client_id')
        assert.equal(res.body.description, description, 'Generated description is not same as notifications auth payload description')
        assert.equal(res.body.enabled, true, 'Actual enabled boolean value is '+res.body.enabled)
        assert.equal(res.body.grant_type, grant_type, 'Generated grant_type is not same as notifications auth payload grant_type')
        assert.equal(res.body.notification_id, notify_id, 'Generated notification_id is not same as post notifications notification_id')
        assert.equal(res.body.scope, scope, 'Generated scope is not same as notifications auth payload scope')
        assert.equal(res.body.token_endpoint, token_endpoint, 'Generated token_endpoint is not same as notifications auth payload token_endpoint')
    })

    it('C28043: POST Notifications auth > Validate new notification auth is created passing only required params', async function () {
        delete notificationAuthRequestBody.scope
        delete notificationAuthRequestBody.description
        res = await requests.postApplicationsNotificationsAuth(app_id, notificationAuthRequestBody, notify_id)
        assert.equal(res.status, 201, 'Actual status is '+res.status)
        assert.equal(res.body.app_id, app_id, 'Generated app_id is not same as applications app_id')
        assert.uuid(res.body.auth_id, 'v4')
        assert.equal(res.body.client_id, client_id, 'Generated client_id is not same as notifications auth payload client_id')
        assert.notExists(res.body.description, 'description does not exist')
        assert.equal(res.body.enabled, true, 'Actual enabled boolean value is '+res.body.enabled)
        assert.equal(res.body.grant_type, grant_type, 'Generated grant_type is not same as notifications auth payload grant_type')
        assert.equal(res.body.notification_id, notify_id, 'Generated notification_id is not same as post notifications notification_id')
        assert.notExists(res.body.scope, 'scope does not exist')
        assert.equal(res.body.token_endpoint, token_endpoint, 'Generated token_endpoint is not same as notifications auth payload token_endpoint')
    })

    after(async function () {
        await requests.delApplications(app_id, app_requestBody)
    })
})