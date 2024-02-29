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

describe('DELETE /applications/defaults/names/id (+) - Verify response *end-to-end*', function () {
    this.timeout(timeout)
    let applicationsDefaultsNames, id
    let res

    before(async function () {
        try {
            applicationsDefaultsNames = applicationsDefaultsNamesPayload.postApplicationsDefaultsNames()

            res = await requests.postApplicationsDefaultsNames(applicationsDefaultsNames)
            id = res.body.id

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C27001: DELETE user default name > Validate user default name could be deleted *regression* *smoke*', async function () {
        res = await requests.deleteApplicationsDefaultsNamesId(id)
        assert.equal(res.status, 204, 'Actual status is '+res.status)
    })
})