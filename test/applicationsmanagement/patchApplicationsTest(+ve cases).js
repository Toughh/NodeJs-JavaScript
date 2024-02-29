/**
 * Import required packages
 */
require('mocha')
require('../../common/util/testrail-util')

var config = require('config')
var assert = require('chai').assert
const chai = require('chai')
chai.use(require('chai-uuid'))

const requests = require('../../common/setup/request')
const applicationsPayload = require('../../common/datasource/createApplication')

const common_utils = require('../../common/util/commonUtils')

const timeout = config.get('timeout')

describe('PATCH applications (+) - verify response *end-to-end*', function () {
    this.timeout(timeout)
    let group_name
    let updated_group_name, updated_app_name, updated_company_name, updated_calls_per_minute, updated_contact_email
    let app_requestBody, app_id
    let admin_id = config.get('admin.corp_id')
    let res

    beforeEach(async function () {
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

    it('C29397: PATCH > Applications - Validate user is able to modify the group_name *smoke*', async function () {
        app_requestBody.group_name = "My Account\\Avijit Test Automation\\Child Group Test"
        updated_group_name = app_requestBody.group_name
        res = await requests.patchApplications(app_id, app_requestBody, admin_id)
        assert.equal(res.status, 200, 'Actual status is '+res.status)
        assert.equal(res.body.group_name, updated_group_name, 'Actual group_name is ' + res.body.group_name)
    })

    it('C29515: PATCH > Applications - Validate no error if passing same group_name that has been posted originally while creating application', async function () {
        res = await requests.patchApplications(app_id, app_requestBody, admin_id)
        assert.equal(res.status, 200, 'Actual status is '+res.status)
        assert.equal(res.body.group_name, group_name, 'Actual group_name is ' + res.body.group_name)
    })

    it('C29516: PATCH > Applications - Validate user is able to modify any fields originally posted while creating application', async function () {
        app_requestBody.company_name = common_utils.randString('updated_company_name', 4)
        updated_company_name = app_requestBody.company_name
        res = await requests.patchApplications(app_id, app_requestBody, admin_id)
        assert.equal(res.status, 200, 'Actual status is '+res.status)
        assert.equal(res.body.company_name, updated_company_name, 'Actual company_name is ' + res.body.company_name)
    })

    it('C30102: PATCH > Applications - Validate app_name can be updated', async function () {
        app_requestBody.app_name = "qa"
        updated_app_name = app_requestBody.app_name
        res = await requests.patchApplications(app_id, app_requestBody, admin_id)
        assert.equal(res.status, 200, 'Actual status is '+res.status)
        assert.equal(res.body.app_name, updated_app_name, 'Actual app_name is ' + res.body.app_name)
    })

    it('C30103: PATCH > Applications - Validate company and calls_per_minute can be updated', async function () {
        app_requestBody.company_name = common_utils.randString('updated_company_name', 4)
        app_requestBody.calls_per_minute = 50
        updated_company_name = app_requestBody.company_name
        updated_calls_per_minute = app_requestBody.calls_per_minute

        res = await requests.patchApplications(app_id, app_requestBody, admin_id)
        assert.equal(res.status, 200, 'Actual status is '+res.status)
        assert.equal(res.body.company_name, updated_company_name, 'Actual company_name is ' + res.body.company_name)
        assert.equal(res.body.calls_per_minute, updated_calls_per_minute, 'Actual calls_per_minute is ' + res.body.calls_per_minute)
    })

    it('C30105: PATCH > Applications - Validate contact_email can be updated', async function () {
        app_requestBody.contact_email = "avijit.sannigrahi@j2.com"
        updated_contact_email = app_requestBody.contact_email

        res = await requests.patchApplications(app_id, app_requestBody, admin_id)
        assert.equal(res.status, 200, 'Actual status is '+res.status)
        assert.equal(res.body.contact_email, updated_contact_email, 'Actual contact_email is ' + res.body.contact_email)
    })

    it('C5136: PATCH > Applications - Validate edited changes are saved', async function () {
        app_requestBody.group_name = 'My Account\\Avijit Test Automation'
        app_requestBody.calls_per_minute = common_utils.randomNum(2, 4)
        updated_group_name = app_requestBody.group_name
        updated_calls_per_minute = app_requestBody.calls_per_minute

        res = await requests.patchApplications(app_id, app_requestBody, admin_id)
        assert.equal(res.status, 200, 'Actual status is '+res.status)
        assert.equal(res.body.group_name, updated_group_name, 'Actual contact_email is ' + res.body.group_name)
        assert.equal(res.body.calls_per_minute, updated_calls_per_minute, 'Actual contact_email is ' + res.body.calls_per_minute)
    })

    it('C30101: Patch Application > Validate able to update reseller_id', async function () {
        app_requestBody.reseller_id = config.get('data.reseller_id')
        res = await requests.patchApplications(app_id, app_requestBody, admin_id)
        assert.equal(res.status, 200, 'Actual Status is '+res.status)
        app_requestBody.reseller_id = admin_id
        res = await requests.patchApplications(app_id, app_requestBody, admin_id)
        assert.equal(res.status, 200, 'Actual Status is '+res.status)
    })

    afterEach(async function () {
        res = await requests.delApplications(app_id, app_requestBody)
        assert.equal(res.status, 204, 'Actual status is '+res.status)
    })
})