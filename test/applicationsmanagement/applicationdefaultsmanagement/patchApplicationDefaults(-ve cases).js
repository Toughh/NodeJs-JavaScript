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
    const updatedDefaultValue = 'updated_value'

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
        await requests.delApplicationsDefaults(appId, defaultName)
    })

    it('C29935: Update application defaults with empty `default_value` > Validate 400 Bad Request is returned', async function () {
        const expectedErrorMessage = {
            developer_message: 'Default value is empty.',
            element_name: 'ValidationResult',
            error_code: 'APPDF003',
            user_message: 'Default value is empty.'
        }

        const editApplicationDefaultsBody = updateApplicationDefaultsBody({ defaultValue: '' })
        const response = await requests.updateApplicationsDefaults(appId, defaultName, editApplicationDefaultsBody)
        assert.equal(response.statusCode, 400)
        assert.include(response.body.errors[0],  expectedErrorMessage)
    })

    it('C29973: Update application defaults with not existing default name> Validate 400 Bad Request is returned', async function () {
        const expectedErrorMessage = {
            developer_message: 'Gateway application default does not exist for this application id and default name.',
            element_name: 'ResultCode',
            error_code: 'APPDF004',
            user_message: 'Gateway application default does not exist for this application id and default name.'
        }

        const editApplicationDefaultsBody = updateApplicationDefaultsBody({ defaultValue: updatedDefaultValue})
        const response = await requests.updateApplicationsDefaults(appId, 'non-existing', editApplicationDefaultsBody)
        assert.equal(response.statusCode, 400)
        assert.include(response.body.errors[0], expectedErrorMessage)
    })

    it('C29974: Update application defaults with invalid app-id> Validate 400 Bad Request is returned', async function () {
        const expectedErrorMessage = {
            developer_message: 'No applications found.',
            element_name: 'ValidationResult',
            error_code: 'APP012',
            user_message: 'No applications found.'
        }

        const editApplicationDefaultsBody = updateApplicationDefaultsBody({ defaultValue: updatedDefaultValue})
        const response = await requests.updateApplicationsDefaults('non-existing', defaultName, editApplicationDefaultsBody)
        assert.equal(response.statusCode, 400)
        assert.include(response.body.errors[0], expectedErrorMessage)
    })

    it('C29975: Update application defaults with invalid body> Validate 400 Bad Request is returned', async function () {
        const expectedErrorMessage = {
            "error_code": "GEN013",
            "developer_message": "Request body not readable or missing: Unrecognized field \"default\" (class com.j2.core.api.model.request.DefaultValueUpdateRequest), not marked as ignorable",
            "user_message": "Invalid request."
        }

        const editApplicationDefaultsBody = {
            default: 'default'
        }
        const response = await requests.updateApplicationsDefaults(appId, defaultName, editApplicationDefaultsBody)
        assert.equal(response.statusCode, 400)
        assert.include(response.body.errors[0], expectedErrorMessage)
    })

    after('Clearing test data: removing application', async function () {
        await requests.delApplications(appId)
    })
})
