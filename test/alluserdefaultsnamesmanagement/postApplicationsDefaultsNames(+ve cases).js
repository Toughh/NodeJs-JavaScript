/**
 * Import required packages
 */
require('mocha')
require('../../common/util/testrail-util')

var config = require('config')
var assert = require('chai').assert

const requests = require('../../common/setup/request')
const applicationsDefaultsNamesPayload = require('../../common/datasource/createApplication')

const timeout = config.get('timeout')

describe('POST /applications/defaults/names (+) - Verify response *end-to-end*', function () {
    this.timeout(timeout)
    let applicationsDefaultsNames, defaults_name, description
    let id
    let res

    before(async function () {
        applicationsDefaultsNames = applicationsDefaultsNamesPayload.postApplicationsDefaultsNames()
        defaults_name = applicationsDefaultsNames.defaults_name
        description = applicationsDefaultsNames.description
    })

    it('C26991: POST user default name > Validate fax user default name is created *regression* *smoke*', async function () {
        res = await requests.postApplicationsDefaultsNames(applicationsDefaultsNames)
        assert.equal(res.status, 201, 'Actual status is '+res.status)
        id = res.body.id
        assert.exists(res.body.id, 'id does not exist')
        assert.equal(res.body.defaults_name, defaults_name, 'Actual default_name is '+res.body.defaults_name)
        assert.equal(res.body.description, description, 'Actual description is '+res.body.description)
    })

    after(async function () {
        await requests.deleteApplicationsDefaultsNamesId(id)
    })
})