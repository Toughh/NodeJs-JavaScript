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
const common_utils = require('../../common/util/commonUtils')

const timeout = config.get('timeout')

describe('Delete numbers (-) - Verify get users response *end-to-end*', function () {
    this.timeout(timeout)
    let group_name_int, group_name_ext
    let appRequestBody_int, appRequestBody_ext, user_requestBody, user_requestBody1
    let number_requestBody1, number_requestBody2, number_requestBody3, number_requestBody4, number_requestBody5, number_requestBody6
    let app_id_int, app_id_ext
    let admin_id = config.get('admin.corp_id')
    let userName = config.get('admin.username')
    let password = config.get('admin.password')
    let access_token
    let fax_number, fax_number1, fax_number2, fax_number3, customer_key1, customer_key2
    let res

    before(async function () {
        try {
            /* For internal numbers */

            group_name_int = "My Account\\Avijit Test Automation"
            appRequestBody_int = applicationsPayload.postApplications(admin_id, group_name_int)

            res = await requests.postApplications(appRequestBody_int)
            app_id_int = res.body.app_id
            console.log("app_id is " + app_id_int)

            user_requestBody = usersPayload.postUsers(app_id_int, group_name_int)
            user_requestBody.user.email_address = common_utils.randEmail()

            res = await requests.postUsers(user_requestBody, userName, admin_id)
            fax_number = res.body.fax_numbers[0].fax_number
            customer_key1 = res.body.fax_numbers[0].customer_key

            number_requestBody1 = numberPayload.postNumbers()
            res = await requests.postNumbers(number_requestBody1, userName)
            fax_number1 = res.body.numbers[0]

            number_requestBody2 = numberPayload.postNumbers()
            delete number_requestBody2.area_code
            number_requestBody2.fax_numbers = fax_number1

            number_requestBody3 = numberPayload.postNumbers()
            delete number_requestBody3.quantity
            delete number_requestBody3.area_code
            number_requestBody3.fax_numbers = fax_number

            /* For external numbers */

            group_name_ext = "My Account\\Avijit Test Automation\\Child Group Test"
            appRequestBody_ext = applicationsPayload.postApplications(admin_id, group_name_ext)

            res = await requests.postOauthToken(userName, password)
            access_token = res.body.access_token

            res = await requests.postApplicationsExt(appRequestBody_ext, access_token, userName)
            app_id_ext = res.body.app_id
            console.log("app_id is " + app_id_ext)

            user_requestBody1 = usersPayload.postUsers(app_id_ext, group_name_ext)
            user_requestBody1.user.email_address = common_utils.randEmail()

            res = await requests.postUsers(user_requestBody1, userName, admin_id)
            fax_number2 = res.body.fax_numbers[0].fax_number
            customer_key2 = res.body.fax_numbers[0].customer_key

            number_requestBody4 = numberPayload.postNumbers()
            res = await requests.postNumbers(number_requestBody4, userName)
            fax_number3 = res.body.numbers[0]

            number_requestBody5 = numberPayload.postNumbers()
            delete number_requestBody5.area_code
            number_requestBody5.fax_numbers = fax_number3

            number_requestBody6 = numberPayload.postNumbers()
            delete number_requestBody6.quantity
            delete number_requestBody6.area_code
            number_requestBody6.fax_numbers = fax_number2

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C20049: Delete > Numbers > External > Validate that error message should be displayed if we delete unassigned fax number along with quantity *smoke*', async function () {
        res = await requests.deleteNumbersExt(number_requestBody5, access_token)
        assert.equal(res.status, 400, 'Actual status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'NUM013', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ValidationResult', 'Actual element_name is '+res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'Invalid request. Please specify either a quantity of DiDs or specific DiDs to return.', 'Actual developer_message is '+res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Invalid request. Please specify either a quantity of DiDs or specific DiDs to return.', 'Actual user_message is '+res.body.errors[0].user_message)
    })

    it('C31117: Delete > Numbers > Internal > Validate that error message should be displayed if we delete unassigned fax number along with quantity *smoke*', async function () {
        res = await requests.deleteNumbers(number_requestBody2)
        assert.equal(res.status, 400, 'Actual status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'NUM013', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ValidationResult', 'Actual element_name is '+res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'Invalid request. Please specify either a quantity of DiDs or specific DiDs to return.', 'Actual developer_message is '+res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Invalid request. Please specify either a quantity of DiDs or specific DiDs to return.', 'Actual user_message is '+res.body.errors[0].user_message)
    })

    it('C20050: Delete > Numbers > External > Validate that error message should be displayed for already deleted unassigned numbers', async function () {
        res = await requests.deleteNumbersExt(number_requestBody6, access_token)
        assert.equal(res.status, 200, 'Actual status is '+res.status)
        assert.equal(res.body.quantity, 0, 'Actual quantity is '+res.body.quantity)
        assert.equal(res.body.errors[0].error_message, 'Number does not belong to your account.', 'Actual error_message is '+res.body.errors[0].error_message)
        assert.equal(res.body.errors[0].number, fax_number2, 'Actual number is '+res.body.errors[0].number)
    })

    it('C31118: Delete > Numbers > Internal > Validate that error message should be displayed for already deleted unassigned numbers', async function () {
        res = await requests.deleteNumbers(number_requestBody3)
        assert.equal(res.status, 200, 'Actual status is '+res.status)
        assert.equal(res.body.quantity, 0, 'Actual quantity is '+res.body.quantity)
        assert.equal(res.body.errors[0].error_message, 'Number does not belong to your account.', 'Actual error_message is '+res.body.errors[0].error_message)
        assert.equal(res.body.errors[0].number, fax_number, 'Actual number is '+res.body.errors[0].number)
    })

    it('C23213: Delete > Numbers > Validate that error message displayed for missing variable in URL path', async function () {
        res = await requests.deleteNumbersFaxNumber(``)
        assert.equal(res.status, 400, 'Actual status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'GEN013', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, 'Request body not readable or missing', 'Actual developer_message is '+res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Invalid request.', 'Actual user_message is '+res.body.errors[0].user_message)
    })

    after(async function () {
        await requests.delApplicationsExt(app_id_ext, appRequestBody_ext, access_token)
        await requests.delApplications(app_id_int, appRequestBody_int)
    })
})