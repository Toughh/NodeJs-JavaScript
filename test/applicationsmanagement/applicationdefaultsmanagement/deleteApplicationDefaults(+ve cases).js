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
    console.log("app_id is " + appId)
    assert.equal(response.status, 201, 'Application was not created successfully')

    const applicationDefaultsBody = createApplicationDefaultsBody({ defaultName })
    await requests.postApplicationsDefaults(applicationDefaultsBody, appId)
  })

  it('C29936: Delete application defaults > Validate application defaults could be deleted from app id', async function () {
    const delResp = await requests.delApplicationDefaults(appId, defaultName)
    assert.equal(delResp.status, 204, `Actual statusCode is ${delResp.status}`)

    const getResp = await requests.getApplicationsDefaultsByDefaultName(appId, defaultName)
    assert.equal(getResp.status, 400, `Actual statusCode is ${getResp.status}`)
  })

  after('Clearing test data: removing application', async function () {
    await requests.delApplications(appId)
  })
})
