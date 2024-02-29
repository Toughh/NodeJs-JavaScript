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

    it('Add to Testrail: POST > Applications defaults> Validate that applications defaults are not created without default_name', async function () {
        const applicationDefaultsBody = {
            default_value: 'test_value'
        }
        const expectedErrorMessage = {
            developer_message: 'Default name is empty.',
            element_name: 'ValidationResult',
            error_code: 'APPDF002',
            user_message: 'Default name is empty.'
        }
        const response = await requests.postApplicationsDefaults(applicationDefaultsBody, appId)
        assert.equal(response.statusCode, 400)
        assert.include(response.body.errors[0], expectedErrorMessage)
    })

    it('C29923: Create application default with empty body> Validate 400 Bad Request is returned', async function () {
        const applicationDefaultsBody = {}
        const expectedErrorMessage = {
            developer_message: 'Default name is empty.',
            element_name: 'ValidationResult',
            error_code: 'APPDF002',
            user_message: 'Default name is empty.'
        }
        const response = await requests.postApplicationsDefaults(applicationDefaultsBody, appId)
        assert.equal(response.statusCode, 400)
        assert.include(response.body.errors[0], expectedErrorMessage)
    })

    it('C29925: Create application default with empty `default_name` > Validate 400 Bad Request is returned', async function () {
        const applicationDefaultsBody = {
            default_name: '',
            default_value: 'test_value'
        }
        const expectedErrorMessage = {
            developer_message: 'Default name is empty.',
            element_name: 'ValidationResult',
            error_code: 'APPDF002',
            user_message: 'Default name is empty.'
        }
        const response = await requests.postApplicationsDefaults(applicationDefaultsBody, appId)
        assert.equal(response.statusCode, 400)
        assert.include(response.body.errors[0], expectedErrorMessage)
    })

    it('C29924: Create application defaults with invalid `default_name` > Validate 400 Bad Request is returned', async function () {
        const expectedErrorMessage = {
            developer_message: 'Not allowed default name.',
            element_name: 'ResultCode',
            error_code: 'APPDF001',
            user_message: 'Not allowed default name.'
        }
        const applicationDefaultsBody = createApplicationDefaultsBody({ defaultName: 'test_name' })
        const response = await requests.postApplicationsDefaults(applicationDefaultsBody, appId)
        assert.equal(response.statusCode, 400)
        assert.include(response.body.errors[0], expectedErrorMessage)
    })

    it('C29926: Create application defaults with empty `default_value` > Validate 400 Bad Request is returned', async function () {
        const applicationDefaultsBody = {
            default_name: 'send_options',
            default_value: ''
        }
        const expectedErrorMessage = {
            developer_message: 'Default value is empty.',
            element_name: 'ValidationResult',
            error_code: 'APPDF003',
            user_message: 'Default value is empty.'
        }
        const response = await requests.postApplicationsDefaults(applicationDefaultsBody, appId)
        assert.equal(response.statusCode, 400)
        assert.include(response.body.errors[0], expectedErrorMessage)
    })

    it('C30077: Create application defaults without `default_value` > Validate 400 Bad Request is returned', async function () {
        const applicationDefaultsBody = {
            default_name: 'send_options'
        }
        const expectedErrorMessage = {
            developer_message: 'Default value is empty.',
            element_name: 'ValidationResult',
            error_code: 'APPDF003',
            user_message: 'Default value is empty.'
        }
        const response = await requests.postApplicationsDefaults(applicationDefaultsBody, appId)
        assert.equal(response.statusCode, 400)
        assert.include(response.body.errors[0], expectedErrorMessage)
    })

    it('C29956: Create application defaults with already existing `default_name` > Validate 400 Bad Request is returned', async function () {
        const expectedErrorMessage = {
            developer_message: 'Gateway application default is already exist.',
            element_name: 'ResultCode',
            error_code: 'APPDF005',
            user_message: 'Gateway application default is already exist.'
        }
        const applicationDefaultsBody = createApplicationDefaultsBody()
        await requests.postApplicationsDefaults(applicationDefaultsBody, appId)
        const response = await requests.postApplicationsDefaults(applicationDefaultsBody, appId)
        assert.equal(response.statusCode, 400)
        assert.include(response.body.errors[0], expectedErrorMessage)
    })

    it('C29927: Create application defaults using non-existing app-id > Validate 400 Bad Request is returned', async function () {
        const expectedErrorMessage = {
            developer_message: 'No applications found.',
            element_name: 'ValidationResult',
            error_code: 'APP012',
            user_message: 'No applications found.'
        }
        const applicationDefaultsBody = createApplicationDefaultsBody()
        const response = await requests.postApplicationsDefaults(applicationDefaultsBody, 'not_existing_app_id')
        assert.equal(response.statusCode, 400)
        assert.include(response.body.errors[0], expectedErrorMessage)
    })

    after('Clearing test data: removing application', async function () {
        await requests.delApplications(appId)
    })
})
