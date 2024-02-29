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

describe('PATCH /applications/defaults/names/id (-) - Verify response *end-to-end*', function () {
    this.timeout(timeout)
    let applicationsDefaultsNames, updated_description, id
    let res

    before(async function () {
        try {
            applicationsDefaultsNames = applicationsDefaultsNamesPayload.postApplicationsDefaultsNames()

            res = await requests.postApplicationsDefaultsNames(applicationsDefaultsNames)
            id = res.body.id

            updated_description = ""

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C26998: PATCH user default name > Update user default name with empty ‘description’ > Validate 400 Bad Request is returned *regression* *smoke*', async function () {
        delete applicationsDefaultsNames.defaults_name
        applicationsDefaultsNames.description = updated_description
        res = await requests.patchApplicationsDefaultsNamesId(applicationsDefaultsNames, id)
        assert.equal(res.status, 400, 'Actual status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'DFN001', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ValidationResult', 'Actual element_name is ' + res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'Defaults name description is empty.', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Defaults name description is empty.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C26999: PATCH user default name > Update user default name using not existing id > Validate 404 Not Found is returned *regression*', async function () {
        delete applicationsDefaultsNames.defaults_name
        applicationsDefaultsNames.description = common_utils.randString('Test ', 20)
        res = await requests.patchApplicationsDefaultsNamesId(applicationsDefaultsNames, '000')
        assert.equal(res.status, 404, 'Actual status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'DFN002', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ValidationResult', 'Actual element_name is ' + res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'Defaults name does not exist for Id provided.', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Defaults name does not exist for Id provided.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C27000: PATCH user default name > Update user default name not sending body > Validate 400 Bad Request is returned *regression*', async function () {
        res = await requests.patchApplicationsDefaultsNamesId(``, id)
        assert.equal(res.status, 400, 'Actual status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'GEN013', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'Request body not readable or missing', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Invalid request.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    after(async function () {
        await requests.deleteApplicationsDefaultsNamesId(id)
    })
})