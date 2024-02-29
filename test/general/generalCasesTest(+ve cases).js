/**
 * Import required packages
 */
require('mocha')
require('../../common/util/testrail-util')

var config = require('config')
var assert = require('chai').assert

const requests = require('../../common/setup/request')
const common_utils = require('../../common/util/commonUtils')
const applicationsPayload = require('../../common/datasource/createApplication')
const usersPayload = require('../../common/datasource/createUser')

const timeout = config.get('timeout')

describe('GET Health (+) - Verify response *end-to-end*', function () {
    this.timeout(timeout)
    let res
    let group_name, app_id, fax_number
    let app_requestBody, user_requestBody
    let admin_id = config.get('admin.corp_id')
    let userName = config.get('admin.username')

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

    it('C5138: GET > Health -  Validate successful response with detailed info for internal end point *smoke*', async function () {
        res = await requests.getHealth(userName)
        assert.equal(res.status, 200, 'Actual status is '+res.status)
        assert.equal(res.body.db.status, 'UP', 'Actual db status is '+res.body.db.status)
        assert.equal(res.body.diskSpace.status, 'UP', 'Actual diskSpace status is '+res.body.diskSpace.status)
        assert.equal(res.body.j2Mail.status, 'UP', 'Actual j2Email status is '+res.body.j2Mail.status)
        assert.equal(res.body.memory.status, 'UP', 'Actual memory status is '+res.body.memory.status)
        assert.equal(res.body.ping.status, 'UP', 'Actual ping status is '+res.body.ping.status)
        assert.equal(res.body.refreshScope.status, 'UP', 'Actual refreshScope status is '+res.body.refreshScope.status)
        assert.equal(res.body.service.status, 'UP', 'Actual service status is '+res.body.service.status)
    })

    it('C7173: POST > Users > New User Creation > Validated zip code is not mandatory', async function () {
        user_requestBody = usersPayload.postUsers(app_id, group_name)
        user_requestBody.user.email_address = common_utils.randEmail()
        res = await requests.postUsers(user_requestBody, userName, admin_id)
        assert.equal(res.status, 201, 'Actual status is '+res.status)
        fax_number = res.body.fax_numbers[0].fax_number
    })

    it('C20601: GET > City > Validate Cities endpoint return response properly for passed area code', async function () {
        res = await requests.getCitiesAreaCode(310)
        assert.equal(res.status, 200, 'Actual status is '+res.status)
        for(i=0; i<res.body.length;i++) {
            assert.equal(res.body[i].country_iso_code, 'US', 'Actual country_iso_code is '+res.body[i].country_iso_code)
            assert.exists(res.body[i].city, 'city is not available')
        }
    })
    
    after(async function () {
        await requests.delApplications(app_id, app_requestBody)
    })
})