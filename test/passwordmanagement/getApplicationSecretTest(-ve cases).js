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
const common_utils = require('../../common/util/commonUtils')

const timeout = config.get('timeout')

describe('GET /applications/app_id/secrets (-) - Validate response *end-to-end*', function () {
    this.timeout(timeout)
    let randGuid, access_token
    let res
    let userName = config.get('admin.username')
    let password = config.get('admin.password')

    before(async function () {
        try {
            res = await requests.postOauthToken(userName, password)
            access_token = res.body.access_token

            randGuid = common_utils.createGUID()

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C23184: GET Applications > Secrets > External - Validate no secrets returned passing not existing app-id *regression*', async function () {
        res = await requests.getApplicationsAppIdSecretsExt(randGuid, access_token)
        assert.equal(res.status, 404, 'Actual Status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'APP007', 'Actual error_coe is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ResultCode', 'Actual element_name is ' +res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'Application does not exist.', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Application does not exist.', 'Actual user_message is ' +res.body.errors[0].user_message)
    })

    it('C20977: GET Applications > Secrets > Internal - Validate no secrets returned passing not existing app-id *regression*', async function () {
        res = await requests.getApplicationsAppIdSecrets(randGuid)
        assert.equal(res.status, 404, 'Actual Status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'APP007', 'Actual error_coe is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ResultCode', 'Actual element_name is ' +res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'Application does not exist.', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Application does not exist.', 'Actual user_message is ' +res.body.errors[0].user_message)
    })

    it('C20978: GET Applications > Secrets > Internal -  Validate no secrets returned passing empty app-id *regression*', async function () {
        res = await requests.getApplicationsAppIdSecrets(``)
        assert.equal(res.status, 404, 'Actual Status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'APP007', 'Actual error_coe is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ResultCode', 'Actual element_name is ' +res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'Application does not exist.', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Application does not exist.', 'Actual user_message is ' +res.body.errors[0].user_message)
    })

    it('C23185: GET Applications > Secrets > External -  Validate no secrets returned passing empty app-id *regression*', async function () {
        res = await requests.getApplicationsAppIdSecretsExt(``, access_token)
        assert.equal(res.status, 404, 'Actual Status is '+res.status)
        assert.equal(res.body.errors[0].error_code, 'APP007', 'Actual error_coe is '+res.body.errors[0].error_code)
        assert.equal(res.body.errors[0].element_name, 'ResultCode', 'Actual element_name is ' +res.body.errors[0].element_name)
        assert.equal(res.body.errors[0].developer_message, 'Application does not exist.', 'Actual developer_message is ' + res.body.errors[0].developer_message)
        assert.equal(res.body.errors[0].user_message, 'Application does not exist.', 'Actual user_message is ' +res.body.errors[0].user_message)
    })
})