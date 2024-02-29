/**
 * Import required packages
 */
require('mocha')

var config = require('config')
var assert = require('chai').assert

const requests = require('../../../common/setup/request')
const common_utils = require('../../../common/util/commonUtils')

const ssoGroupsPayload = require('../../../common/datasource/createSSOGroups')

const timeout = config.get('timeout')

describe('PATCH /sso/groups (+) - Validate response *sso* *end-to-end*', function () {
    this.timeout(timeout)
    let ssoGroupsRequestBody
    let oauth_group, group_name, group_description, updated_group_name, updated_group_description
    let res

    beforeEach(async function () {
        try {
            ssoGroupsRequestBody = ssoGroupsPayload.postSSOGroups()

            res = await requests.postSSOGroups(ssoGroupsRequestBody)
            oauth_group = res.body.oauth_group
            group_name = res.body.group_name
            group_description = res.body.group_description

            delete ssoGroupsRequestBody.oauth_group
            ssoGroupsRequestBody.group_name = common_utils.randString('group_name.updated ', 6)
            ssoGroupsRequestBody.group_description = common_utils.randString('group_description.updated ', 8)

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C31512: PATCH > SSO > Groups > Internal > sso oauth group > all possible properties > Validate SSO oauth group details are updated', async function () {
        updated_group_name = ssoGroupsRequestBody.group_name
        updated_group_description = ssoGroupsRequestBody.group_description

        res = await requests.patchSSOGroups({"group_name": updated_group_name, "group_description": updated_group_description}, oauth_group)
        assert.equal(res.status, 200, 'Actual status is ' + res.status)
        assert.equal(res.body.oauth_group, oauth_group, 'Actual oauth_group is '+res.body.oauth_group)
        assert.equal(res.body.group_name, updated_group_name, 'Actual group_name is '+res.body.group_name)
        assert.equal(res.body.group_description, updated_group_description, 'Actual group_description is '+res.body.group_description)
        //assert.exists(res.body.create_date, 'create_date not exist')
        assert.exists(res.body.update_date, 'update_date not exist')
    })

    it('C31513: PATCH > SSO > Groups > Internal > group_name > Validate SSO oauth group details are updated', async function () {
        updated_group_name = ssoGroupsRequestBody.group_name

        res = await requests.patchSSOGroups({"group_name": updated_group_name}, oauth_group)
        assert.equal(res.status, 200, 'Actual status is ' + res.status)
        assert.equal(res.body.oauth_group, oauth_group, 'Actual oauth_group is '+res.body.oauth_group)
        assert.equal(res.body.group_name, updated_group_name, 'Actual group_name is '+res.body.group_name)
        assert.equal(res.body.group_description, group_description, 'Actual group_description is '+res.body.group_description)
    })

    it('C31514: PATCH > SSO > Groups > Internal > group_description > Validate SSO oauth group details are updated', async function () {
        updated_group_description = ssoGroupsRequestBody.group_description

        res = await requests.patchSSOGroups({"group_description": updated_group_description}, oauth_group)
        assert.equal(res.status, 200, 'Actual status is ' + res.status)
        assert.equal(res.body.oauth_group, oauth_group, 'Actual oauth_group is '+res.body.oauth_group)
        assert.equal(res.body.group_name, group_name, 'Actual group_name is '+res.body.group_name)
        assert.equal(res.body.group_description, updated_group_description, 'Actual group_description is '+res.body.group_description)
    })

    afterEach(async function() {
        await requests.deleteSSOGroups(oauth_group)
    })
})