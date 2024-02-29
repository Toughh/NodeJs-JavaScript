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
const commonService = require('../../common/setup/service')

const timeout = config.get('timeout')

describe('Delete numbers (+) - Verify get users response *end-to-end*', function () 
{
    this.timeout(timeout)
    let group_name_int, group_name_ext
    let appRequestBody_int, appRequestBody_ext
    let user_requestBody, user_requestBody1, user_requestBody2, user_requestBody3, user_requestBody4, user_requestBody5, user_requestBody6, user_requestBody7, user_requestBody8, user_requestBody9, user_requestBody10, user_requestBody11
    let number_requestBody1, number_requestBody2, number_requestBody3, number_requestBody4, number_requestBody5, number_requestBody6, number_requestBody7
    let app_id_int, app_id_ext
    let admin_id = config.get('admin.corp_id')
    let userName = config.get('admin.username')
    let password = config.get('admin.password')
    let access_token
    let fax_number, fax_number1, fax_number2, fax_number3, fax_number4, fax_number5, fax_number6, fax_number7, fax_number8, fax_number9, fax_number10, fax_number11, fax_number12, fax_number13
    let customer_key, customer_key1, customer_key2, customer_key3, customer_key4, customer_key5, customer_key6, customer_key7, customer_key8, customer_key9, customer_key10
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
            customer_key = res.body.fax_numbers[0].customer_key

            user_requestBody1 = usersPayload.postUsers(app_id_int, group_name_int)
            user_requestBody1.user.email_address = common_utils.randEmail()

            res = await requests.postUsers(user_requestBody1, userName, admin_id)
            fax_number1 = res.body.fax_numbers[0].fax_number
            customer_key2 = res.body.fax_numbers[0].customer_key

            user_requestBody2 = usersPayload.postUsers(app_id_int, group_name_int)
            user_requestBody2.user.email_address = common_utils.randEmail()

            res = await requests.postUsers(user_requestBody2, userName, admin_id)
            fax_number2 = res.body.fax_numbers[0].fax_number
            customer_key3 = res.body.fax_numbers[0].customer_key

            user_requestBody3 = usersPayload.postUsers(app_id_int, group_name_int)
            user_requestBody3.user.email_address = common_utils.randEmail()

            res = await requests.postUsers(user_requestBody3, userName, admin_id)
            fax_number3 = res.body.fax_numbers[0].fax_number
            customer_key4 = res.body.fax_numbers[0].customer_key

            user_requestBody4 = usersPayload.postUsers(app_id_int, group_name_int)
            user_requestBody4.user.email_address = common_utils.randEmail()

            res = await requests.postUsers(user_requestBody4, userName, admin_id)
            fax_number4 = res.body.fax_numbers[0].fax_number
            customer_key5 = res.body.fax_numbers[0].customer_key

            number_requestBody1 = numberPayload.postNumbers()
            number_requestBody1.region = 'US'

            user_requestBody5 = usersPayload.postUsers(app_id_int, group_name_int)
            user_requestBody5.user.email_address = common_utils.randEmail()

            res = await requests.postUsers(user_requestBody5, userName, admin_id)
            fax_number5 = res.body.fax_numbers[0].fax_number

            user_requestBody6 = usersPayload.postUsers(app_id_int, group_name_int)
            user_requestBody6.user.email_address = common_utils.randEmail()

            res = await requests.postUsers(user_requestBody6, userName, admin_id)
            fax_number6 = res.body.fax_numbers[0].fax_number

            number_requestBody3 = numberPayload.postNumbers()
            delete number_requestBody3.quantity
            delete number_requestBody3.area_code
            number_requestBody3.fax_numbers = +fax_number4 + ',' + fax_number5 + ',' + fax_number6
            console.log(number_requestBody3.fax_numbers)

            number_requestBody4 = numberPayload.postNumbers()
            delete number_requestBody4.quantity
            delete number_requestBody4.area_code
            number_requestBody4.fax_numbers = +fax_number4 + ',' + fax_number5 + ',' + fax_number6
            console.log(number_requestBody4.fax_numbers)

            /* For external numbers */

            group_name_ext = "My Account\\Avijit Test Automation\\Child Group Test"
            appRequestBody_ext = applicationsPayload.postApplications(admin_id, group_name_ext)

            res = await requests.postOauthToken(userName, password)
            assert.equal(res.status, 200, 'Actual status is ' + res.status)
            access_token = res.body.access_token

            res = await requests.postApplicationsExt(appRequestBody_ext, access_token, userName)
            app_id_ext = res.body.app_id
            console.log("app_id is " + app_id_ext)

            user_requestBody5 = usersPayload.postUsers(app_id_ext, group_name_ext)
            user_requestBody5.user.email_address = common_utils.randEmail()

            res = await requests.postUsers(user_requestBody5, userName, admin_id)
            fax_number7 = res.body.fax_numbers[0].fax_number
            customer_key6 = res.body.fax_numbers[0].customer_key

            user_requestBody6 = usersPayload.postUsers(app_id_ext, group_name_ext)
            user_requestBody6.user.email_address = common_utils.randEmail()

            res = await requests.postUsers(user_requestBody6, userName, admin_id)
            fax_number8 = res.body.fax_numbers[0].fax_number
            customer_key7 = res.body.fax_numbers[0].customer_key

            user_requestBody7 = usersPayload.postUsers(app_id_ext, group_name_ext)
            user_requestBody7.user.email_address = common_utils.randEmail()

            res = await requests.postUsers(user_requestBody7, userName, admin_id)
            fax_number9 = res.body.fax_numbers[0].fax_number
            customer_key8 = res.body.fax_numbers[0].customer_key

            user_requestBody8 = usersPayload.postUsers(app_id_ext, group_name_ext)
            user_requestBody8.user.email_address = common_utils.randEmail()

            res = await requests.postUsers(user_requestBody8, userName, admin_id)
            fax_number10 = res.body.fax_numbers[0].fax_number
            customer_key9 = res.body.fax_numbers[0].customer_key

            user_requestBody9 = usersPayload.postUsers(app_id_ext, group_name_ext)
            user_requestBody9.user.email_address = common_utils.randEmail()

            res = await requests.postUsers(user_requestBody9, userName, admin_id)
            fax_number11 = res.body.fax_numbers[0].fax_number
            customer_key10 = res.body.fax_numbers[0].customer_key

            number_requestBody5 = numberPayload.postNumbers()
            number_requestBody5.region = 'US'

            user_requestBody10 = usersPayload.postUsers(app_id_ext, group_name_ext)
            user_requestBody10.user.email_address = common_utils.randEmail()

            res = await requests.postUsers(user_requestBody10, userName, admin_id)
            fax_number12 = res.body.fax_numbers[0].fax_number

            user_requestBody11 = usersPayload.postUsers(app_id_ext, group_name_ext)
            user_requestBody11.user.email_address = common_utils.randEmail()

            res = await requests.postUsers(user_requestBody11, userName, admin_id)
            fax_number13 = res.body.fax_numbers[0].fax_number

            number_requestBody6 = numberPayload.postNumbers()
            delete number_requestBody6.quantity
            delete number_requestBody6.area_code
            number_requestBody6.fax_numbers = +fax_number11 + ',' + fax_number12 + ',' + fax_number13
            console.log(number_requestBody6.fax_numbers)

            number_requestBody7 = numberPayload.postNumbers()
            delete number_requestBody7.quantity
            delete number_requestBody7.area_code
            number_requestBody7.fax_numbers = +fax_number11 + ',' + fax_number12 + ',' + fax_number13
            console.log(number_requestBody7.fax_numbers)

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C5129: Delete > Numbers > External > Validate assigned numbers to user is deleted properly *smoke*', async function () {
        res = await requests.deleteNumbersFaxNumberExt(fax_number7, access_token)
        assert.equal(res.status, 204, 'Actual status is '+res.status)
        res = await requests.getUsersCustomerKey(customer_key6, userName, admin_id)
        assert.equal(res.status, 200, 'Actual status is '+res.status)
        assert.isBelow(commonService.resArrayLength(res.body.fax_numbers), 1, 'Actual fax_numbers are '+commonService.resArrayLength(res.body.fax_numbers) + ' in length')
    })

    it('C31112: Delete > Numbers > Internal > Validate assigned numbers to user is deleted properly *smoke*', async function () {
        res = await requests.deleteNumbersFaxNumber(fax_number)
        assert.equal(res.status, 204, 'Actual status is '+res.status)
        res = await requests.getUsersCustomerKey(customer_key, userName, admin_id)
        assert.equal(res.status, 200, 'Actual status is '+res.status)
        assert.isBelow(commonService.resArrayLength(res.body.fax_numbers), 1, 'Actual fax_numbers are '+commonService.resArrayLength(res.body.fax_numbers) + ' in length')
    })

    it('C19454: Delete > Numbers > External > Validate that requested single unassigned number is deleted properly from one reseller account', async function () {
        res = await requests.deleteNumbersFaxNumberExt(fax_number8, access_token)
        assert.equal(res.status, 204, 'Actual status is '+res.status)
    })

    it('C31113: Delete > Numbers > Internal > Validate that requested single unassigned number is deleted properly from one reseller account', async function () {
        res = await requests.deleteNumbersFaxNumber(fax_number1)
        assert.equal(res.status, 204, 'Actual status is '+res.status)
    })

    it('C19455: Delete > Numbers > External > Validate that requested multiple unassigned number is deleted properly from one reseller account', async function () {
        res = await requests.deleteNumbersFaxNumberExt(fax_number9, access_token)
        assert.equal(res.status, 204, 'Actual status is '+res.status)

        res = await requests.deleteNumbersFaxNumberExt(fax_number10, access_token)
        assert.equal(res.status, 204, 'Actual status is '+res.status)

        res = await requests.deleteNumbersFaxNumberExt(fax_number11, access_token)
        assert.equal(res.status, 204, 'Actual status is '+res.status)
    })

    it('C31114: Delete > Numbers > Internal > Validate that requested multiple unassigned number is deleted properly from one reseller account', async function () {
        res = await requests.deleteNumbersFaxNumber(fax_number2)
        assert.equal(res.status, 204, 'Actual status is '+res.status)

        res = await requests.deleteNumbersFaxNumber(fax_number3)
        assert.equal(res.status, 204, 'Actual status is '+res.status)

        res = await requests.deleteNumbersFaxNumber(fax_number4)
        assert.equal(res.status, 204, 'Actual status is '+res.status)
    })

    it('C20051: Delete > Numbers > External > Validate that requested unassigned fax number based on area code is deleted from reseller account', async function () {
        res = await requests.deleteNumbersExt(number_requestBody5, access_token)
        assert.equal(res.status, 200, 'Actual status is '+res.status)
        assert.equal(res.body.quantity, 2, 'Actual quantity is '+res.body.quantity)
        assert.isBelow(commonService.resArrayLength(res.body.numbers), 3, 'Actual numbers count are ' + commonService.resArrayLength(res.body.numbers) + ' in length')
    })

    it('C31115: Delete > Numbers > Internal > Validate that requested unassigned fax number based on area code is deleted from reseller account', async function () {
        res = await requests.deleteNumbers(number_requestBody1)
        assert.equal(res.status, 200, 'Actual status is '+res.status)
        assert.equal(res.body.quantity, 2, 'Actual quantity is '+res.body.quantity)
        assert.isBelow(commonService.resArrayLength(res.body.numbers), 3, 'Actual numbers count are ' + commonService.resArrayLength(res.body.numbers) + ' in length')
    })

    it('C31116: Delete > Numbers > Internal > Validate that fax number is deleted properly which is pending to delete from multiple passed fax number list', async function () {
        res = await requests.deleteNumbers(number_requestBody3)
        assert.equal(res.status, 200, 'Actual status is '+res.status)
        assert.equal(res.body.quantity, 1, 'Actual quantity is '+res.body.quantity)
        assert.equal(res.body.numbers[0], fax_number4, 'The number is not the assigned deleted fax_number')
        assert.equal(res.body.errors[0].number, fax_number5, 'The number is not the posting unassigned number')
        assert.equal(res.body.errors[0].error_message, 'Number does not belong to your account.', 'Actual error message is '+res.body.errors[0].error_message)
        assert.equal(res.body.errors[1].number, fax_number6, 'The number is not the posting unassigned number')
        assert.equal(res.body.errors[1].error_message, 'Number does not belong to your account.', 'Actual error message is '+res.body.errors[0].error_message)
    })

    it('C20093: Delete > Numbers > External > Validate that fax number is deleted properly which is pending to delete from multiple passed fax number list', async function () {
        res = await requests.deleteNumbersExt(number_requestBody6, access_token)
        assert.equal(res.status, 200, 'Actual status is '+res.status)
        assert.equal(res.body.quantity, 1, 'Actual quantity is '+res.body.quantity)
        assert.equal(res.body.numbers[0], fax_number11, 'The number is not the assigned deleted fax_number')
        assert.equal(res.body.errors[0].number, fax_number12, 'The number is not the posting unassigned number')
        assert.equal(res.body.errors[0].error_message, 'Number does not belong to your account.', 'Actual error message is '+res.body.errors[0].error_message)
        assert.equal(res.body.errors[1].number, fax_number13, 'The number is not the posting unassigned number')
        assert.equal(res.body.errors[1].error_message, 'Number does not belong to your account.', 'Actual error message is '+res.body.errors[0].error_message)
    })

    after(async function () {
        await requests.delApplicationsExt(app_id_ext, appRequestBody_ext, access_token)
        await requests.delApplications(app_id_int, appRequestBody_int)
    })
})

describe('Delete numbers (+) - Verify get users response *end-to-end*', function () 
{
    this.timeout(timeout)
    let group_name_int, app_id_int
    let appRequestBody_int, user_requestBody
    let admin_id = config.get('admin.corp_id')
    let userName = config.get('admin.username')
    let fax_number, fax_number1, customer_key
    let res

    before(async function () {
        try {
            group_name_int = "My Account\\Avijit Test Automation"
            appRequestBody_int = applicationsPayload.postApplications(admin_id, group_name_int)

            res = await requests.postApplications(appRequestBody_int)
            app_id_int = res.body.app_id
            console.log("app_id is " + app_id_int)

            user_requestBody = usersPayload.postUsers(app_id_int, group_name_int)
            user_requestBody.user.email_address = common_utils.randEmail()

            res = await requests.postUsers(user_requestBody, userName, admin_id)
            fax_number = res.body.fax_numbers[0].fax_number
            customer_key = res.body.fax_numbers[0].customer_key

            await requests.deleteNumbersFaxNumber(fax_number)

            user_requestBody = usersPayload.postUsers(app_id_int, group_name_int)
            user_requestBody.user.email_address = common_utils.randEmail()

            res = await requests.postUsers(user_requestBody, userName, admin_id)
            fax_number1 = res.body.fax_numbers[0].fax_number
            customer_key = res.body.fax_numbers[0].customer_key

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C20927: Delete > Numbers > Internal > Delete > Validate list of deleted fax number and not deleted fax numbers *smoke*', async function () {
        res = await requests.deleteNumbers({"fax_numbers": +fax_number+','+fax_number1})
        assert.equal(res.status, 200, 'Actual status is '+res.status)
        assert.equal(res.body.quantity, 1, 'Actual quantity is '+res.body.quantity)
        assert.equal(res.body.numbers[0], fax_number, 'fax_number has not been deleted')
        assert.equal(res.body.errors[0].error_message, 'Number does not belong to your account.', 'Actual error_message is '+res.body.errors[0].error_message)
        assert.equal(res.body.errors[0].number, fax_number1, 'Not Unassigned fax_number')
    })

    after(async function () {
        await requests.delApplications(app_id_int, appRequestBody_int)
    })
})