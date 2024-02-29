/**
 * Import required packages
 */
require('mocha')
const config = require('config')
const assert = require('chai').assert

const requests = require('../../../common/setup/request')
const applicationsPayload = require('../../../common/datasource/createApplication')
const { createApplicationDefaultsBody } = require('../../../common/datasource/createApplicationDefaults')

const timeout = config.get('timeout')

describe('Application Defaults Management > POST application defaults - Verify response *end-to-end*', function () {
    this.timeout(timeout)
    let appId

    before('Preparing test data: application', async function () {
        const requestBody = applicationsPayload.postApplications()
        const response = await requests.postApplications(requestBody)
        appId = response.body.app_id
        console.log('app_id is ' + appId)
        assert.equal(response.status, 201, 'Application was not created successfully')
    })

    afterEach('Clearing test data: removing application defaults', async function () {
        await requests.delApplicationsDefaults(appId, 'send_options')
    })

    it('C29922: Create application defaults > Validate application defaults are created with sending only required fields', async function () {
        const applicationDefaultsBody = createApplicationDefaultsBody()
        const response = await requests.postApplicationsDefaults(applicationDefaultsBody, appId)
        assert.equal(response.statusCode, 201)
        const applicationDefaultsBodyToCompare = createApplicationDefaultsBody()
        assert.include(response.body, applicationDefaultsBody)
        assert.include(response.body, { enabled: true })
    })

    it('C29955: Create application defaults > Validate application defaults are created with sending all fields', async function () {
        const applicationDefaultsBody = createApplicationDefaultsBody({ enabled: false })
        const response = await requests.postApplicationsDefaults(applicationDefaultsBody, appId)
        assert.equal(response.statusCode, 201)
        assert.deepEqual(response.body, applicationDefaultsBody)
    })

    after('Clearing test data: removing application', async function () {
        await requests.delApplications(appId)
    })
})
