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

describe('Application Defaults Management > DELETE application defaults - Verify response *end-to-end*', function () {
  this.timeout(timeout)
  let appId
  const defaultName = 'send_options'

  before('Preparing test data: application and application default', async function () {
    const requestBody = applicationsPayload.postApplications()
    const response = await requests.postApplications(requestBody)
    appId = response.body.app_id
    console.log('app_id is ' + appId)
    assert.equal(response.status, 201, 'Application was not created successfully')

    const applicationDefaultsBody = createApplicationDefaultsBody({ defaultName })
    await requests.postApplicationsDefaults(applicationDefaultsBody, appId)
  })

  it('C29937: Delete application default using not existing default name > Validate 400 Bad Request is returned', async function () {
    const expectedErrorMessage = {
      developer_message: 'Gateway application default does not exist for this application id and default name.',
      element_name: 'ResultCode',
      error_code: 'APPDF004',
      user_message: 'Gateway application default does not exist for this application id and default name.'
    }

    const delResp = await requests.delApplicationDefaults(appId, 'not_existing_default_name')
    assert.equal(delResp.status, 400, `Actual statusCode is ${delResp.status}`)
    assert.include(delResp.body.errors[0], expectedErrorMessage)
  })

  it('C29939: Delete application defaults using invalid app-id > Validate 400 Bad Request is returned', async function () {
    const expectedErrorMessage = {
      developer_message: 'No applications found.',
      element_name: 'ValidationResult',
      error_code: 'APP012',
      user_message: 'No applications found.'
    }

    const delResp = await requests.delApplicationDefaults('not_existing_app_id', defaultName)
    assert.equal(delResp.status, 400, `Actual statusCode is ${delResp.status}`)
    assert.include(delResp.body.errors[0], expectedErrorMessage)
  })

  after('Clearing test data: removing application', async function () {
    await requests.delApplications(appId)
  })
})
