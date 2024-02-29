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

describe('GET /applications/defaults/names (+) - Verify response *end-to-end*', function () {
    this.timeout(timeout)
    let applicationsDefaultsNames, defaults_name, description, id
    let res

    before(async function () {
        try {
            applicationsDefaultsNames = applicationsDefaultsNamesPayload.postApplicationsDefaultsNames()
            defaults_name = applicationsDefaultsNames.defaults_name
            description = applicationsDefaultsNames.description

            res = await requests.postApplicationsDefaultsNames(applicationsDefaultsNames)
            id = res.body.id

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C26996: GET all user default name > Validate all User Default names are returned *regression* *smoke*', async function () {
        res = await requests.getApplicationsDefaultsNames()
        assert.equal(res.status, 200, 'Actual status is ' + res.status)
        try {
            for (i = 0; i < res.body.length; i++) {
                assert.exists(res.body[i].defaults_name, 'defaults_name not exist')
                assert.exists(res.body[i].description, 'description not exist')
                assert.exists(res.body[i].id, 'id not exist')
            }
        } catch (e) { console.log(e) }
    })

    after(async function () {
        await requests.deleteApplicationsDefaultsNamesId(id)
    })
})