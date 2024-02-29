/**
 * Import required packages
 */
require('mocha')
require('../../common/util/testrail-util')

var config = require('config')
var assert = require('chai').assert

const requests = require('../../common/setup/request')
const createGroupsPayload = require('../../common/datasource/groups')

const timeout = config.get('timeout')

describe.skip('POST groups (+) - Verify response *end-to-end*', function () {
    this.timeout(timeout)
    let group_requestBody
    let res

    before(async function () {
        try {
            group_requestBody = createGroupsPayload.postGroups()

            
            // postGroupsAPIFalseDisabledSSO();
            // postGroupsAPIFalseDisabledSSO(inventory_status = 10)

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C37362: Post > Group > Create > Validate error message for GROUP NAME to be mandatory for the request sent *smoke*', async function () {
        delete group_requestBody.group_name
        res = await requests.postGroups(group_requestBody)
        assert.equal(res.status, 400, 'Actual status is ' + res.status)
    })

    it('C37363: Post > Group > Create > Validate error message for PARENT GROUP ID to be mandatory for the request sent *smoke*', async function () {
        delete group_requestBody.parent_group_id
        res = await requests.postGroups(group_requestBody)
        assert.equal(res.status, 400, 'Actual status is ' + res.status)
    })

    it('C37364: Post > Group > Create > Validate error message for INVENTORY STATUS to be mandatory for the request sent *smoke*', async function () {
        delete group_requestBody.inventory_status
        res = await requests.postGroups(group_requestBody)
        assert.equal(res.status, 400, 'Actual status is ' + res.status)
    })

    it('C37432: Post > Group > Create > Validate error message for DID LIMIT to be mandatory for the request sent *smoke*', async function () {
        group_requestBody.did_limit = 'I'
        delete group_requestBody.did_limit
        res = await requests.postGroups(group_requestBody)
        assert.equal(res.status, 400, 'Actual status is ' + res.status)
    })

    it('C37433: Post > Group > Create > Validate error message for "api_application.type" to be mandatory for the request sent *smoke*', async function () {
        group_requestBody.api_access = true
        delete group_requestBody.api_application.type
        res = await requests.postGroups(group_requestBody)
        assert.equal(res.status, 400, 'Actual status is ' + res.status)
    })

    it('C37434: Post > Group > Create > Validate error message for "sso_config.idp_sso_url" to be mandatory for the request sent *smoke*', async function () {
        group_requestBody.sso_enabled = true
        group_requestBody.enforce_sso = true
        delete group_requestBody.sso_config.idp_sso_url
        res = await requests.postGroups(group_requestBody)
        assert.equal(res.status, 400, 'Actual status is ' + res.status)
    })

    it('C37435: Post > Group > Create > Validate error message for "sso_config.idp_entity_id" to be mandatory for the request sent *smoke*', async function () {
        group_requestBody.sso_enabled = true
        group_requestBody.enforce_sso = true
        group_requestBody.sso_entityID = "dfasnflkasflkasnf";
        group_requestBody.sso_url =" https://do./dod.od"
        group_requestBody.sso_x509cert = " kfajfl;al;fal;f";
        group_requestBody.api_enable = true;
        group_requestBody.api_option ="API";

        group_requestBody.pfnp =true;
        group_requestBody.pfnp_value = 10;




        delete group_requestBody.sso_config.idp_entity_id
        res = await requests.postGroups(group_requestBody)
        assert.equal(res.status, 400, 'Actual status is ' + res.status)



        res = await requests.postGroups(group_requestBody_ssotrue())



    })

    it('C37436: Post > Group > Create > Validate error message for "sso_config.X509_cert" to be mandatory for the request sent *smoke*', async function () {
        group_requestBody.sso_enabled = true
        group_requestBody.enforce_sso = true
        delete group_requestBody.sso_config.X509_cert
        res = await requests.postGroups(group_requestBody)
        assert.equal(res.status, 400, 'Actual status is ' + res.status)
    })

    it('C37437: Post > Group > Create > Validate error message for UNASSIGNED FAX EMAIL to be mandatory for the request sent *smoke*', async function () {
        group_requestBody.inventory_status = 'I'
        delete group_requestBody.unassigned_fax_email
        res = await requests.postGroups(group_requestBody)
        assert.equal(res.status, 400, 'Actual status is ' + res.status)
    })

    it('C37518: Post > Group > Create > Validate error message when type is wrong for group_name in the request sent *smoke*', async function () {
        group_requestBody.group_name = 123
        res = await requests.postGroups(group_requestBody)
        assert.equal(res.status, 400, 'Actual status is ' + res.status)
    })

    it('C37519: Post > Group > Create > Validate error message when type is wrong for "api_access" in the request sent *smoke*', async function () {
        group_requestBody.api_access = 'Not a boolean'
        res = await requests.postGroups(group_requestBody)
        assert.equal(res.status, 400, 'Actual status is ' + res.status)
    })

    it('C37520: Post > Group > Create > Validate error message when type is wrong for "inventory_status" in the request sent *smoke*', async function () {
        group_requestBody.inventory_status = 'Not an Integer'
        res = await requests.postGroups(group_requestBody)
        assert.equal(res.status, 400, 'Actual status is ' + res.status)
    })

    after(async function () {

    })
})