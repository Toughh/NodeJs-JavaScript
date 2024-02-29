/**
 * Import required packages
 */
require('mocha')
require('../../common/util/testrail-util')

var config = require('config')
var headerUtils = require('http-headers-validation')
var assert = require('chai').assert
const chai = require('chai')
chai.use(require('chai-uuid'))

const requests = require('../../common/setup/request')
const response = require('../../common/setup/response')
const applicationsPayload = require('../../common/datasource/createApplication')
const applicationSecretPayload = require('../../common/datasource/createApplicationSecrets')

const timeout = config.get('timeout')

describe('POST /applications (+) *end-to-end*', function () {
    this.timeout(timeout)
    let par_group_name, child_group_name
    let par_app_requestBody, child_app_requestBody, par_app_requestBody_with_router, child_app_requestBody_with_router
    let par_app_id, child_app_id, par_app_id_with_router, child_app_id_with_router
    let admin_id = config.get('admin.corp_id')
    let res_par, res_child

    before(async function () {
        try {
            par_group_name = "My Account\\Avijit Test Automation"
            par_app_requestBody = applicationsPayload.postApplications(admin_id, par_group_name)

            child_group_name = "My Account\\Avijit Test Automation\\Child Group Test"
            child_app_requestBody = applicationsPayload.postApplications(admin_id, child_group_name)

            par_app_requestBody_with_router = applicationsPayload.postApplications(admin_id, par_group_name)
            delete par_app_requestBody_with_router.status
            par_app_requestBody_with_router.type = "ROUTER"

            child_app_requestBody_with_router = applicationsPayload.postApplications(admin_id, child_group_name)
            delete child_app_requestBody_with_router.status
            child_app_requestBody_with_router.type = "ROUTER"

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C28036: POST > Applications - Validate response if parent group_name is passed along with other required fields *smoke*', async function () {
        res_par = await requests.postApplications(par_app_requestBody)
        // var res = res_par.get(headerUtils.validateHeaderValue('Vary', 'Origin,Access-Control-Request-Method,Access-Control-Request-Headers'))
        
        par_app_id = res_par.body.app_id
        console.log("Parent app_id is " + par_app_id)
        assert.isString(par_app_id, 'app_id is not string type')
        assert.equal(res_par.body.app_name, 'faxqa123', 'Actual app_name is ' + res_par.body.app_name)
        assert.equal(res_par.body.group_name, 'My Account\\Avijit Test Automation', 'Actual group_name is ' + res_par.body.group_name)
        assert.equal(res_par.body.status, 'A', 'Actual status is ' + res_par.body.group_name)
        //assert.equal(res_par.get(headerUtils.validateHeaderValue('Vary', 'Origin,Access-Control-Request-Method,Access-Control-Request-Headers'), 'Actual Vary is ' + res_par.get(headerUtils.validateHeaderValue('Vary')))
        //assert.equal(res_par.headers['content-type'], '', 'Not valid');
    })

    it('C5133: POST > Applications - Validate new application is created for an account', async function () {
        res_par = await requests.postApplications(par_app_requestBody)
        par_app_id = res_par.body.app_id
        console.log("Parent app_id is " + par_app_id)
        assert.isString(par_app_id, 'app_id is not string type')
    })

    it('C10143: POST > Applications > Application Management > Parent > Create New Application > Validate client secret is sent via ppusher url *smoke*', async function () {
        res_par = await requests.postApplications(par_app_requestBody)
        par_app_id = res_par.body.app_id
        console.log("Parent app_id is " + par_app_id)
        assert.isString(res_par.body.api_access_secret, 'Actual api_access_secret is ' + res_par.body.api_access_secret)
    })

    it('C28036: POST > Applications > Validate response if child group_name is passed along with other required fields', async function () {
        res_child = await requests.postApplications(child_app_requestBody)
        child_app_id = res_child.body.app_id
        console.log("Child app_id is " + child_app_id)
        assert.isString(child_app_id, 'app_id is not string type')
        assert.equal(res_child.body.app_name, 'faxqa123', 'Actual app_name is ' + res_child.body.app_name)
        assert.equal(res_child.body.group_name, 'My Account\\Avijit Test Automation\\Child Group Test', 'Actual group_name is ' + res_child.body.group_name)
        assert.equal(res_child.body.status, 'A', 'Actual status is ' + res_child.body.group_name)
    })

    it('C10143: POST > Applications > Application Management > Child > Create New Application > Validate client secret is sent via ppusher url', async function () {
        res_child = await requests.postApplications(child_app_requestBody)
        child_app_id = res_child.body.app_id
        console.log("Child app_id is " + child_app_id)
        assert.isString(res_child.body.api_access_secret, 'Actual api_access_secret is ' + res_child.body.api_access_secret)
    })

    it('C8726: POST > Applications > Parent Group > Validate inbound webhook created for app type ROUTER *smoke*', async function () {
        res_par_with_router = await requests.postApplications(par_app_requestBody_with_router)
        par_app_id_with_router = res_par_with_router.body.app_id
        console.log("Parent app_id with router is " + par_app_id_with_router)
        assert.isString(par_app_id_with_router, 'app_id is not string type')
        assert.equal(res_par_with_router.body.app_name, 'faxqa123', 'Actual app_name is ' + res_par_with_router.body.app_name)
        assert.equal(res_par_with_router.body.group_name, 'My Account\\Avijit Test Automation', 'Actual group_name is ' + res_par_with_router.body.group_name)
        assert.equal(res_par_with_router.body.status, 'A', 'Actual status is ' + res_par_with_router.body.group_name)
    })

    it('C8726: POST > Applications > Child Group > Validate inbound webhook created for app type ROUTER', async function () {
        res_child_with_router = await requests.postApplications(child_app_requestBody_with_router)
        child_app_id_with_router = res_child_with_router.body.app_id
        console.log("Child app_id with router is " + child_app_id_with_router)
        assert.isString(child_app_id_with_router, 'app_id is not string type')
        assert.equal(res_child_with_router.body.app_name, 'faxqa123', 'Actual app_name is ' + res_child_with_router.body.app_name)
        assert.equal(res_child_with_router.body.group_name, 'My Account\\Avijit Test Automation\\Child Group Test', 'Actual group_name is ' + res_par_with_router.body.group_name)
        assert.equal(res_child_with_router.body.status, 'A', 'Actual status is ' + res_child_with_router.body.group_name)
    })

    it('C32057: POST > Applications > No region field in the body > Validate status code 201', async function () {
        res = await requests.postApplications(par_app_requestBody)
        assert.equal(res.status, 201, 'Actual status is ' + res.status)
        par_app_id = res.body.app_id
    })

    afterEach(async function () {
        res = await requests.delApplications(child_app_id, child_app_requestBody)
        res = await requests.delApplications(par_app_id, par_app_requestBody)
        
        res = await requests.delApplications(child_app_id_with_router, child_app_requestBody_with_router)
        res = await requests.delApplications(par_app_id_with_router, par_app_requestBody_with_router)
    })
})

describe('POST /applications/app_id/secrets - Validate API key enabled value *end-to-end*', function () {
    this.timeout(timeout)
    let group_name
    let appRequestBody, appSecretRequestBody
    let app_id
    let admin_id = config.get('admin.corp_id')
    let res

    before(async function () {
        try {
            group_name = "My Account\\Avijit Test Automation"
            appRequestBody = applicationsPayload.postApplications(admin_id, group_name)

            res = await requests.postApplications(appRequestBody)
            app_id = res.body.app_id
            console.log("app_id is " + app_id)

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C27722: POST > Applications > Secrets - Validate API key enabled is false on posting API key enabled set to false', async function () {
        appSecretRequestBody = applicationSecretPayload.postApplicationsSecrets(false)
        res = await requests.postApplicationsAppIdSecrets(app_id, appSecretRequestBody, admin_id)
        assert.equal(res.status, 201, 'Actual status is ' + res.status)
        assert.equal(res.body.enabled, false, 'Actual enabled boolean value is ' + res.body.enabled)
    })

    it('C27723: POST > Applications > Secrets - Validate API key enabled is true on posting API key enabled set to true', async function () {
        appSecretRequestBody = applicationSecretPayload.postApplicationsSecrets(true)
        res = await requests.postApplicationsAppIdSecrets(app_id, appSecretRequestBody, admin_id)
        assert.equal(res.status, 201, 'Actual status is ' + res.status)
        assert.equal(res.body.enabled, true, 'Actual enabled boolean value is ' + res.body.enabled)
    })

    it('C27724: POST > Applications > Secrets - Validate secret_id is in UUID format', async function () {
        appSecretRequestBody = applicationSecretPayload.postApplicationsSecrets(true)
        res = await requests.postApplicationsAppIdSecrets(app_id, appSecretRequestBody, admin_id)
        assert.equal(res.status, 201, 'Actual status is ' + res.status)
        assert.uuid(res.body.secret_id, 'v4')
    })

    it('C27725: POST > Applications > Secrets - Validate created field is in datetime format', async function () {
        appSecretRequestBody = applicationSecretPayload.postApplicationsSecrets(true)
        appSecretRequestBody.expiration = '2030-08-25T11:57:26.193-0000'
        res = await requests.postApplicationsAppIdSecrets(app_id, appSecretRequestBody, admin_id)
        assert.equal(res.status, 201, 'Actual status is ' + res.status)
        assert.isNotEmpty(res.body.created, 'created has no content')
    })

    it('C27726: POST > Applications > Secrets - Validate expiration field is in datetime format', async function () {
        appSecretRequestBody = applicationSecretPayload.postApplicationsSecrets(true)
        appSecretRequestBody.expiration = '2030-08-25T11:57:26.193-0000'
        res = await requests.postApplicationsAppIdSecrets(app_id, appSecretRequestBody, admin_id)
        assert.equal(res.status, 201, 'Actual status is ' + res.status)
        assert.isNotEmpty(res.body.expiration, 'expiration has no content')
    })

    it('C27735: POST > Applications > Secrets - Validate if by default, enabled value is true if not posting secret with no enabled field *smoke*', async function () {
        appSecretRequestBody = applicationSecretPayload.postApplicationsSecrets(true)
        delete appSecretRequestBody.enabled
        res = await requests.postApplicationsAppIdSecrets(app_id, appSecretRequestBody, admin_id)
        assert.equal(res.status, 201, 'Actual status is ' + res.status)
        assert.equal(res.body.enabled, true, 'Actual enabled boolean value is ' + res.body.enabled)
    })

    after(async function () {
        await requests.delApplications(app_id, appRequestBody)
    })
})

describe('POST /applications (US Region) - Validate API key enabled value *us*', function () {
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

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C30134: POST > Applications > Validate able to post application with passing US corp_id/admin_id and no region in the body', async function () {
        res = await requests.postApplications(app_requestBody)
        app_id = res.body.app_id
        console.log("app_id is " + app_id)
        assert.equal(res.status, 201, 'Actual status is '+res.status)
        assert.isString(app_id, 'app_id is not string type')
        assert.equal(res.body.app_name, 'faxqa123', 'Actual app_name is ' + res.body.app_name)
        assert.equal(res.body.group_name, 'My Account\\Avijit Test Automation', 'Actual group_name is ' + res.body.group_name)
        assert.equal(res.body.status, 'A', 'Actual status is ' + res.body.status)

    })

    after(async function () {
        await requests.delApplications(app_id, app_requestBody)
    })
})

describe('POST /applications - (CA Region) - Validate API key enabled value *ca*', function () {
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

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C30135: POST > Applications > Validate able to post application with passing CA corp_id/admin_id and no region in the body', async function () {
        res = await requests.postApplications(app_requestBody)
        app_id = res.body.app_id
        console.log("app_id is " + app_id)
        assert.equal(res.status, 201, 'Actual status is '+res.status)
        assert.isString(app_id, 'app_id is not string type')
        assert.equal(res.body.app_name, 'faxqa123', 'Actual app_name is ' + res.body.app_name)
        assert.equal(res.body.group_name, 'My Account\\Avijit Test Automation', 'Actual group_name is ' + res.body.group_name)
        assert.equal(res.body.status, 'A', 'Actual status is ' + res.body.status)

    })

    after(async function () {
        await requests.delApplications(app_id, app_requestBody)
    })
})

describe('POST /applications (EU Region) - Validate API key enabled value *eu*', function () {
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

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C30136: POST > Applications > Validate able to post application with passing EU corp_id/admin_id and no region in the body', async function () {
        res = await requests.postApplications(app_requestBody)
        app_id = res.body.app_id
        console.log("app_id is " + app_id)
        assert.equal(res.status, 201, 'Actual status is '+res.status)
        assert.isString(app_id, 'app_id is not string type')
        assert.equal(res.body.app_name, 'faxqa123', 'Actual app_name is ' + res.body.app_name)
        assert.equal(res.body.group_name, 'My Account\\Avijit Test Automation', 'Actual group_name is ' + res.body.group_name)
        assert.equal(res.body.status, 'A', 'Actual status is ' + res.body.status)

    })

    after(async function () {
        await requests.delApplications(app_id, app_requestBody)
    })
})

describe('POST /applications (AU Region) - Validate API key enabled value *au*', function () {
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

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C30137: POST > Applications > Validate able to post application with passing AU corp_id/admin_id and no region in the body', async function () {
        res = await requests.postApplications(app_requestBody)
        app_id = res.body.app_id
        console.log("app_id is " + app_id)
        assert.equal(res.status, 201, 'Actual status is '+res.status)
        assert.isString(app_id, 'app_id is not string type')
        assert.equal(res.body.app_name, 'faxqa123', 'Actual app_name is ' + res.body.app_name)
        assert.equal(res.body.group_name, 'My Account\\Avijit Test Automation', 'Actual group_name is ' + res.body.group_name)
        assert.equal(res.body.status, 'A', 'Actual status is ' + res.body.status)

    })

    after(async function () {
        await requests.delApplications(app_id, app_requestBody)
    })
})