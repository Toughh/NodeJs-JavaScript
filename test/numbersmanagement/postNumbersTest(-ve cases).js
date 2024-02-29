/**
 * Import required packages
 */
require('mocha')
require('../../common/util/testrail-util')

var config = require('config')
var assert = require('chai').assert

const requests = require('../../common/setup/request')
const numberPayload = require('../../common/datasource/createNumber')

const timeout = config.get('timeout')

describe('POST numbers (-) - Verify error messages *end-to-end*', function () {
    this.timeout(timeout)
    let number_requestBody
    let res
    let userName = config.get('admin.username')

    beforeEach(async function () {
        number_requestBody = numberPayload.postNumbers()        
    })

    it('C20742: POST > Numbers > Validate that error message displayed for invalid or removed credentials', async function () {
        res = await requests.postNumbers(number_requestBody, 'As@#')
        assert.equal(res.status, 401, 'Actual status code is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'AUT002', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'BadCredentialsException', 'Actual element_name is '+res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, "Account not found.", 'Actual element_name is '+res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'The administrator ID, username or password are incorrect.', 'Actual user_message is '+res.body.errors[0].user_message)
    })

    it('C19489: POST > Numbers > Validate that error message is displayed for requesting faxnumber for non toll free area code with toll free element', async function () {
        delete number_requestBody.area_code
        number_requestBody.area_code = '740'
        number_requestBody.toll_free = true
        number_requestBody.region = 'US'  
        res = await requests.postNumbers(number_requestBody, userName)
        assert.equal(res.status, 400, 'Actual status code is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'NUM016', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ResultCode', 'Actual element_name is '+res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, "Assigning Toll Free DiDs by Area Code", 'Actual element_name is '+res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'No fax numbers available', 'Actual user_message is '+res.body.errors[0].user_message)
    })

    it('C20092: POST > Numbers > Validate that error message is displayed properly for empty inventory of fax number for toll free area code', async function () {
        delete number_requestBody.area_code
        number_requestBody.area_code = '732'
        number_requestBody.toll_free = true
        number_requestBody.region = 'US'
        res = await requests.postNumbers(number_requestBody, userName)
        assert.equal(res.status, 400, 'Actual status code is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'NUM016', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ResultCode', 'Actual element_name is '+res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, "Assigning Toll Free DiDs by Area Code", 'Actual element_name is '+res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'No fax numbers available', 'Actual user_message is '+res.body.errors[0].user_message)
    })

    it('C21039: POST > Numbers > Validate that error message displayed for passed multiple area code which has no fax number available', async function () {
        delete number_requestBody.area_code
        number_requestBody.area_code = '999'
        number_requestBody.quantity = 1
        res = await requests.postNumbers(number_requestBody, userName)
        assert.equal(res.status, 404, 'Actual status code is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'USC040', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ResultCode', 'Actual element_name is '+res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'No fax numbers available.', 'Actual element_name is '+res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'No fax numbers available.', 'Actual user_message is '+res.body.errors[0].user_message)
    })

    it('C21042: POST > Numbers > Validate that error message should be displayed for not registered area code as toll free in database', async function () {
        delete number_requestBody.area_code
        number_requestBody.area_code = '811'
        number_requestBody.quantity = 1
        number_requestBody.toll_free = true
        res = await requests.postNumbers(number_requestBody, userName)
        assert.equal(res.status, 400, 'Actual status code is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'NUM016', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ResultCode', 'Actual element_name is '+res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, "Assigning Toll Free DiDs by Area Code", 'Actual element_name is '+res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'No fax numbers available', 'Actual user_message is '+res.body.errors[0].user_message)
    })

    it('C21042: POST > Numbers > Validate that error message should be displayed for not registered area code as toll free in database', async function () {
        delete number_requestBody.area_code
        number_requestBody.area_code = '999'
        number_requestBody.quantity = 1
        number_requestBody.toll_free = true
        res = await requests.postNumbers(number_requestBody, userName)
        assert.equal(res.status, 400, 'Actual status code is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'NUM016', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ResultCode', 'Actual element_name is '+res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, "Assigning Toll Free DiDs by Area Code", 'Actual element_name is '+res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'No fax numbers available', 'Actual user_message is '+res.body.errors[0].user_message)
    })

    it('C21046: POST > Numbers >  Validate that error message displayed for passed multiple toll_free area code which has no fax number available', async function () {
        delete number_requestBody.area_code
        number_requestBody.area_code = '999'
        number_requestBody.quantity = 1
        number_requestBody.toll_free = true
        res = await requests.postNumbers(number_requestBody, userName)
        assert.equal(res.status, 400, 'Actual status code is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'NUM016', 'Actual error_code is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ResultCode', 'Actual element_name is '+res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, "Assigning Toll Free DiDs by Area Code", 'Actual element_name is '+res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'No fax numbers available', 'Actual user_message is '+res.body.errors[0].user_message)
    })
})