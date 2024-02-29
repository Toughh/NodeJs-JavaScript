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


describe('GET users - Verify user response *end-to-end*', function () {
    this.timeout(timeout)
    let group_name
    let app_requestBody, user_requestBody1, user_requestBody2, number_requestBody, patchNumber_requestBody
    let app_id
    let admin_id = config.get('admin.corp_id')
    let userName = config.get('admin.username')
    let service_key, service_key_inbound, service_key_outbound, customer_key, customer_key1
    let fax_number, user_fax_number, fax_number1, user_id
    let res

    before(async function () {
        try {
            group_name = "My Account\\Avijit Test Automation"
            app_requestBody = applicationsPayload.postApplications(admin_id, group_name)

            res = await requests.postApplications(app_requestBody)
            app_id = res.body.app_id
            console.log("app_id is " + app_id)

            user_requestBody1 = usersPayload.postUsers(app_id, group_name)
            user_requestBody1.user.email_address = common_utils.randEmail()

            res = await requests.postUsers(user_requestBody1, userName, admin_id)
            customer_key1 = res.body.fax_numbers[0].customer_key
            fax_number = res.body.fax_numbers[0].fax_number
            user_id = res.body.fax_numbers[0].user_id
            service_key = res.body.fax_numbers[0].service_key
            service_key_inbound = res.body.fax_numbers[0].service_key_inbound
            service_key_outbound = res.body.fax_numbers[0].service_key_outbound

            user_requestBody2 = usersPayload.postUsers(app_id, group_name)
            user_requestBody2.user.email_address = common_utils.randEmail()

            res = await requests.postUsers(user_requestBody2, userName, admin_id)
            customer_key = res.body.fax_numbers[0].customer_key
            user_id1 = res.body.fax_numbers[0].user_id
            user_fax_number = res.body.fax_numbers[0].fax_number

            number_requestBody = numberPayload.postNumbers()
            res = await requests.postNumbers(number_requestBody, userName)
            fax_number1 = res.body.numbers[0]

            patchNumber_requestBody = editNumberPayload.editNumbers(customer_key1, app_id)
            res = await requests.patchNumbers(fax_number1, patchNumber_requestBody)
            assert.uuid(res.body.user_id, 'v4')

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C7104: GET > Users > Validate appropriate user ids are displayed for a specific application *smoke*', async function () {
        res = await requests.getUsers(app_id)
        assert.equal(res.status, 200, 'Actual status is'+res.status)
        assert.notEqual(res.body[0].user_id, res.body[1].user_id, 'User id are same for a specific application')
    })

    it('C6169: GET > Users > Validate users exist', async function () {
        res = await requests.getUsers(app_id)
        assert.equal(res.status, 200, 'Actual status is'+res.status)
        assert.uuid(res.body[0].user_id, 'v4')
    })

    it('C17783: GET > Users > From fax-number > Validated user information for particular customer', async function () {
        res = await requests.getNumbersFaxNumber(fax_number)
        assert.equal(res.status, 200, res.status)
        assert.equal(res.body.app_id, app_id, 'api_id does not match created application app_id')
        assert.equal(res.body.customer_key, customer_key1, 'customer_key does not match created user customer_key')
        assert.equal(res.body.fax_number, fax_number, 'fax_number does not match created user fax_number')
        assert.equal(res.body.group_name, group_name, 'group_name does not match created user group_name')
        assert.equal(res.body.service_key, service_key, 'service_key does not match created user service_key')
        assert.equal(res.body.service_key_inbound, service_key_inbound, 'service_key_inbound does not match created user service_key_inbound')
        assert.equal(res.body.service_key_outbound, service_key_outbound, 'service_key_outbound does not match created user service_key_outbound')
        assert.equal(res.body.services_api_authorized, true, 'services_api_authorized does not match created user services_api_authorized')
        assert.equal(res.body.user_id, user_id, 'user_id does not match created user user_id')

    })

    it('C5120: GET > Users > Validated user information for particular customer', async function () {
        res = await requests.getUsersCustomerKey(customer_key, userName, admin_id)
        assert.equal(res.status, 200, 'Actual status is'+res.status)
        assert.isString(res.body.fax_numbers[0].fax_number, 'fax_number is not generated')
        assert.equal(res.body.fax_numbers[0].group_name, group_name, 'group_name is not same as created Applications group_name')
        assert.equal(res.body.fax_numbers[0].account_id, admin_id, 'Actual account_id is '+res.body.fax_numbers[0].account_id)
        assert.isNumber(res.body.fax_numbers[0].customer_key, 'customer_key is not generated')
        assert.isString(res.body.fax_numbers[0].service_key_inbound, 'servicekey_inbound is not generated')
        assert.isString(res.body.fax_numbers[0].service_key_outbound, 'servicekey_outbound is not generated')
        assert.equal(res.body.fax_numbers[0].services_api_authorized, true, 'services_api_authorized boolean value is false')
    })
    
    it('C5123: GET > Users > Edit Users > Get Users > Validate add fax number/s to an User account', async function () {
        res = await requests.getNumbersFaxNumber(fax_number)
        assert.equal(res.status, 200, 'Actual status is'+res.status)   
        assert.equal(res.body.app_id, app_id, 'app_id is not equal to generated Application app_id')
        assert.equal(res.body.user_id, user_id, 'user_id is not equal to generated User user_id ')
        assert.equal(res.body.fax_number, fax_number, 'fax_number is not equal to generated Post Fax Number')
        assert.equal(res.body.account_id, admin_id, 'account_id is not equal to admin_id')
        assert.equal(res.body.customer_key, customer_key1, 'customer_key is not equal to customer_key generated Post Users')
        assert.equal(res.body.group_name, group_name, 'group_name is not equal to post applications group_name')   
        assert.isString(res.body.service_key_inbound, 'servicekey_inbound is not generated')
        assert.isString(res.body.service_key_outbound, 'servicekey_outbound is not generated')      
    })

    it('C17781: GET > Users > From user-id > Validated user information for particular customer', async function () {
        res = await requests.getUsersApiUsersUserId(user_id)
        assert.equal(res.status, 200, res.status)
        assert.equal(res.body.app_id, app_id, 'api_id does not match created application app_id')
    })

    it.skip('C5124: GET > Users > Edit User > Get User > Validate remove fax number/s from an user account', async function () {
        res = await requests.deleteNumbersFaxNumber(fax_number)
        assert.equal(res.status, 204, res.status)
        res = await requests.getUsersCustomerKey(customer_key1, userName, admin_id)
        assert.equal(res.status, 200, 'Actual status is'+res.status)
        assert.notEqual(res.body.fax_numbers[0].fax_number, fax_number, 'Deleted fax_number is still assigned fax_number to user')      
    })

    after(async function () {
        await requests.deleteNumbersFaxNumber(fax_number1)
        await requests.delApplications(app_id, app_requestBody)
    })
})

describe('GET users - Verify user response *end-to-end*', function () {
    this.timeout(timeout)
    let group_name
    let app_requestBody, user_requestBody, number_requestBody, patchNumber_requestBody
    let app_id
    let admin_id = config.get('admin.corp_id')
    let userName = config.get('admin.username')
    let customer_key1
    let fax_number, fax_number1
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
            customer_key1 = res.body.fax_numbers[0].customer_key
            fax_number = res.body.fax_numbers[0].fax_number

            number_requestBody = numberPayload.postNumbers()
            res = await requests.postNumbers(number_requestBody, userName)
            fax_number1 = res.body.numbers[0]

            patchNumber_requestBody = editNumberPayload.editNumbers(customer_key1, app_id)
            res = await requests.patchNumbers(fax_number1, patchNumber_requestBody)
            
            res = await requests.deleteUsersApiUsersFaxNumber(fax_number, app_id)

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C5125: GET > Users > Edit Users > Get Users > Validate disable fax number/s from an account', async function () {
        res = await requests.getUsersCustomerKey(customer_key1, userName, admin_id)
        assert.equal(res.status, 200, res.status)
        assert.equal(res.body.fax_numbers[0].services_api_authorized, false, 'Actual services_api_authorized is true')
    })

    it('C20326: GET > Users > Edit Users > Get Users > Validate enable fax number/s from an account', async function () {
        res = await requests.getUsersCustomerKey(customer_key1, userName, admin_id)
        assert.equal(res.status, 200, res.status)
        assert.equal(res.body.fax_numbers[0].services_api_authorized, false, 'Actual services_api_authorized is true')
        res = await requests.putUsersApiUsersFaxNumber(fax_number, app_id)
        assert.equal(res.status, 200, res.status)
        assert.equal(res.body.services_api_authorized, true, 'Actual services_api_authorized is false')
        res = await requests.getUsersCustomerKey(customer_key1, userName, admin_id)
        assert.equal(res.status, 200, res.status)
        assert.equal(res.body.fax_numbers[0].services_api_authorized, true, 'Actual services_api_authorized is false')
    })

    after(async function () {
        await requests.deleteNumbersFaxNumber(fax_number1)
        await requests.delApplications(app_id, app_requestBody)
    })
})

describe('GET applications app_id users - Verify active users in response *end-to-end*', function () {
    this.timeout(timeout)
    let group_name
    let app_requestBody, user_requestBody
    let app_id
    let admin_id = config.get('admin.corp_id')
    let userName = config.get('admin.username')
    let customer_key1, customer_key2, fax_number1, fax_number2, user_id1, user_id2
    let service_key_inbound1, service_key_inbound2, service_key_outbound1, service_key_outbound2
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
            customer_key1 = res.body.fax_numbers[0].customer_key
            fax_number1 = res.body.fax_numbers[0].fax_number
            user_id1 = res.body.fax_numbers[0].user_id
            service_key_inbound1 = res.body.fax_numbers[0].service_key_inbound
            service_key_outbound1 = res.body.fax_numbers[0].service_key_outbound

            user_requestBody = usersPayload.postUsers(app_id, group_name)
            user_requestBody.user.email_address = common_utils.randEmail()

            res = await requests.postUsers(user_requestBody, userName, admin_id)
            customer_key2 = res.body.fax_numbers[0].customer_key
            fax_number2 = res.body.fax_numbers[0].fax_number
            user_id2 = res.body.fax_numbers[0].user_id
            service_key_inbound2 = res.body.fax_numbers[0].service_key_inbound
            service_key_outbound2 = res.body.fax_numbers[0].service_key_outbound

            res = await requests.deleteNumbersFaxNumber(fax_number1)

            res = await requests.deleteUsersCustomerId(customer_key1, admin_id)

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C32755: GET > applications > app_id > Users > Validate response contain only active users', async function () {
        res = await requests.getUsers(app_id)
        assert.equal(res.status, 200, 'Actual status is'+res.status)
        assert.equal(res.body.length, 1, 'Actual length is '+res.body.length)
        assert.equal(res.body[0].user_id, user_id2, 'Actual user_id is '+res.body[0].user_id)
        assert.equal(res.body[0].customer_key, customer_key2, 'Actual customer_key is '+res.body[0].customer_key)
        assert.equal(res.body[0].service_key_inbound, service_key_inbound2, 'Actual service_key_inbound is '+res.body[0].service_key_inbound)
        assert.equal(res.body[0].service_key_outbound, service_key_outbound2, 'Actual service_key_outbound is '+res.body[0].service_key_outbound)
        assert.equal(res.body[0].fax_number, fax_number2, 'Actual fax_number is '+res.body[0].fax_number)
    })

    after(async function () {
        await requests.delApplications(app_id, app_requestBody)
    })
})