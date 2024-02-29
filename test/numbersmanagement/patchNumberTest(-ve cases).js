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
const numberPayload = require('../../common/datasource/createNumber')
const editNumberPayload = require('../../common/datasource/editNumber')

const timeout = config.get('timeout')

describe('Patch > Numbers (-) - Verify get response *end-to-end*', function () {
    this.timeout(timeout)
    let group_name
    let app_requestBody, user_requestBody, user_requestBody1
    let app_id
    let admin_id = config.get('admin.corp_id')
    let userName = config.get('admin.username')
    let fax_number, user_fax_number, fax_number1, fax_number2, customer_key, customer_key1, user_id, servicekey_inbound, servicekey_outbound
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
            assert.equal(res.status, 201, 'Actual status is ' + res.status)
            fax_number = res.body.fax_numbers[0].fax_number
            user_id = res.body.fax_numbers[0].user_id
            servicekey_inbound = res.body.fax_numbers[0].servicekey_inbound
            servicekey_outbound = res.body.fax_numbers[0].servicekey_outbound
            customer_key = res.body.fax_numbers[0].customer_key

            user_requestBody1 = usersPayload.postUsers(app_id, group_name)
            user_requestBody1.user.email_address = common_utils.randEmail()
            
            res = await requests.postUsers(user_requestBody1, userName, admin_id)
            customer_key1 = res.body.fax_numbers[0].customer_key
            user_fax_number = res.body.fax_numbers[0].customer_key

            number_requestBody = numberPayload.postNumbers()
            res = await requests.postNumbers(number_requestBody, userName)
            fax_number1 = res.body.numbers[0]

            res = await requests.postNumbers(number_requestBody, userName)
            fax_number2 = res.body.numbers[0]

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C5127: Patch Number > Assign Number from already assigned numbers > Validate number is not assigned to specified customer *smoke*', async function () {
        patchNumber_requestBody = editNumberPayload.editNumbers(customer_key, app_id)
        res = await requests.patchNumbers(fax_number1, patchNumber_requestBody)
        assert.equal(res.status, 200, 'Actual status is '+res.status)
        assert.uuid(res.body.user_id, 'v4')

        patchNumber_requestBody = editNumberPayload.editNumbers(customer_key, app_id)
        res = await requests.patchNumbers(fax_number1, patchNumber_requestBody)
        assert.equal(res.status, 400, 'Actual status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'NUM006', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ResultCode', 'Actual element_name is '+res.body.errors[0].element_name)
        //assert.match(res.body.errors[0].developer_message, 'ParentCustomerKey '+assert.match('^[0-9]*$/'' does not own DID ' +fax_number1+', owner='+customer_key, 'Actual element_name is '+res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Error executing stored procedure.', 'Actual user_message is '+res.body.errors[0].user_message)
        
    })

    it('C11330: Patch Number > Assign Number To User > Validate more than one number is assigned to specified customer *smoke*', async function () {
        patchNumber_requestBody = editNumberPayload.editNumbers(customer_key1, app_id)
        res = await requests.patchNumbers(fax_number2, patchNumber_requestBody)
        assert.equal(res.status, 200, 'Actual status is '+res.status)
        assert.uuid(res.body.user_id, 'v4')

        patchNumber_requestBody = editNumberPayload.editNumbers(customer_key1, app_id)
        res = await requests.patchNumbers(fax_number2, patchNumber_requestBody)
        assert.equal(res.status, 400, 'Actual status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'NUM006', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ResultCode', 'Actual element_name is '+res.body.errors[0].element_name)
        //assert.match(res.body.errors[0].developer_message, 'ParentCustomerKey '+assert.match('^[0-9]*$/'' does not own DID ' +fax_number1+', owner='+customer_key, 'Actual element_name is '+res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Error executing stored procedure.', 'Actual user_message is '+res.body.errors[0].user_message)
        
    })

    after(async function () {
        await requests.delApplications(app_id, app_requestBody)
    })
})