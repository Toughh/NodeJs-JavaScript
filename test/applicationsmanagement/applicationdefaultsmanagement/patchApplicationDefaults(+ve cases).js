/**
 * Import required packages
 */
require('mocha')
const config = require('config')
const assert = require('chai').assert

const requests = require('../../../common/setup/request')
const applicationsPayload = require('../../../common/datasource/createApplication')
const { createApplicationDefaultsBody } = require('../../../common/datasource/createApplicationDefaults')
const { updateApplicationDefaultsBody } = require('../../../common/datasource/updateApplicationDefaults')

const timeout = config.get('timeout')

describe('Application Defaults Management > UPDATE application defaults - Verify response *end-to-end*', function () {
    this.timeout(timeout)
    let appId
    const defaultName = 'send_options'

    before('Preparing test data: application and application default', async function () {
        const requestBody = applicationsPayload.postApplications()
        const response = await requests.postApplications(requestBody)
        appId = response.body.app_id
        console.log('app_id is ' + appId)
        assert.equal(response.status, 201, 'Application was not created successfully')
    })

    beforeEach(async function (){
        const applicationDefaultsBody = createApplicationDefaultsBody()
        await requests.postApplicationsDefaults(applicationDefaultsBody, appId)
    })

    afterEach('Clearing test data: removing application defaults', async function () {
        await requests.delApplicationsDefaults(appId, 'send_options')
    })

    it('C29934: Update application default > Validate Application Default is updated', async function () {
        const updatedApplicationDefaultsBody = updateApplicationDefaultsBody({ defaultValue: 'updated_value', enabled: false })
        const response = await requests.updateApplicationsDefaults(appId, defaultName, updatedApplicationDefaultsBody)
        assert.equal(response.statusCode, 200)
        assert.include(response.body, { default_name: defaultName })
        assert.include(response.body, updatedApplicationDefaultsBody)
    })

    it('C29933: Update application defaults with only `default_value` field > Validate `default_value` field is updated', async function () {
        const updatedApplicationDefaultsBody = updateApplicationDefaultsBody({ defaultValue: 'updated_value' })
        const response = await requests.updateApplicationsDefaults(appId, defaultName, updatedApplicationDefaultsBody)
        assert.equal(response.statusCode, 200)
        assert.include(response.body, { default_name: defaultName })
        assert.include(response.body, updatedApplicationDefaultsBody)
    })

    it('C29938: Update application defaults with only `enabled` field > Validate `enabled` field is updated', async function () {
        const updatedApplicationDefaultsBody = updateApplicationDefaultsBody({ enabled: false })
        const response = await requests.updateApplicationsDefaults(appId, defaultName, updatedApplicationDefaultsBody)
        assert.equal(response.statusCode, 200)
        assert.include(response.body, { default_name: defaultName })
        assert.include(response.body, updatedApplicationDefaultsBody)
    })

    after('Clearing test data: removing application', async function () {
        await requests.delApplications(appId)
    })
})
