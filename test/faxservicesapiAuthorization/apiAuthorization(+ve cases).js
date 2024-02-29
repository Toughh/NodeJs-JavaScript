/**
 * Import required packages
 */
require('mocha')
require('../../common/util/testrail-util')

var config = require('config')
var assert = require('chai').assert
const chai = require('chai')
chai.use(require('chai-uuid'))

const requests = require('../../common/setup/request')
const applicationsPayload = require('../../common/datasource/createApplication')
const usersPayload = require('../../common/datasource/createUser')
const userDefaultsNamesPayload = require('../../common/datasource/createUserDefaultsNames')
const apiUsersRefresh = require('../../common/datasource/putApiUsersRefresh')

const commonservice = require('../../common/setup/service')
const common_utils = require('../../common/util/commonUtils')

const timeout = config.get('timeout')


describe('Put Api users authorization with defaults (+) - Validate response *end-to-end*', function () {
    this.timeout(timeout)
    let group_name
    let user_requestBody, app_requestBody_with_router, userDefaultsNamesRequestBody
    let admin_id = config.get('admin.corp_id')
    let userName = config.get('admin.username')
    let app_id, fax_number, customer_key, user_id, service_key_inbound, service_key_outbound
    let active_status = 'A', inactive_status = 'I'
    let default_name = 'outbound_caller_id'
    let default_value = '12312312312'
    let res

    before(async function () {
        try {
            group_name = "My Account\\Avijit Test Automation"
            app_requestBody_with_router = applicationsPayload.postApplications(admin_id, group_name)
            // delete app_requestBody_with_router.status
            // app_requestBody_with_router.type = "ROUTER"

            res = await requests.postApplications(app_requestBody_with_router)
            app_id = res.body.app_id
            console.log("app_id with router is " + app_id)

            user_requestBody = usersPayload.postUsers(app_id, group_name)
            user_requestBody.user.email_address = common_utils.randEmail()

            res = await requests.postUsers(user_requestBody, userName, admin_id)
            fax_number = res.body.fax_numbers[0].fax_number
            customer_key = res.body.fax_numbers[0].customer_key
            user_id = res.body.fax_numbers[0].user_id
            service_key_inbound = res.body.fax_numbers[0].service_key_inbound
            service_key_outbound = res.body.fax_numbers[0].service_key_outbound

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C36699: Put > internal > users > api-users > active_user_id > refresh > Validate defaults in the response on posting api-users default enabled as true', async function () {
        userDefaultsNamesRequestBody = userDefaultsNamesPayload.postUserDefaultDefaultName(default_name, default_value, true)

        res = await requests.postUsersApiUsersUserIdDefaults(userDefaultsNamesRequestBody, user_id)
        assert.equal(res.status, 201, 'Actual status code is ' + res.status)

        res = await requests.putUsersApiUsersUserIdRefresh(user_id, app_id)
        assert.equal(res.status, 200, 'Actual status is ' + res.status)
        const usersdefaults = JSON.stringify(apiUsersRefresh.usersdefaults(user_id, app_id, customer_key, service_key_inbound, service_key_outbound, fax_number, active_status, default_value, true, active_status))
        assert.include(JSON.stringify(res.body), usersdefaults, 'Actual response is ' + JSON.stringify(res.body))
    })

    it('C36700: Put > internal > users > api-users > active_user_id > refresh > Validate user status as inactive and default status as inactive on sending default status as false', async function () {
        res = await requests.deleteUsersApiUsersFaxNumber(fax_number, app_id)
        assert.equal(res.status, 204, `Actual statusCode is ${res.status}`)

        // res = await requests.deleteUsersCustomerId(customer_key, admin_id)
        // assert.equal(res.status, 204, `Actual statusCode is ${res.status}`)

        res = await requests.putUsersApiUsersUserIdRefresh(user_id, app_id)
        assert.equal(res.status, 200, 'Actual status is ' + res.status)
        const usersdefaults = JSON.stringify(apiUsersRefresh.usersdefaults(user_id, app_id, customer_key, service_key_inbound, service_key_outbound, fax_number, inactive_status, default_value, false, inactive_status))
        assert.include(JSON.stringify(res.body), usersdefaults, 'Actual response is ' + JSON.stringify(res.body))
    })

    after(async function () {
        await requests.deleteNumbersFaxNumber(fax_number)
        await requests.deleteUsersCustomerId(customer_key, admin_id)
        await requests.delApplications(app_id, app_requestBody_with_router)
    })
})

describe('Put Api users authorization with no defaults (+) - Validate response *end-to-end*', function () {
    this.timeout(timeout)
    let group_name
    let user_requestBody, app_requestBody_with_router
    let admin_id = config.get('admin.corp_id')
    let userName = config.get('admin.username')
    let app_id, fax_number, customer_key, user_id, service_key_inbound, service_key_outbound
    let active_status = 'A', inactive_status = 'I'
    let res

    before(async function () {

        try {
            group_name = "My Account\\Avijit Test Automation"
            app_requestBody_with_router = applicationsPayload.postApplications(admin_id, group_name)
            delete app_requestBody_with_router.status
            app_requestBody_with_router.type = "ROUTER"

            res = await requests.postApplications(app_requestBody_with_router)
            app_id = res.body.app_id
            console.log("app_id with router is " + app_id)

            user_requestBody = usersPayload.postUsers(app_id, group_name)
            user_requestBody.user.email_address = common_utils.randEmail()

            res = await requests.postUsers(user_requestBody, userName, admin_id)
            fax_number = res.body.fax_numbers[0].fax_number
            customer_key = res.body.fax_numbers[0].customer_key
            user_id = res.body.fax_numbers[0].user_id
            service_key_inbound = res.body.fax_numbers[0].service_key_inbound
            service_key_outbound = res.body.fax_numbers[0].service_key_outbound

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C34208: Put > internal > users > api-users > active_user_id > refresh > Validate empty defaults if no api users default is created', async function () {
        res = await requests.putUsersApiUsersUserIdRefresh(user_id, app_id)
        assert.equal(res.status, 200, 'Actual status is ' + res.status)
        const users = JSON.stringify(apiUsersRefresh.users(user_id, app_id, customer_key, service_key_inbound, service_key_outbound, fax_number, active_status))
        assert.include(JSON.stringify(res.body), users, 'Actual response is ' + JSON.stringify(res.body))
        assert.isBelow(commonservice.resArrayLength(res.body.defaults), 1, 'Actual defaults count are ' + commonservice.resArrayLength(res.body.defaults) + ' in length')
    })

    it('C34209: Put > internal > users > api-users > active_user_id > refresh > Validate inactive status on deleting users', async function () {
        res = await requests.deleteUsersApiUsersFaxNumber(fax_number, app_id)
        assert.equal(res.status, 204, `Actual statusCode is ${res.status}`)

        // res = await requests.deleteUsersCustomerId(customer_key, admin_id)
        // assert.equal(res.status, 204, `Actual statusCode is ${res.status}`)

        res = await requests.putUsersApiUsersUserIdRefresh(user_id, app_id)
        assert.equal(res.status, 200, 'Actual status is ' + res.status)

        const users = JSON.stringify(apiUsersRefresh.users(user_id, app_id, customer_key, service_key_inbound, service_key_outbound, fax_number, inactive_status))
        assert.include(JSON.stringify(res.body), users, 'Actual response is ' + JSON.stringify(res.body))
        assert.isBelow(commonservice.resArrayLength(res.body.defaults), 1, 'Actual defaults count are ' + commonservice.resArrayLength(res.body.defaults) + ' in length')
    })

    after(async function () {
        await requests.deleteNumbersFaxNumber(fax_number)
        await requests.deleteUsersCustomerId(customer_key, admin_id)
        await requests.delApplications(app_id, app_requestBody_with_router)
    })
})

describe('Put Api users authorization with defaults (+) - Validate response *end-to-end*', function () {

    this.timeout(timeout)
    let group_name
    let user_requestBody, app_requestBody_with_router, userDefaultsNamesRequestBody
    let admin_id = config.get('admin.corp_id')
    let userName = config.get('admin.username')
    let app_id, fax_number, customer_key, user_id, service_key_inbound, service_key_outbound
    let active_status = 'A', inactive_status = 'I'
    let default_name = 'outbound_caller_id'
    let default_value = '12312312312'
    let res

    before(async function () {
        try {
            group_name = "My Account\\Avijit Test Automation"
            app_requestBody_with_router = applicationsPayload.postApplications(admin_id, group_name)
            delete app_requestBody_with_router.status
            app_requestBody_with_router.type = "ROUTER"

            res = await requests.postApplications(app_requestBody_with_router)
            app_id = res.body.app_id
            console.log("app_id with router is " + app_id)

            user_requestBody = usersPayload.postUsers(app_id, group_name)
            user_requestBody.user.email_address = common_utils.randEmail()

            res = await requests.postUsers(user_requestBody, userName, admin_id)
            fax_number = res.body.fax_numbers[0].fax_number
            customer_key = res.body.fax_numbers[0].customer_key
            user_id = res.body.fax_numbers[0].user_id
            service_key_inbound = res.body.fax_numbers[0].service_key_inbound
            service_key_outbound = res.body.fax_numbers[0].service_key_outbound

            userDefaultsNamesRequestBody = userDefaultsNamesPayload.postUserDefaultDefaultName(default_name, default_value, false)

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C36701: Put > internal > users > api-users > active_user_id > refresh > Validate defaults in the response on posting api-users default enabled as false', async function () {
        res = await requests.postUsersApiUsersUserIdDefaults(userDefaultsNamesRequestBody, user_id)
        assert.equal(res.status, 201, 'Actual status code is ' + res.status)

        res = await requests.putUsersApiUsersUserIdRefresh(user_id, app_id)
        assert.equal(res.status, 200, 'Actual status is ' + res.status)
        const usersdefaults = JSON.stringify(apiUsersRefresh.usersdefaults(user_id, app_id, customer_key, service_key_inbound, service_key_outbound, fax_number, active_status, default_value, false, active_status))
        assert.include(JSON.stringify(res.body), usersdefaults, 'Actual response is ' + JSON.stringify(res.body))
    })

    it('C36702: Put > internal > users > api-users > active_user_id > refresh > Validate user status as inactive and default status as inactive on sending default status as false', async function () {
        res = await requests.deleteUsersApiUsersFaxNumber(fax_number, app_id)
        assert.equal(res.status, 204, `Actual statusCode is ${res.status}`)

        // res = await requests.deleteUsersCustomerId(customer_key, admin_id)
        // assert.equal(res.status, 204, `Actual statusCode is ${res.status}`)

        res = await requests.putUsersApiUsersUserIdRefresh(user_id, app_id)
        assert.equal(res.status, 200, 'Actual status is ' + res.status)
        const usersdefaults = JSON.stringify(apiUsersRefresh.usersdefaults(user_id, app_id, customer_key, service_key_inbound, service_key_outbound, fax_number, inactive_status, default_value, false, inactive_status))
        assert.include(JSON.stringify(res.body), usersdefaults, 'Actual response is ' + JSON.stringify(res.body))
    })

    after(async function () {
        await requests.deleteNumbersFaxNumber(fax_number)
        await requests.deleteUsersCustomerId(customer_key, admin_id)
        await requests.delApplications(app_id, app_requestBody_with_router)
    })
})

describe('Put Api users authorization with defaults on deleting applications (+) - Validate response *end-to-end*', function () {

    this.timeout(timeout)
    let group_name
    let user_requestBody, app_requestBody_with_router, userDefaultsNamesRequestBody
    let admin_id = config.get('admin.corp_id')
    let userName = config.get('admin.username')
    let app_id, fax_number, customer_key, user_id, service_key_inbound, service_key_outbound
    let inactive_status = 'I'
    let default_name = 'outbound_caller_id'
    let default_value = '12312312312'
    let res

    before(async function () {
        try {
            group_name = "My Account\\Avijit Test Automation"
            app_requestBody_with_router = applicationsPayload.postApplications(admin_id, group_name)
            delete app_requestBody_with_router.status
            app_requestBody_with_router.type = "ROUTER"

            res = await requests.postApplications(app_requestBody_with_router)
            app_id = res.body.app_id
            console.log("app_id with router is " + app_id)

            user_requestBody = usersPayload.postUsers(app_id, group_name)
            user_requestBody.user.email_address = common_utils.randEmail()

            res = await requests.postUsers(user_requestBody, userName, admin_id)
            fax_number = res.body.fax_numbers[0].fax_number
            customer_key = res.body.fax_numbers[0].customer_key
            user_id = res.body.fax_numbers[0].user_id
            service_key_inbound = res.body.fax_numbers[0].service_key_inbound
            service_key_outbound = res.body.fax_numbers[0].service_key_outbound

            userDefaultsNamesRequestBody = userDefaultsNamesPayload.postUserDefaultDefaultName(default_name, default_value, false)

            res = await requests.postUsersApiUsersUserIdDefaults(userDefaultsNamesRequestBody, user_id)
            assert.equal(res.status, 201, 'Actual status code is ' + res.status)

            res = await requests.putUsersApiUsersUserIdRefresh(user_id, app_id)
            assert.equal(res.status, 200, 'Actual status is ' + res.status)

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C36703: Put > internal > users > api-users > active_user_id > refresh > Validate inactive users and defaults on deleting applications', async function () {
        res = await requests.delApplications(app_id, app_requestBody_with_router)
        assert.equal(res.status, 204, `Actual statusCode is ${res.status}`)

        res = await requests.putUsersApiUsersUserIdRefresh(user_id, app_id)
        assert.equal(res.status, 200, 'Actual status is ' + res.status)
        const usersdefaults = JSON.stringify(apiUsersRefresh.usersdefaults(user_id, app_id, customer_key, service_key_inbound, service_key_outbound, fax_number, inactive_status, default_value, false, inactive_status))
        assert.include(JSON.stringify(res.body), usersdefaults, 'Actual response is ' + JSON.stringify(res.body))
    })

    after(async function () {
        await requests.deleteNumbersFaxNumber(fax_number)
        await requests.deleteUsersCustomerId(customer_key, admin_id)
        await requests.delApplications(app_id, app_requestBody_with_router)
    })
})

describe('Api authorization (+) - Validate response *end-to-end*', function () {
    this.timeout(timeout)
    let group_name
    let user_requestBody, app_requestBody_with_router, api_user_requestBody
    let admin_id = config.get('admin.corp_id')
    let userName = config.get('admin.username')
    let password = config.get('admin.password')
    let app_id, fax_number, customer_key, user_id
    let res

    before(async function () {
        try {
            group_name = "My Account\\Avijit Test Automation"
            app_requestBody_with_router = applicationsPayload.postApplications(admin_id, group_name)
            delete app_requestBody_with_router.status
            app_requestBody_with_router.type = "ROUTER"

            res = await requests.postApplications(app_requestBody_with_router)
            app_id = res.body.app_id
            console.log("app_id with router is " + app_id)

            user_requestBody = usersPayload.postUsers(app_id, group_name)
            user_requestBody.user.email_address = common_utils.randEmail()

            res = await requests.postUsers(user_requestBody, userName, admin_id)
            fax_number = res.body.fax_numbers[0].fax_number
            customer_key = res.body.fax_numbers[0].customer_key
            user_id = res.body.fax_numbers[0].user_id

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C5114: POST > OAuth token - Generate Token > Validate OAuth Token *smoke*', async function () {
        res = await requests.postOauthToken(userName, password)
        assert.equal(res.status, 200, 'Actual status is ' + res.status)
        assert.uuid(res.body.access_token, 'v4')
        assert.isNumber(res.body.expires_in, 'expires_in is not a number')
        assert.equal(res.body.scope, 'admin', 'Actual scope is ' + res.body.scope)
        assert.equal(res.body.token_type, 'bearer', 'Actual status is ' + res.body.token_type)
    })

    it('C32976: Get > internal > users > api-users > fax_number > Validate error and status code when we do not pass app-id in header', async function () {
        res = await requests.getUsersApiUsersFaxNumber(fax_number, undefined, userName)
        assert.equal(res.status, 400, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'GEN013', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, "Missing request header 'app-id' for method parameter of type String", 'Actual error_code is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Invalid request.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C32977: Put > internal > users > api-users > fax_number > Validate error and status code when we do not pass app-id in header', async function () {
        res = await requests.putUsersApiUsersFaxNumber(fax_number, undefined)
        assert.equal(res.status, 400, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'GEN013', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, "Missing request header 'app-id' for method parameter of type String", 'Actual error_code is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Invalid request.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C32978: Delete > internal > users > api-users > fax_number > Validate error and status code when we do not pass app-id in header', async function () {
        res = await requests.deleteUsersApiUsersFaxNumber(fax_number, undefined)
        assert.equal(res.status, 400, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'GEN013', 'Actual error_code is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, "Missing request header 'app-id' for method parameter of type String", 'Actual error_code is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Invalid request.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C32979: Patch > internal > users > api-users > fax_number > Validate error and status code when we do not pass app-id in header', async function () {
        api_user_requestBody = usersPayload.apiUsers()
        res = await requests.patchUsersApiUsersFaxNumber(fax_number, undefined, userName, api_user_requestBody)
        assert.equal(res.status, 400, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'GEN010', 'Actual error_coe is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, "Request method 'PATCH' not supported", 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Unsupported request.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C34314: Patch > internal > users > api-users > fax_number > Validate error code and error message', async function () {
        api_user_requestBody = usersPayload.apiUsers()
        res = await requests.patchUsersApiUsersFaxNumber(fax_number, app_id, userName, api_user_requestBody)
        assert.equal(res.status, 400, 'Actual status is ' + res.status)
        assert.equal(res.body.errors[0].error_code, 'GEN010', 'Actual error_coe is ' + res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].developer_message, "Request method 'PATCH' not supported", 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Unsupported request.', 'Actual user_message is ' + res.body.errors[0].user_message)
    })

    it('C5130: GET > Users > API Users > Get Assigned Number Info > Specified fax number > Should return associated user id *smoke*', async function () {
        res = await requests.getUsersApiUsersFaxNumber(fax_number, app_id, userName)
        assert.equal(res.status, 200, 'Actual status is ' + res.status)
        assert.equal(res.body.fax_number, fax_number, 'Actual fax_number is ' + res.body.fax_number)
        assert.equal(res.body.group_name, group_name, 'Actual group_name is ' + res.body.group_name)
        assert.equal(res.body.customer_key, customer_key, 'Actual customer_key is ' + res.body.customer_key)
        assert.equal(res.body.services_api_authorized, true, 'Actual services_api_authorized is ' + res.body.services_api_authorized)
        assert.equal(res.body.user_id, user_id, 'Actual user_id is ' + res.body.user_id)
        assert.equal(res.body.account_id, admin_id, 'Actual account_id is ' + res.body.account_id)
    })

    it('C19481: DELETE > Users > API Users > Api Authorization > Validate authorized fax_num is deleted properly *smoke*', async function () {
        res = await requests.deleteUsersApiUsersFaxNumber(fax_number, app_id)
        assert.equal(res.status, 204, 'Actual status is ' + res.status)
    })

    it('C5131: PUT > Users > API Users > Enable Assigned Number > Existing and assigned fax number > Validate authorization of number for use of fax services *smoke*', async function () {
        res = await requests.putUsersApiUsersFaxNumber(fax_number, app_id)
        assert.equal(res.status, 200, 'Actual status is ' + res.status)
        assert.equal(res.body.fax_number, fax_number, 'Actual fax_number is ' + res.body.fax_number)
        assert.uuid(res.body.user_id, 'v4')
        assert.equal(res.body.customer_key, customer_key, 'Actual customer_key is ' + res.body.customer_key)
        assert.equal(res.body.group_name, group_name, 'Actual group_name is ' + res.body.group_name)
        assert.equal(res.body.account_id, admin_id, 'Actual account_id id ' + res.body.account_id)
        assert.equal(res.body.services_api_authorized, true, 'Actual services_api_authorized boolean value is ' + res.body.services_api_authorized)
    })

    //Replica of C5131
    it('C18058: PUT > Users > API Users > Authorize API Services > Validate fax number/user is given api authorization', async function () {
        assert.equal(res.body.services_api_authorized, true, 'Actual services_api_authorized boolean value is ' + res.body.services_api_authorized)
    })

    after(async function () {
        await requests.deleteNumbersFaxNumber(fax_number)
        await requests.deleteUsersCustomerId(customer_key, admin_id)
        await requests.delApplications(app_id, app_requestBody_with_router)
    })
})