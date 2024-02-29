/**
 * Import required packages
 */
require('mocha')
require('../../common/util/testrail-util')

var config = require('config')
var assert = require('chai').assert

const requests = require('../../common/setup/request')
const applicationsPayload = require('../../common/datasource/createApplication')
const applicationSecretPayload = require('../../common/datasource/createApplicationSecrets')

const commonservice = require('../../common/setup/service')

const timeout = config.get('timeout')

describe('GET applications - Verify Notification Details NOT returned *end-to-end*', function () {
    this.timeout(timeout)
    let par_group_name, child_group_name
    let par_app_requestBody, child_app_requestBody
    let par_app_id, child_app_id
    let admin_id = config.get('admin.corp_id')
    let res_par, res_child, res

    before(async function () {
        try {
            par_group_name = "My Account\\Avijit Test Automation"
            par_app_requestBody = applicationsPayload.postApplications(admin_id, par_group_name)

            res_par = await requests.postApplications(par_app_requestBody)
            par_app_id = res_par.body.app_id
            console.log("Parent app_id is " + par_app_id)

            child_group_name = "My Account\\Avijit Test Automation\\Child Group Test"
            child_app_requestBody = applicationsPayload.postApplications(admin_id, child_group_name)

            res_child = await requests.postApplications(child_app_requestBody)
            child_app_id = res_child.body.app_id
            console.log("Child app_id is " + child_app_id)

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C5137: GET > Applications > Parent Group > Validate that notification details is not returned in the application info', async function () {
        res = await requests.getApplications(par_app_id)
        assert.isString(par_app_id, 'app_id is not string type')
        assert.equal(res.body.app_name, 'faxqa123', 'Actual app_name is ' + res.body.app_name)
        assert.equal(res.body.group_name, 'My Account\\Avijit Test Automation', 'Actual group_name is ' + res.body.group_name)
        assert.equal(res.body.status, 'A', 'Actual status is ' + res.body.group_name)
        assert.isBelow(commonservice.resArrayLength(res.body.notifications), 1, 'Actual notifications count are ' + commonservice.resArrayLength(res.body.notifications) + ' in length')
    })

    it('C5137: GET > Applications > Child Group > Validate that notification details is not returned in the application info', async function () {
        res = await requests.getApplications(child_app_id)
        assert.isString(child_app_id, 'app_id is not string type')
        assert.equal(res.body.app_name, 'faxqa123', 'Actual app_name is ' + res.body.app_name)
        assert.equal(res.body.group_name, 'My Account\\Avijit Test Automation\\Child Group Test', 'Actual group_name is ' + res.body.group_name)
        assert.equal(res.body.status, 'A', 'Actual status is ' + res.body.group_name)
        assert.isBelow(commonservice.resArrayLength(res.body.notifications), 1, 'Actual notifications count are ' + commonservice.resArrayLength(res.body.notifications) + ' in length')
    })

    after(async function () {
        await requests.delApplications(child_app_id, child_app_requestBody)
        await requests.delApplications(par_app_id, par_app_requestBody)
    })
})

describe('GET applications - Verify Notification Details returned *end-to-end*', function () {
    this.timeout(timeout)
    let par_group_name, child_group_name
    let par_app_requestBody_with_router, child_app_requestBody_with_router
    let par_app_id_with_router, child_app_id_with_router
    let admin_id = config.get('admin.corp_id')
    let res

    before(async function () {
        try {
            par_group_name = "My Account\\Avijit Test Automation"
            child_group_name = "My Account\\Avijit Test Automation\\Child Group Test"

            par_app_requestBody_with_router = applicationsPayload.postApplications(admin_id, par_group_name)
            delete par_app_requestBody_with_router.status
            par_app_requestBody_with_router.type = "ROUTER"

            res_par_with_router = await requests.postApplications(par_app_requestBody_with_router)
            par_app_id_with_router = res_par_with_router.body.app_id
            console.log("Parent app_id with router is " + par_app_id_with_router)

            child_app_requestBody_with_router = applicationsPayload.postApplications(admin_id, child_group_name)
            delete child_app_requestBody_with_router.status
            child_app_requestBody_with_router.type = "ROUTER"

            res_child_with_router = await requests.postApplications(child_app_requestBody_with_router)
            child_app_id_with_router = res_child_with_router.body.app_id
            console.log("Child app_id with router is " + child_app_id_with_router)

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C11039: GET > Applications > Validate outbound notification details in the application info *smoke*', async function () {
        res = await requests.getApplications(par_app_id_with_router)
        assert.isString(par_app_id_with_router, 'app_id is not string type')
        assert.equal(res.body.app_name, 'faxqa123', 'Actual app_name is ' + res.body.app_name)
        assert.equal(res.body.group_name, 'My Account\\Avijit Test Automation', 'Actual group_name is ' + res.body.group_name)
        assert.equal(res.body.status, 'A', 'Actual status is ' + res.body.group_name)
        assert.isAbove(commonservice.resArrayLength(res.body.notifications), 0, 'Actual notifications count are ' + commonservice.resArrayLength(res.body.notifications) + ' in length')
    })

    it('C11040: GET > Applications > Validate inbound notification details in the application info *smoke*', async function () {
        res = await requests.getApplications(par_app_id_with_router)
        assert.equal(res.status, 200, 'Actual status is '+res.status)
        assert.equal(res.body.notifications[0].app_id, par_app_id_with_router, 'Generated app_id is not same as par_app_id')
        assert.equal(res.body.notifications[0].direction, 'INBOUND', 'Actual direction is '+res.body.notifications[0].direction)
        assert.equal(res.body.notifications[0].enabled, true, 'Actual enabled boolean value is '+res.body.notifications[0].enabled)
        assert.uuid(res.body.notifications[0].notification_id, 'v4')
        assert.include(res.body.notifications[0].notify_destination, 'https://', 'Actual notification_destination is '+res.body.notifications[0].notify_destination)
        assert.equal(res.body.notifications[0].status, 'A', 'Actual status is '+res.body.notifications[0].status)
        assert.equal(res.body.notifications[0].type, 'EFAX_ROUTER', 'Actual event_type is '+res.body.notifications[0].type)
    })

    it('C11041: GET > Applications > Parent Group > Validate notification details return for type "ROUTER" of application *smoke*', async function () {
        res = await requests.getApplications(par_app_id_with_router)
        assert.isString(par_app_id_with_router, 'app_id is not string type')
        assert.equal(res.body.app_name, 'faxqa123', 'Actual app_name is ' + res.body.app_name)
        assert.equal(res.body.group_name, 'My Account\\Avijit Test Automation', 'Actual group_name is ' + res.body.group_name)
        assert.equal(res.body.status, 'A', 'Actual status is ' + res.body.group_name)
        assert.isAbove(commonservice.resArrayLength(res.body.notifications), 0, 'Actual notifications count are ' + commonservice.resArrayLength(res.body.notifications) + ' in length')
    })

    it('C11041: GET > Applications > Child Group > Validate notification details return for type "ROUTER" of application', async function () {
        res = await requests.getApplications(child_app_id_with_router)
        assert.isString(child_app_id_with_router, 'app_id is not string type')
        assert.equal(res.body.app_name, 'faxqa123', 'Actual app_name is ' + res.body.app_name)
        assert.equal(res.body.group_name, 'My Account\\Avijit Test Automation\\Child Group Test', 'Actual group_name is ' + res.body.group_name)
        assert.equal(res.body.status, 'A', 'Actual status is ' + res.body.group_name)
        assert.isAbove(commonservice.resArrayLength(res.body.notifications), 0, 'Actual notifications count are ' + commonservice.resArrayLength(res.body.notifications) + ' in length')
    })

    after(async function () {
        await requests.delApplications(child_app_id_with_router, child_app_requestBody_with_router)
        await requests.delApplications(par_app_id_with_router, par_app_requestBody_with_router)
    })
})

describe('GET applications - Verify List of Applications *end-to-end*', function () {
    this.timeout(timeout)
    let res

    it('C5925: GET > Applications > Existing applications > Validate list of Fax Services applications displayed', async function () {
        res = await requests.getApplications(``)
        assert.isString(res.body[0].app_id, 'app_id is not string type')
        assert.isAbove(commonservice.resArrayLength(res.body), 3000, 'Actual applications count are ' + commonservice.resArrayLength(res.body) + ' in length')
    })

    it('C7171: GET > Applications > Parent Group > Validate list of all applications returned for a reseller id', async function () {
        res = await requests.getApplications(``)
        assert.isString(res.body[0].app_id, 'app_id is not string type')
        assert.isAbove(commonservice.resArrayLength(res.body), 3000, 'Actual applications count are ' + commonservice.resArrayLength(res.body) + ' in length')
    })
})

describe('GET applications - Verify Notification Details *end-to-end*', function () {
    this.timeout(timeout)
    let par_group_name, child_group_name
    let par_app_requestBody_with_router, child_app_requestBody_with_router
    let par_app_id_with_router, child_app_id_with_router
    let admin_id = config.get('admin.corp_id')
    let res

    before(async function () {
        try {
            par_group_name = "My Account\\Avijit Test Automation"
            child_group_name = "My Account\\Avijit Test Automation\\Child Group Test"

            par_app_requestBody_with_router = applicationsPayload.postApplications(admin_id, par_group_name)
            delete par_app_requestBody_with_router.status
            par_app_requestBody_with_router.type = "ROUTER"

            res_par_with_router = await requests.postApplications(par_app_requestBody_with_router)
            par_app_id_with_router = res_par_with_router.body.app_id
            console.log("Parent app_id with router is " + par_app_id_with_router)

            child_app_requestBody_with_router = applicationsPayload.postApplications(admin_id, child_group_name)
            delete child_app_requestBody_with_router.status
            child_app_requestBody_with_router.type = "ROUTER"

            res_child_with_router = await requests.postApplications(child_app_requestBody_with_router)
            child_app_id_with_router = res_child_with_router.body.app_id
            console.log("Child app_id with router is " + child_app_id_with_router)

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C10785: GET > Applications > Parent Group > Validate notification details in the application info *smoke*', async function () {
        res = await requests.getApplications(par_app_id_with_router)
        assert.equal(res.body.notifications[0].app_id, par_app_id_with_router, 'Actual app_id is '+res.body.notifications[0].app_id)
        assert.equal(res.body.notifications[0].direction, 'INBOUND', 'Actual direction is '+res.body.notifications[0].direction)
        assert.equal(res.body.notifications[0].enabled, true, 'Actual enabled boolean value is '+res.body.notifications[0].enabled)
        assert.isString(res.body.notifications[0].notification_id, 'notification_id is not a string')
        assert.include(res.body.notifications[0].notify_destination, 'https://sqs.us-west-2.amazonaws.com', 'Actual notify_destination is '+res.body.notifications[0].notify_destination)
        assert.equal(res.body.notifications[0].status, 'A', 'Actual status is '+res.body.notifications[0].status)
        assert.equal(res.body.notifications[0].type, 'EFAX_ROUTER', 'Actual type is '+res.body.notifications[0].type)
    })

    it('C10785: GET > Applications > Child Group > Validate notification details in the application info', async function () {
        res = await requests.getApplications(child_app_id_with_router)
        assert.equal(res.body.notifications[0].app_id, child_app_id_with_router, 'Actual app_id is '+res.body.notifications[0].app_id)
        assert.equal(res.body.notifications[0].direction, 'INBOUND', 'Actual direction is '+res.body.notifications[0].direction)
        assert.equal(res.body.notifications[0].enabled, true, 'Actual enabled boolean value is '+res.body.notifications[0].enabled)
        assert.isString(res.body.notifications[0].notification_id, 'notification_id is not a string')
        assert.include(res.body.notifications[0].notify_destination, 'https://sqs.us-west-2.amazonaws.com/', 'Actual notify_destination is '+res.body.notifications[0].notify_destination)
        assert.equal(res.body.notifications[0].status, 'A', 'Actual status is '+res.body.notifications[0].status)
        assert.equal(res.body.notifications[0].type, 'EFAX_ROUTER', 'Actual type is '+res.body.notifications[0].type)
    })

    after(async function () {
        await requests.delApplications(child_app_id_with_router, child_app_requestBody_with_router)
        await requests.delApplications(par_app_id_with_router, par_app_requestBody_with_router)
    })
})

describe('GET /applications/app_id/secrets - Validate response *end-to-end*', function () {
    this.timeout(timeout)
    let group_name
    let app_requestBody, appSecret_requestBody
    let app_id, secret_id, enabled, description, expiration, created
    let admin_id = config.get('admin.corp_id')
    let res

    before(async function () {
        try {
            group_name = "My Account\\Avijit Test Automation"
            app_requestBody = applicationsPayload.postApplications(admin_id, group_name)

            res = await requests.postApplications(app_requestBody)
            app_id = res.body.app_id
            console.log("app_id is " + app_id)

            appSecret_requestBody = applicationSecretPayload.postApplicationsSecrets(true)
            appSecret_requestBody.expiration = '2027-05-10T04:51:32.705+0000'
            res = await requests.postApplicationsAppIdSecrets(app_id, appSecret_requestBody, admin_id)
            assert.equal(res.status, 201, 'Actual status is ' + res.status)
            secret_id = res.body.secret_id
            enabled = res.body.enabled
            description = res.body.description
            expiration = res.body.expiration
            created = res.body.created

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C27738: GET > Applications > Secrets - Validate if response is displayed corresponding to Post Application Secrets', async function () {
        res = await requests.getApplicationsAppIdSecretsSecretId(app_id, secret_id)
        assert.equal(res.status, 200, 'Actual status is ' + res.status)
        assert.equal(res.body.secret_id, secret_id, 'Actual enabled boolean value is ' + res.body.secret_id)
        assert.equal(res.body.enabled, enabled, 'Actual enabled boolean value is ' + res.body.enabled)
        assert.equal(res.body.description, description, 'Actual enabled boolean value is ' + res.body.description)
        assert.equal(res.body.expiration, expiration, 'Actual enabled boolean value is ' + res.body.expiration)
        assert.equal(res.body.created, created, 'Actual enabled boolean value is ' + res.body.created)
        assert.notExists(res.body.api_access_secret, 'api_access_secret does exist')
    })

    after(async function () {
        await requests.delApplications(app_id, app_requestBody)
    })
})

describe('GET /applications (AU Region) - Validate response *au*', function () {
    this.timeout(timeout)
    let group_name
    let app_requestBody
    let app_id
    let admin_id = config.get('admin.corp_id')
    let res

    before(async function () {
        try {
            group_name = "My Account\\Avijit Test Automation"
            app_requestBody = applicationsPayload.postApplications(admin_id, group_name)

            res = await requests.postApplications(app_requestBody)
            app_id = res.body.app_id
            console.log("app_id is " + app_id)

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C31119: GET > Applications > Validate notify_destination for post application with AU region *au*', async function () {
        res = await requests.getApplications(app_id)
        assert.equal(res.status, 200, 'Actual status is ' + res.status)
        assert.include(res.body.notifications[0].notify_destination, 'au', 'Actual notification_destination is ' + res.body.notifications[0].notify_destination)
    })

    after(async function () {
        await requests.delApplications(app_id, app_requestBody)
    })
})