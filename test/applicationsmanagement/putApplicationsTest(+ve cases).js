/**
 * Import required packages
 */
require('mocha')
require('../../common/util/testrail-util')

var config = require('config')
var assert = require('chai').assert

const requests = require('../../common/setup/request')
const applicationsPayload = require('../../common/datasource/createApplication')
const usersPayload = require('../../common/datasource/createUser')
const { createApplicationDefaultsBody } = require('../../common/datasource/createApplicationDefaults')
const notificationPayload = require('../../common/datasource/createNotification')
const applicationSecretPayload = require('../../common/datasource/createApplicationSecrets')
const applicationRefresh = require('../../common/datasource/putApplicationsRefresh')

const common_utils = require('../../common/util/commonUtils')

const timeout = config.get('timeout')

describe('Put /applications (+) *end-to-end*', function () {
    
    this.timeout(1000000)
    let group_name
    let app_requestBody, user_requestBody, applicationdefaults_requestBody, notification_requestBody
    let app_id, user_id, secret_id, notification_id, customer_key, fax_number
    let admin_id = config.get('admin.corp_id')
    let userName = config.get('admin.username')
    let active_status = 'A', inactive_status = 'I'
    let direction = 'OUTBOUND'
    let type = 'WEBHOOK'
    let event_type = 'FAX_PEEK_PAGE'
    let defaultName = 'send_options'
    let res

    before(async function () {
        try {
            group_name = "My Account\\Avijit Test Automation"
            app_requestBody = applicationsPayload.postApplications(admin_id, group_name)

            res = await requests.postApplications(app_requestBody)
            app_id = res.body.app_id
            console.log("app_id is " + app_id)

            user_requestBody = usersPayload.postUsers(app_id, group_name)
            user_requestBody.user.email_address = common_utils.randEmail()

            applicationdefaults_requestBody = createApplicationDefaultsBody()

            notification_requestBody = notificationPayload.postNotification(direction, type, event_type)

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C34446: Put > Applications - Validate response if only have created applications', async function () {
        res = await requests.putApplicationsAppIdRefresh(app_id)
        assert.equal(res.status, 200, 'Actual status is ' + res.status)
        secret_id = res.body.synced_secrets[0].secret_id
        const applications = JSON.stringify(applicationRefresh.applications(app_id, active_status, secret_id, true))
        assert.include(JSON.stringify(res.body), applications, 'Actual response is ' + JSON.stringify(res.body))
    })

    it('C36614: Put > Applications - Validate response if created one user for applications *smoke*', async function () {
        res = await requests.postUsers(user_requestBody, userName, admin_id)
        assert.equal(res.status, 201, 'Actual status code is ' + res.status)
        user_id = res.body.fax_numbers[0].user_id
        customer_key = res.body.fax_numbers[0].customer_key
        fax_number = res.body.fax_numbers[0].fax_number

        res = await requests.putApplicationsAppIdRefresh(app_id)
        assert.equal(res.status, 200, 'Actual status is ' + res.status)
        secret_id = res.body.synced_secrets[0].secret_id
        const applicationsusers = JSON.stringify(applicationRefresh.applicationsusers(app_id, active_status, secret_id, true, user_id, active_status))
        assert.include(JSON.stringify(res.body), applicationsusers, 'Actual response is ' + JSON.stringify(res.body))
    })

    it('C36615: Put > Applications - Validate response if created application_defaults for applications with created users *smoke*', async function () {
        res = await requests.postApplicationsDefaults(applicationdefaults_requestBody, app_id)
        assert.equal(res.status, 201, 'Actual status is ' + res.status)

        res = await requests.putApplicationsAppIdRefresh(app_id)
        assert.equal(res.status, 200, 'Actual status is ' + res.status)
        secret_id = res.body.synced_secrets[0].secret_id
        const applicationsdefaultsusers = JSON.stringify(applicationRefresh.applicationsdefaultusers(app_id, active_status, secret_id, true, user_id, active_status, false, active_status))
        assert.equal(JSON.stringify(res.body), applicationsdefaultsusers, 'Actual response is ' + JSON.stringify(res.body))
    })

    it('C36616: Put > Applications - Validate response if created notifications for applications with applications_defaults and created users', async function () {
        res = await requests.postNotification(app_id, notification_requestBody)
        assert.equal(res.status, 201, 'Actual status is ' + res.status)
        notification_id = res.body.notification_id

        res = await requests.putApplicationsAppIdRefresh(app_id)
        assert.equal(res.status, 200, 'Actual status is ' + res.status)
        secret_id = res.body.synced_secrets[0].secret_id
        const applicationsdefaultsusersnotify = JSON.stringify(applicationRefresh.applicationsdefaultusersnotify(app_id, active_status, secret_id, true, user_id, active_status, false, active_status, notification_id, true, active_status))
        assert.equal(JSON.stringify(res.body), applicationsdefaultsusersnotify, 'Actual response is ' + JSON.stringify(res.body))
    })

    it('C36617: Put > Applications - Validate response if deleted notifications for applications with applications_defaults and created users *smoke*', async function () {
        res = await requests.deleteApplicationsNotifications(app_id, notification_id, notification_requestBody)
        assert.equal(res.status, 204, 'Actual status is ' + res.status)

        res = await requests.putApplicationsAppIdRefresh(app_id)
        assert.equal(res.status, 200, 'Actual status is ' + res.status)
        secret_id = res.body.synced_secrets[0].secret_id
        const applicationsdefaultsusersnotify = JSON.stringify(applicationRefresh.applicationsdefaultusersnotify(app_id, active_status, secret_id, true, user_id, active_status, false, active_status, notification_id, false, inactive_status))
        assert.include(JSON.stringify(res.body), applicationsdefaultsusersnotify, 'Actual response is ' + JSON.stringify(res.body))
    })

    it('C36618: Put > Applications - Validate response if deleted notifications and defaults for applications with created users', async function () {
        res = await requests.delApplicationDefaults(app_id, defaultName)
        assert.equal(res.status, 204, `Actual statusCode is ${res.status}`)

        res = await requests.putApplicationsAppIdRefresh(app_id)
        assert.equal(res.status, 200, 'Actual status is ' + res.status)
        secret_id = res.body.synced_secrets[0].secret_id
        const applicationsdefaultsusersnotify = JSON.stringify(applicationRefresh.applicationsdefaultusersnotify(app_id, active_status, secret_id, true, user_id, active_status, false, inactive_status, notification_id, false, inactive_status))
        assert.include(JSON.stringify(res.body), applicationsdefaultsusersnotify, 'Actual response is ' + JSON.stringify(res.body))
    })

    it('C36619: Put > Applications - Validate response if deleted notifications, defaults and users for applications', async function () {
        res = await requests.deleteNumbersFaxNumber(fax_number)
        assert.equal(res.status, 204, `Actual statusCode is ${res.status}`)

        res = await requests.deleteUsersCustomerId(customer_key, admin_id)
        assert.equal(res.status, 204, `Actual statusCode is ${res.status}`)

        res = await requests.putApplicationsAppIdRefresh(app_id)
        assert.equal(res.status, 200, 'Actual status is ' + res.status)
        secret_id = res.body.synced_secrets[0].secret_id
        const applicationsdefaultsusersnotify = JSON.stringify(applicationRefresh.applicationsdefaultusersnotify(app_id, active_status, secret_id, true, user_id, inactive_status, false, inactive_status, notification_id, false, inactive_status))
        assert.include(JSON.stringify(res.body), applicationsdefaultsusersnotify, 'Actual response is ' + JSON.stringify(res.body))
    })

    it('C36620: Put > Applications - Validate response if deleted notifications, defaults, users and applications', async function () {
        res = await requests.delApplications(app_id, app_requestBody)
        assert.equal(res.status, 204, `Actual statusCode is ${res.status}`)

        res = await requests.putApplicationsAppIdRefresh(app_id)
        assert.equal(res.status, 200, 'Actual status is ' + res.status)
        secret_id = res.body.synced_secrets[0].secret_id
        const applicationsdefaultsusersnotify = JSON.stringify(applicationRefresh.applicationsdefaultusersnotify(app_id, inactive_status, secret_id, false, user_id, inactive_status, false, inactive_status, notification_id, false, inactive_status))
        assert.include(JSON.stringify(res.body), applicationsdefaultsusersnotify, 'Actual response is ' + JSON.stringify(res.body))
    })

    after(async function () {
        res = await requests.delApplications(app_id, app_requestBody)
    })
})

describe('Put /applications (+) *end-to-end*', function () {
    this.timeout(timeout)
    let group_name1, group_name2
    let app_requestBody1, app_requestBody2, appSecretRequestBody1, appSecretRequestBody2
    let app_id1, app_id2, secret_id0, secret_id1
    let admin_id = config.get('admin.corp_id')
    let active_status = 'A', inactive_status = 'I'
    let res

    before(async function () {
        try {
            group_name1 = "My Account\\Avijit Test Automation"
            app_requestBody1 = applicationsPayload.postApplications(admin_id, group_name1)

            group_name2 = "My Account\\Avijit Test Automation\\Child Group Test"
            app_requestBody2 = applicationsPayload.postApplications(admin_id, group_name2)

            res = await requests.postApplications(app_requestBody1)
            app_id1 = res.body.app_id
            console.log("app_id1 is " + app_id1)

            res = await requests.postApplications(app_requestBody2)
            app_id2 = res.body.app_id
            console.log("app_id2 is " + app_id2)

            appSecretRequestBody1 = applicationSecretPayload.postApplicationsSecrets(false)
            appSecretRequestBody2 = applicationSecretPayload.postApplicationsSecrets(true)

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C36621: Put > Applications - Validate response if created applications with application_secrets enabled as false', async function () {
        res = await requests.postApplicationsAppIdSecrets(app_id1, appSecretRequestBody1, admin_id)
        assert.equal(res.status, 201, 'Actual status is ' + res.status)

        res = await requests.putApplicationsAppIdRefresh(app_id1)
        assert.equal(res.status, 200, 'Actual status is ' + res.status)
        secret_id0 = res.body.synced_secrets[0].secret_id
        secret_id1 = res.body.synced_secrets[1].secret_id
        const applicationswithtwosecrets = JSON.stringify(applicationRefresh.applicationswithtwosecrets(app_id1, active_status, secret_id0, true, secret_id1, active_status, false))
        assert.include(JSON.stringify(res.body), applicationswithtwosecrets, 'Actual response is ' + JSON.stringify(res.body))
    })

    it('C36622: Put > Applications - Validate response if application having default secrets but deleted created secrets having enabled as false', async function () {
        res = await requests.delApplicationsAppIdSecretsSecretId(app_id1, appSecretRequestBody1, secret_id1, admin_id)
        assert.equal(res.status, 204, 'Actual status is '+res.status)

        res = await requests.putApplicationsAppIdRefresh(app_id1)
        assert.equal(res.status, 200, 'Actual status is ' + res.status)
        const applicationswithtwosecrets = JSON.stringify(applicationRefresh.applicationswithtwosecrets(app_id1, active_status, secret_id0, true, secret_id1, inactive_status, false))
        assert.include(JSON.stringify(res.body), applicationswithtwosecrets, 'Actual response is ' + JSON.stringify(res.body))
    })

    it('C36623: Put > Applications - Validate response if application having default secrets and created secrets having enabled as false are deleted', async function () {
        res = await requests.delApplications(app_id1, app_requestBody1)
        assert.equal(res.status, 204, `Actual statusCode is ${res.status}`)

        res = await requests.putApplicationsAppIdRefresh(app_id1)
        assert.equal(res.status, 200, 'Actual status is ' + res.status)
        const applicationswithtwosecrets = JSON.stringify(applicationRefresh.applicationswithtwosecrets(app_id1, inactive_status, secret_id0, false, secret_id1, inactive_status, false))
        assert.include(JSON.stringify(res.body), applicationswithtwosecrets, 'Actual response is ' + JSON.stringify(res.body))
    })

    it('C36624: Put > Applications - Validate response if created applications with application_secrets enabled as true', async function () {
        res = await requests.postApplicationsAppIdSecrets(app_id2, appSecretRequestBody2, admin_id)
        assert.equal(res.status, 201, 'Actual status is ' + res.status)

        res = await requests.putApplicationsAppIdRefresh(app_id2)
        assert.equal(res.status, 200, 'Actual status is ' + res.status)
        secret_id0 = res.body.synced_secrets[0].secret_id
        secret_id1 = res.body.synced_secrets[1].secret_id
        const applicationswithtwosecrets = JSON.stringify(applicationRefresh.applicationswithtwosecrets(app_id2, active_status, secret_id0, true, secret_id1, active_status, true))
        assert.include(JSON.stringify(res.body), applicationswithtwosecrets, 'Actual response is ' + JSON.stringify(res.body))
    })

    it('C36625: Put > Applications - Validate response if application having default secrets but deleted created secrets having enabled as true', async function () {
        res = await requests.delApplicationsAppIdSecretsSecretId(app_id2, appSecretRequestBody2, secret_id1, admin_id)
        assert.equal(res.status, 204, 'Actual status is '+res.status)

        res = await requests.putApplicationsAppIdRefresh(app_id2)
        assert.equal(res.status, 200, 'Actual status is ' + res.status)
        const applicationswithtwosecrets = JSON.stringify(applicationRefresh.applicationswithtwosecrets(app_id2, active_status, secret_id0, true, secret_id1, inactive_status, true))
        assert.include(JSON.stringify(res.body), applicationswithtwosecrets, 'Actual response is ' + JSON.stringify(res.body))
    })

    it('C36626: Put > Applications - Validate response if application having default secrets and created secrets having enabled as true are deleted', async function () {
        res = await requests.delApplications(app_id2, app_requestBody2)
        assert.equal(res.status, 204, `Actual statusCode is ${res.status}`)

        res = await requests.putApplicationsAppIdRefresh(app_id2)
        assert.equal(res.status, 200, 'Actual status is ' + res.status)
        const applicationswithtwosecrets = JSON.stringify(applicationRefresh.applicationswithtwosecrets(app_id2, inactive_status, secret_id0, false, secret_id1, inactive_status, false))
        assert.include(JSON.stringify(res.body), applicationswithtwosecrets, 'Actual response is ' + JSON.stringify(res.body))
    })

    after(async function () {
        await requests.delApplications(app_id2, app_requestBody2)
        await requests.delApplications(app_id1, app_requestBody1)
    })
})

describe('Put /applications (+) with notifications *end-to-end*', function () {
    this.timeout(timeout)
    let group_name1, group_name2
    let app_requestBody1, app_requestBody2, notification_requestBody1, notification_requestBody2
    let app_id1, app_id2, secret_id0, notification_id
    let admin_id = config.get('admin.corp_id')
    let active_status = 'A', inactive_status = 'I'
    let direction = 'OUTBOUND'
    let type = 'WEBHOOK'
    let event_type = 'FAX_PEEK_PAGE'
    let res

    before(async function () {

        try {
            group_name1 = "My Account\\Avijit Test Automation"
            app_requestBody1 = applicationsPayload.postApplications(admin_id, group_name1)

            group_name2 = "My Account\\Avijit Test Automation\\Child Group Test"
            app_requestBody2 = applicationsPayload.postApplications(admin_id, group_name2)

            res = await requests.postApplications(app_requestBody1)
            app_id1 = res.body.app_id
            console.log("app_id1 is " + app_id1)

            res = await requests.postApplications(app_requestBody2)
            app_id2 = res.body.app_id
            console.log("app_id2 is " + app_id2)
            
            notification_requestBody1 = notificationPayload.postNotification(direction, type, event_type)
            notification_requestBody1.enabled = false

            notification_requestBody2 = notificationPayload.postNotification(direction, type, event_type)
            notification_requestBody2.enabled = true

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C36693: Put > Applications > app_id > refresh - Validate response if created applications with notifications enabled as false', async function () {
        res = await requests.postNotification(app_id1, notification_requestBody1)
        assert.equal(res.status, 201, 'Actual status is ' + res.status)
        notification_id = res.body.notification_id

        res = await requests.putApplicationsAppIdRefresh(app_id1)
        assert.equal(res.status, 200, 'Actual status is ' + res.status)
        secret_id0 = res.body.synced_secrets[0].secret_id
        const applicationsnotify = JSON.stringify(applicationRefresh.applicationsnotify(app_id1, active_status, secret_id0, true, notification_id, active_status, false))
        assert.include(JSON.stringify(res.body), applicationsnotify, 'Actual response is ' + JSON.stringify(res.body))
    })

    it('C36694: Put > Applications > app_id > refresh - Validate response if created applications with deleted notifications with enabled as false', async function () {
        res = await requests.deleteApplicationsNotifications(app_id1, notification_id, notification_requestBody1)
        assert.equal(res.status, 204, 'Actual status is ' + res.status)

        res = await requests.putApplicationsAppIdRefresh(app_id1)
        assert.equal(res.status, 200, 'Actual status is ' + res.status)
        secret_id0 = res.body.synced_secrets[0].secret_id
        const applicationsnotify = JSON.stringify(applicationRefresh.applicationsnotify(app_id1, active_status, secret_id0, true, notification_id, inactive_status, false))
        assert.include(JSON.stringify(res.body), applicationsnotify, 'Actual response is ' + JSON.stringify(res.body))
    })

    it('C36696: Put > Applications > app_id > refresh - Validate response if created applications with notifications enabled as true', async function () {
        res = await requests.postNotification(app_id2, notification_requestBody2)
        assert.equal(res.status, 201, 'Actual status is ' + res.status)
        notification_id = res.body.notification_id

        res = await requests.putApplicationsAppIdRefresh(app_id2)
        assert.equal(res.status, 200, 'Actual status is ' + res.status)
        secret_id0 = res.body.synced_secrets[0].secret_id
        const applicationsnotify = JSON.stringify(applicationRefresh.applicationsnotify(app_id2, active_status, secret_id0, true, notification_id, active_status, true))
        assert.include(JSON.stringify(res.body), applicationsnotify, 'Actual response is ' + JSON.stringify(res.body))
    })

    it('C36697: Put > Applications > app_id > refresh - Validate response if created applications with deleted notifications enabled as true', async function () {
        res = await requests.deleteApplicationsNotifications(app_id2, notification_id, notification_requestBody2)
        assert.equal(res.status, 204, 'Actual status is ' + res.status)

        res = await requests.putApplicationsAppIdRefresh(app_id2)
        assert.equal(res.status, 200, 'Actual status is ' + res.status)
        secret_id0 = res.body.synced_secrets[0].secret_id
        const applicationsnotify = JSON.stringify(applicationRefresh.applicationsnotify(app_id2, active_status, secret_id0, true, notification_id, inactive_status, false))
        assert.include(JSON.stringify(res.body), applicationsnotify, 'Actual response is ' + JSON.stringify(res.body))
    })

    after(async function () {
        await requests.delApplications(app_id2, app_requestBody2)
        await requests.delApplications(app_id1, app_requestBody1)
    })
})