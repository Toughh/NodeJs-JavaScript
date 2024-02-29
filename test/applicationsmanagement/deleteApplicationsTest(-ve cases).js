/**
 * Import required packages
 */
require('mocha')
require('../../common/util/testrail-util')

var config = require('config')
var assert = require('chai').assert

const requests = require('../../common/setup/request')
const applicationsPayload = require('../../common/datasource/createApplication')

const timeout = config.get('timeout')

describe('DELETE /applications (-) *smoke* *end-to-end*', function () {
    this.timeout(timeout)
    let group_name, app_id
    let app_requestBody
    let admin_id = config.get('admin.corp_id')
    let res

    before(async function () {
        try {
            group_name = "My Account\\Avijit Test Automation"
            app_requestBody = applicationsPayload.postApplications(admin_id, group_name)

            res = await requests.postApplications(app_requestBody)
            app_id = res.body.app_id
            console.log("app_id is " + app_id)
            
        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C5134: DELETE > Applications > Validate application is deleted for an account and numbers de authorized', async function () {
        res = await requests.delApplications(app_id, app_requestBody)
        assert.equal(res.status, 204, 'Actual status is '+res.status)
        assert.isEmpty(res.body, 'Actual response is ' + res.body)
    })

    afterEach(async function () {
        await requests.delApplications(app_id, app_requestBody)
    })
})