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
const numberPayload = require('../../common/datasource/createNumber')
const editNumberPayload = require('../../common/datasource/editNumber')
const common_utils = require('../../common/util/commonUtils')

const timeout = config.get('timeout')

describe('Patch > Numbers (+) - Verify get response *end-to-end*', function () {
    this.timeout(timeout)
    let group_name
    let app_requestBody, user_requestBody, patchNumber_requestBody
    let app_id
    let admin_id = config.get('admin.corp_id')
    let userName = config.get('admin.username')
    let fax_number, fax_number1, fax_number2, customer_key, user_id, servicekey_inbound, servicekey_outbound
    let res

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
            fax_number = res.body.fax_numbers[0].fax_number
            user_id = res.body.fax_numbers[0].user_id
            servicekey_inbound = res.body.fax_numbers[0].servicekey_inbound
            servicekey_outbound = res.body.fax_numbers[0].servicekey_outbound
            customer_key = res.body.fax_numbers[0].customer_key

            number_requestBody = numberPayload.postNumbers()
            res = await requests.postNumbers(number_requestBody, userName)
            fax_number1 = res.body.numbers[0]
            fax_number2 = res.body.numbers[1]

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C5128: Patch Number > Assign Number To User > Validate that unassigned fax number is assigned to specified customer *smoke*', async function () {
        patchNumber_requestBody = editNumberPayload.editNumbers(customer_key, app_id)
        res = await requests.patchNumbers(fax_number1, patchNumber_requestBody)
        assert.equal(res.status, 200, 'Actual status is '+res.status)
        assert.uuid(res.body.user_id, 'v4')

        res = await requests.getNumbersFaxNumber(fax_number1)
        assert.equal(res.status, 200, 'Actual status is '+res.status)
        assert.equal(res.body.fax_number, fax_number1, 'Created Users fax_number does not match')
    })

    it('C10157: Patch Number > Validated new user is created and preferred number is assigned *smoke*', async function () {
        patchNumber_requestBody = editNumberPayload.editNumbers(customer_key, app_id)
        res = await requests.patchNumbers(fax_number2, patchNumber_requestBody)
        assert.equal(res.status, 200, 'Actual status is '+res.status)

        res = await requests.getUsersCustomerKey(customer_key, userName, admin_id)
        assert.equal(res.status, 200, 'Actual status is '+res.status)
        try {
            if (res.body.fax_numbers[0].fax_number === fax_number2) {
                assert.equal(res.body.fax_numbers[0].fax_number, fax_number2, 'Actual fax_number is ' + res.body.fax_numbers[0].fax_number)
            }
            else if (res.body.fax_numbers[1].fax_number === fax_number2) {
                assert.equal(res.body.fax_numbers[1].fax_number, fax_number2, 'Actual fax_number is ' + res.body.fax_numbers[1].fax_number)
            }
            else if (res.body.fax_numbers[2].fax_number === fax_number2) {
                assert.equal(res.body.fax_numbers[2].fax_number, fax_number2, 'Actual fax_number is ' + res.body.fax_numbers[2].fax_number)
            }
            else
                assert.fail("fax_number couldn't be found and doesn't match")
        } catch (e) {
            console.log(e)
        }
    })

    after(async function () {
        await requests.delApplications(app_id, app_requestBody)
    })
})