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

describe('Application Defaults Management > GET application defaults - Verify response *end-to-end*', function () {
    this.timeout(timeout)
    let appId
    let applicationDefaultsBody
    const defaultName = 'send_options'

    before('Preparing test data: application and application default', async function () {
        const requestBody = applicationsPayload.postApplications()
        const response = await requests.postApplications(requestBody)
        appId = response.body.app_id
        console.log('app_id is ' + appId)
        assert.equal(response.status, 201, 'Application was not created successfully')

        applicationDefaultsBody = createApplicationDefaultsBody({ defaultName })
        await requests.postApplicationsDefaults(applicationDefaultsBody, appId)
    })

    it('C29930: Get application defaults by default name > Validate Application Defaults is returned', async function () {
        const response = await requests.getApplicationsDefaultsByDefaultName(appId, defaultName)
        assert.equal(response.statusCode, 200)
        assert.include(response.body, applicationDefaultsBody)
    })

    after('Clearing test data: removing application', async function () {
        await requests.delApplications(appId)
    })
})
