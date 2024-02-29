/**
 * Import required packages
 */
require('mocha')
require('../../common/util/testrail-util')

var config = require('config')
var assert = require('chai').assert

const requests = require('../../common/setup/request')
const applicationsDefaultsNamesPayload = require('../../common/datasource/createApplication')
const common_utils = require('../../common/util/commonUtils')

const timeout = config.get('timeout')

describe('POST /applications/default/names (-) - Verify response *end-to-end*', function () {
    this.timeout(timeout)
    let applicationsDefaultsNames
    let id
    let res

    before(async function () {
        applicationsDefaultsNames = applicationsDefaultsNamesPayload.postApplicationsDefaultsNames()
    })

    it('C27747: POST user default name >  Validate no duplicate default name can be created *regression* *smoke*', async function () {
        res = await requests.postApplicationsDefaultsNames(applicationsDefaultsNames)
        assert.equal(res.status, 201, 'Actual status is '+res.status)
        id = res.body.id
        res = await requests.postApplicationsDefaultsNames(applicationsDefaultsNames)
        assert.equal(res.status, 400, 'Actual status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'DFN003', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ValidationResult', 'Actual element_name is ' + res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'Defaults name already exists.', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Defaults name already exists.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C26992: POST user default name > default name with empty default_name > Validate 400 Bad Request is returned *regression*', async function () {
        res = await requests.postApplicationsDefaultsNames(applicationsDefaultsNames)
        assert.equal(res.status, 400, 'Actual status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'DFN003', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ValidationResult', 'Actual element_name is ' + res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'Defaults name already exists.', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Defaults name already exists.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C26993: POST user default name > default name with empty description > Validate 400 Bad Request is returned *regression*', async function () {
        applicationsDefaultsNames.defaults_name = ""
        res = await requests.postApplicationsDefaultsNames(applicationsDefaultsNames)
        assert.equal(res.status, 400, 'Actual status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'APIUDF002', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ValidationResult', 'Actual element_name is ' + res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'Default name is empty.', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Default name is empty.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C26994: POST user default name > default name with already existing default_name > Validate 400 Bad Request is returned *regression*', async function () {
        applicationsDefaultsNames.defaults_name = common_utils.randString('Test ', 20)
        applicationsDefaultsNames.description = ""
        res = await requests.postApplicationsDefaultsNames(applicationsDefaultsNames)
        assert.equal(res.status, 400, 'Actual status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'DFN001', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ValidationResult', 'Actual element_name is ' + res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'Defaults name description is empty.', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Defaults name description is empty.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C26995: POST user default name > user default name not sending body > Validate 400 Bad Request is returned *regression*', async function () {
        res = await requests.postApplicationsDefaultsNames(``)
        assert.equal(res.status, 400, 'Actual status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'GEN013', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'Request body not readable or missing', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Invalid request.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    after(async function () {
        await requests.deleteApplicationsDefaultsNamesId(id)
    })
})