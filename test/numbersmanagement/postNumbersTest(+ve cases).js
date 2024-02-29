/**
 * Import required packages
 */
require('mocha')
require('../../common/util/testrail-util')

var config = require('config')
var assert = require('chai').assert

const requests = require('../../common/setup/request')
const numberPayload = require('../../common/datasource/createNumber')
const commonService = require('../../common/setup/service')

const timeout = config.get('timeout')

describe('POST numbers (+) - Verify response *end-to-end*', function () {
    this.timeout(timeout)
    let number_requestBody
    let res
    let userName = config.get('admin.username')

    beforeEach(async function () {
        number_requestBody = numberPayload.postNumbers()   
    })

    it.skip('C19487: POST > Numbers > Validate that unassigned fax number return properly for toll free area code', async function () {
        delete number_requestBody.area_code
        number_requestBody.area_code = '833'
        number_requestBody.toll_free = true
        number_requestBody.region = 'US'  
        res = await requests.postNumbers(number_requestBody, userName)
        assert.equal(res.status, 200, 'Actual status code is '+res.status)
        assert.equal(res.body.quantity, 2, 'Actual quantity are '+res.body.quantity)
        assert.isBelow(commonService.resArrayLength(res.body.numbers), 3, 'Actual numbers array length are ' + commonService.resArrayLength(res.body.numbers) + ' in length')
    })

    it('C19488: POST > Numbers > Validate that random any one unassigned fax number should return if area code is not mentioned', async function () {
        delete number_requestBody.area_code
        number_requestBody.toll_free = true
        number_requestBody.region = 'US'  
        res = await requests.postNumbers(number_requestBody, userName)
        assert.equal(res.status, 200, 'Actual status code is '+res.status)
        assert.equal(res.body.quantity, 2, 'Actual quantity are '+res.body.quantity)
        assert.isBelow(commonService.resArrayLength(res.body.numbers), 3, 'Actual numbers array length are ' + commonService.resArrayLength(res.body.numbers) + ' in length')
    })

    //Skipping this as list of unassigned numbers based on area_code is not under our control 
    it.skip('C7293: POST > Numbers > Validate the list of unassigned numbers displayed for a area code and city', async function () {
        delete number_requestBody.area_code
        number_requestBody.area_code = '204'
        number_requestBody.city = 'Portage La Prairie'
        number_requestBody.region = 'CA'
        res = await requests.postNumbers(number_requestBody, userName)
        assert.equal(res.status, 200, 'Actual status code is '+res.status)
        assert.equal(res.body.quantity, 2, 'Actual quantity are '+res.body.quantity)
        assert.isBelow(commonService.resArrayLength(res.body.numbers), 3, 'Actual numbers array length are ' + commonService.resArrayLength(res.body.numbers) + ' in length')
    })

    it('C20896: POST > Numbers > Validate that fax number return for passed multiple area code', async function () {
        delete number_requestBody.area_code
        number_requestBody.area_code = '800, 855'
        number_requestBody.toll_free = true
        number_requestBody.region = 'US'
        res = await requests.postNumbers(number_requestBody, userName)
        assert.equal(res.status, 200, 'Actual status code is '+res.status)
        assert.equal(res.body.quantity, 2, 'Actual quantity are '+res.body.quantity)
        assert.isBelow(commonService.resArrayLength(res.body.numbers), 3, 'Actual numbers array length are ' + commonService.resArrayLength(res.body.numbers) + ' in length')
    })

    it('C20922: POST > Numbers > Validate that unassigned fax number return based on the first preference for non- toll free area code', async function () {
        delete number_requestBody.area_code
        number_requestBody.area_code = '310, 251'
        res = await requests.postNumbers(number_requestBody, userName)
        assert.equal(res.status, 200, 'Actual status code is '+res.status)
        assert.equal(res.body.quantity, 2, 'Actual quantity are '+res.body.quantity)
        assert.isBelow(commonService.resArrayLength(res.body.numbers), 3, 'Actual numbers array length are ' + commonService.resArrayLength(res.body.numbers) + ' in length')
    })

    it('C20923: POST > Numbers >  Validate that return fax number for listed second and other area code if first listed area code has no fax number available', async function () {
        delete number_requestBody.area_code
        number_requestBody.area_code = '976, 251'
        res = await requests.postNumbers(number_requestBody, userName)
        assert.equal(res.status, 200, 'Actual status code is '+res.status)
        assert.equal(res.body.quantity, 2, 'Actual quantity are '+res.body.quantity)
        assert.isBelow(commonService.resArrayLength(res.body.numbers), 3, 'Actual numbers array length are ' + commonService.resArrayLength(res.body.numbers) + ' in length')
    })

    it('C20924: POST > Numbers >  Validate that unassigned fax number return based on first preference for listed toll free area code', async function () {
        delete number_requestBody.area_code
        number_requestBody.quantity = 1
        number_requestBody.area_code = '800, 888'
        res = await requests.postNumbers(number_requestBody, userName)
        assert.equal(res.status, 200, 'Actual status code is '+res.status)
        assert.equal(res.body.quantity, 1, 'Actual quantity are '+res.body.quantity)
        assert.isBelow(commonService.resArrayLength(res.body.numbers), 2, 'Actual numbers array length are ' + commonService.resArrayLength(res.body.numbers) + ' in length')
    })

    it.skip('C20925: POST > Numbers >  Validate that unassigned fax number return for second preference toll free area code if first preference area code has no fax number available', async function () {
        delete number_requestBody.area_code
        number_requestBody.quantity = 1
        number_requestBody.area_code = '833, 888'
        res = await requests.postNumbers(number_requestBody, userName)
        assert.equal(res.status, 200, 'Actual status code is '+res.status)
        assert.equal(res.body.quantity, 1, 'Actual quantity are '+res.body.quantity)
        assert.isBelow(commonService.resArrayLength(res.body.numbers), 2, 'Actual numbers array length are ' + commonService.resArrayLength(res.body.numbers) + ' in length')
    })

    it('C20926: POST > Numbers >  Validate that for toll free element only return toll free area code fax number return in response', async function () {
        delete number_requestBody.area_code
        number_requestBody.quantity = 1
        number_requestBody.toll_free = true
        number_requestBody.area_code = '310, 800, 855'
        res = await requests.postNumbers(number_requestBody, userName)
        assert.equal(res.status, 200, 'Actual status code is '+res.status)
        assert.equal(res.body.quantity, 1, 'Actual quantity are '+res.body.quantity)
        assert.isBelow(commonService.resArrayLength(res.body.numbers), 2, 'Actual numbers array length are ' + commonService.resArrayLength(res.body.numbers) + ' in length')
    })
})