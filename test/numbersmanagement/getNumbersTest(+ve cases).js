/**
 * Import required packages
 */
require('mocha')
require('../../common/util/testrail-util')

var config = require('config')
var assert = require('chai').assert

const requests = require('../../common/setup/request')
const applicationsPayload = require('../../common/datasource/createApplication')
const userPayload = require('../../common/datasource/createUser')
const common_utils = require('../../common/util/commonUtils')

const timeout = config.get('timeout')

describe('Get numbers (+) - Verify get users response *end-to-end*', function () {
    this.timeout(timeout)
    let group_name, group_name1
    let app_requestBody, user_requestBody
    let app_id
    let admin_id = config.get('admin.corp_id')
    let userName = config.get('admin.username')
    let fax_number, fax_number1, customer_key, customer_key1, user_id, servicekey_inbound, servicekey_outbound
    let res

    before(async function () {
        try {
            group_name = "My Account\\Avijit Test Automation"
            app_requestBody = applicationsPayload.postApplications(admin_id, group_name)

            res = await requests.postApplications(app_requestBody)
            app_id = res.body.app_id
            console.log("app_id is " + app_id)

            user_requestBody = userPayload.postUsers(app_id, group_name)
            user_requestBody.user.email_address = common_utils.randEmail()
            
            res = await requests.postUsers(user_requestBody, userName, admin_id)
            fax_number = res.body.fax_numbers[0].fax_number
            user_id = res.body.fax_numbers[0].user_id
            servicekey_inbound = res.body.fax_numbers[0].service_key_inbound
            servicekey_outbound = res.body.fax_numbers[0].service_key_outbound
            customer_key = res.body.fax_numbers[0].customer_key

            res = await requests.getNumberUnassigned(userName, 2, 1)
            fax_number1 = res.body[0].fax_number
            group_name1 = res.body[0].group_name
            customer_key1 = res.body[0].customer_key

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C5126: Get > Numbers > Get Number Info > For a specified fax number > Validate info returned info *smoke*', async function () {
        res = await requests.getNumbersFaxNumber(fax_number)
        assert.equal(res.body.app_id, app_id, 'Created Application app_id does not match')
        assert.equal(res.body.user_id, user_id, 'Created User user_Id does not match')
        assert.equal(res.body.fax_number, fax_number, 'Created Users fax_number does not match')
        assert.equal(res.body.group_name, group_name, 'Created Applications group_name does not match')
        assert.equal(res.body.account_id, admin_id, 'Created User account_id does not match')
        assert.equal(res.body.customer_key, customer_key, 'Created User customer_key does not match')
        assert.equal(res.body.service_key_inbound, servicekey_inbound, 'Created User servicekey_inbound does not match')
        assert.equal(res.body.service_key_outbound, servicekey_outbound, 'Created User servicekey_outbound does not match')
    })

    it('C22705: Get > Numbers > Get Number Info > For a specified fax number > Validate blank response return for unassigned fax number', async function () {
        res = await requests.getNumbersFaxNumber(fax_number1)
        assert.equal(res.status, 200, 'Actual status is '+res.status)
        assert.isEmpty(res.body.app_id, 'app_id has content')
        assert.isEmpty(res.body.user_id, 'user_id has content')
        assert.equal(res.body.fax_number, fax_number1, 'Created Users fax_number does not match')
        assert.equal(res.body.account_id, admin_id, 'Created User account_id does not match')
        assert.equal(res.body.group_name, group_name1, 'group_name does not match with Post Numbers Unassigned')
        assert.isNotNull(res.body.customer_key, 'customer_key is null')
    })

    it('C27364: Get > Numbers > Assigned > Validate if all assigned numbers having details are displayed corresponding to admin or single group name with no children', async function () {
        res = await requests.getNumberAssigned(userName, 10, 20)
        assert.equal(res.status, 200, 'Actual status is '+res.status)
        for (i = 0; i < res.body[i].length; i++) {
            assert.isNotNull(res.body[i].fax_number, 'fax_number has no content')
            assert.isNotNull(res.body[i].group_name, 'group_name has no content')
            assert.isNumber(res.body[i].customer_key, 'customer_key has no content')
            assert.isBoolean(res.body[i].services_api_authorized, 'services_api_authorized is not boolean type')
            assert.isNotNull(res.body[i].account_id, 'account_id has no content')
            assert.isNotNull(res.body[i].servicekey_inbound, 'servicekey_inbound has no content')
        }
    })

    it('C27365: Get > Numbers > Unassigned > Validate if all unassigned numbers having details are displayed corresponding to admin or single group name with no children', async function () {
        res = await requests.getNumberUnassigned(userName, 10, 20)
        assert.equal(res.status, 200, 'Actual status is '+res.status)
        assert.equal(res.body.length, 20, 'Actual length is '+res.body.length)
        for (i = 0; i < res.body[i].length; i++) {
            assert.isNotNull(res.body[i].fax_number, 'fax_number has no content')
            assert.isNotNull(res.body[i].group_name, 'group_name has no content')
            assert.isNull(res.body[i].customer_key, 'customer_key has content')
        }
    })

    it('C27369: Get > Numbers > Unassigned > Validate if all Unassigned numbers delimited with comma are displayed corresponding to sub admin or users associated with that admin group', async function () {
        res = await requests.getNumberUnassigned(userName, 10, 20)
        assert.equal(res.status, 200, 'Actual status is '+res.status)
        assert.equal(res.body.length, 20, 'Actual length is '+res.body.length)
        for (i = 0; i < res.body[i].length; i++) {
            assert.isNotNull(res.body[i].fax_number, 'fax_number has no content')
            assert.isNotNull(res.body[i].group_name, 'group_name has no content')
            assert.isNull(res.body[i].customer_key, 'customer_key has content')
        }
    })

    it('C27370: Get > Numbers > Unassigned > Validate if response does return group path in response', async function () {
        res = await requests.getNumberUnassigned(userName, 10, 20)
        assert.equal(res.status, 200, 'Actual status is '+res.status)
        assert.equal(res.body.length, 20, 'Actual length is '+res.body.length)
        for (i = 0; i < res.body[i].length; i++) {
            assert.isNotNull(res.body[i].group_name, 'group_name has no content')
        }
    })

    it('C27371: Get > Numbers > Unassigned > Validate if response fields are not duplicate', async function () {
        res = await requests.getNumberUnassigned(userName, 0, 50)
        assert.equal(res.status, 200, 'Actual status is '+res.status)
        assert.equal(res.body.length, 50, 'Actual length is '+res.body.length)
        for (i = 0; i < res.body[i].length; i++) {
            assert.notEqual(res.body[i].fax_number, res.body[i+1].fax_number, 'fax_number are duplicate')
        }
    })

    it('C27366: Get > Numbers > Assigned > Validate if all assigned numbers having details are displayed corresponding to sub admin or users associated with that admin group', async function () {
        res = await requests.getNumberAssigned(userName, 10, 20)
        assert.equal(res.status, 200, 'Actual status is '+res.status)
        for (i = 0; i < res.body[i].length; i++) {
            assert.isNotNull(res.body[i].fax_number, 'fax_number has no content')
            assert.isNotNull(res.body[i].group_name, 'group_name has no content')
            assert.isNumber(res.body[i].customer_key, 'customer_key has no content')
            assert.isBoolean(res.body[i].services_api_authorized, 'services_api_authorized is not boolean type')
            assert.isNotNull(res.body[i].account_id, 'account_id has no content')
            assert.isNotNull(res.body[i].servicekey_inbound, 'servicekey_inbound has no content')
        }
    })

    it('C27367: Get > Numbers > Assigned > Validate if /numbers/assigned end points show service_key_outbound for API disabled users', async function () {
        res = await requests.getNumberAssigned(userName, 0, 100)
        assert.equal(res.status, 200, 'Actual status is '+res.status)
        for (i = 0; i < res.body[i].length; i++) {
            assert.exists(res.body[i].service_key_outbound, 'service_key_outbound does not exist')
        }
    })

    it('C11331: Get > Numbers > Get Number Info > Validate that error message displayed for missing variable in URL path', async function () {
        res = await requests.getNumbersFaxNumber(``)
        assert.equal(res.status, 200, 'Actual status code is '+res.status)
        assert.isString(res.body[0].fax_number, 'Actual fax_number is '+res.body[0].fax_number)
    })

    after(async function () {
        await requests.delApplications(app_id, app_requestBody)
    })
})