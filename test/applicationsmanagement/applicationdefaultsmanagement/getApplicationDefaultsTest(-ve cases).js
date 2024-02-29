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

    before('Preparing test data: application and application default', async function () {
        const requestBody = applicationsPayload.postApplications()
        const response = await requests.postApplications(requestBody)
        appId = response.body.app_id
        console.log('app_id is ' + appId)
        assert.equal(response.status, 201, 'Application was not created successfully')

        const applicationDefaultsBody = createApplicationDefaultsBody()
        await requests.postApplicationsDefaults(applicationDefaultsBody, appId)
    })

    it('C29929: Get application defaults using non-existing app-id > Validate 400 Bad Request is returned', async function () {
        const expectedErrorMessage = {
            developer_message: 'No applications found.',
            element_name: 'ValidationResult',
            error_code: 'APP012',
            user_message: 'No applications found.'
        }

        const response = await requests.getApplicationsDefaults('not_existing_app_id')
        assert.equal(response.statusCode, 400)
        assert.include(response.body.errors[0], expectedErrorMessage)
    })

    after('Clearing test data: removing application', async function () {
        await requests.delApplications(appId)
    })
})
