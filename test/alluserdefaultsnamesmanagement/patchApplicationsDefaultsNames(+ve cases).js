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

describe('PATCH /applications/defaults/names/id (+) - Verify response *end-to-end*', function () {
    this.timeout(timeout)
    let applicationsDefaultsNames, defaults_name, description, updated_description, id
    let res

    before(async function () {
        try {
            applicationsDefaultsNames = applicationsDefaultsNamesPayload.postApplicationsDefaultsNames()
            defaults_name = applicationsDefaultsNames.defaults_name
            description = applicationsDefaultsNames.description

            res = await requests.postApplicationsDefaultsNames(applicationsDefaultsNames)
            id = res.body.id

            updated_description = common_utils.randString('Test ', 20)

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C26997: PATCH user default name > Update user default name > Validate User Default Name is updated *regression* *smoke*', async function () {
        delete applicationsDefaultsNames.defaults_name
        applicationsDefaultsNames.description = updated_description
        res = await requests.patchApplicationsDefaultsNamesId(applicationsDefaultsNames, id)
        assert.equal(res.status, 200, 'Actual status is '+res.status)
        assert.equal(res.body.id, id, 'Actual id is '+res.body.id)
        assert.equal(res.body.defaults_name, defaults_name, 'Actual default_name is '+res.body.defaults_name)
        assert.equal(res.body.description, updated_description, 'Actual description is '+res.body.description)
    })

    after(async function () {
        await requests.deleteApplicationsDefaultsNamesId(id)
    })
})