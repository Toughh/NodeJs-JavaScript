/**
 * Import required packages
 */
require('mocha')
require('../../common/util/testrail-util')

var config = require('config')
var assert = require('chai').assert

const requests = require('../../common/setup/request')
const applicationsPayload = require('../../common/datasource/createApplication')
const usersPayload = require('../../common/datasource/createUser')
const common_utils = require('../../common/util/commonUtils')

const timeout = config.get('timeout')

describe('DELETE users (+ve) - Verify response *end-to-end*', function () {

    this.timeout(timeout)
    let group_name
    let app_requestBody, user_requestBody
    let app_id, customer_key, fax_number
    let admin_id = config.get('admin.corp_id')
    let userName = config.get('admin.username')

    before(async function () {
        try {
            group_name = "My Account\\Avijit Test Automation"
            app_requestBody = applicationsPayload.postApplications(admin_id, group_name)

            res = await requests.postApplications(app_requestBody)
            app_id = res.body.app_id
            console.log("app_id is " + app_id)

            user_requestBody = usersPayload.postUsers(app_id, group_name)
            user_requestBody.user.email_address = common_utils.randEmail()

            res = await requests.postUsers(user_requestBody, userName, admin_id)
            customer_key = res.body.fax_numbers[0].customer_key
            fax_number = res.body.fax_numbers[0].fax_number

            res = await requests.deleteNumbersFaxNumber(fax_number)

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C5122: DELETE > User > Not Assigned Number > Validate user is deleted *smoke*', async function () {
        res = await requests.deleteUsersCustomerId(customer_key, admin_id)
        assert.equal(res.status, 204, 'Actual status code is '+res.status)
    })

    after(async function () {
        await requests.delApplications(app_id, app_requestBody)
    })
})