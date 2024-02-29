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
const common_utils = require('../../common/util/commonUtils')
const db_util = require('../../common/util/db/dbcallfunc')
const dateFormat = require('dateformat')
const delay = ms => new Promise(res => setTimeout(res, ms))

const timeout = config.get('timeout')

describe('POST users (+ve) - Verify new user created *end-to-end*', function () {
    this.timeout(timeout)
    let par_group_name, child_group_name
    let par_requestBody, child_requestBody, user_requestBody
    let par_app_id, child_app_id, customer_key1, customer_key2, fax_number1, fax_number2
    let admin_id = config.get('admin.corp_id')
    let userName = config.get('admin.username')
    let res

    before(async function () {
        try {
            par_group_name = "My Account\\Avijit Test Automation"
            par_requestBody = applicationsPayload.postApplications(admin_id, par_group_name)

            res = await requests.postApplications(par_requestBody)
            par_app_id = res.body.app_id
            console.log("Parent app_id is " + par_app_id)

            child_group_name = "My Account\\Avijit Test Automation\\Child Group Test"
            child_requestBody = applicationsPayload.postApplications(admin_id, child_group_name)

            res = await requests.postApplications(child_requestBody)
            child_app_id = res.body.app_id
            console.log("Child app_id is " + child_app_id)

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C5119: POST > Users > Validated that new user is created for existing application and fax number is assigned to user *smoke*', async function () {
        user_requestBody = usersPayload.postUsers(par_app_id, par_group_name)
        user_requestBody.user.email_address = common_utils.randEmail()

        res = await requests.postUsers(user_requestBody, userName, admin_id)
        assert.equal(res.status, 201, 'Actual status is ' + res.status)
        customer_key1 = res.body.fax_numbers[0].customer_key
        fax_number1 = res.body.fax_numbers[0].fax_number
        assert.isString(res.body.fax_numbers[0].fax_number, 'fax_number is not generated')
        assert.equal(res.body.fax_numbers[0].group_name, par_group_name, 'group_name is not same as created Applications par_group_name')
        assert.equal(res.body.fax_numbers[0].account_id, admin_id, 'Actual account_id is ' + res.body.fax_numbers[0].account_id)
        assert.isNumber(res.body.fax_numbers[0].customer_key, 'customer_key is not generated')
    })

    it('C7294: POST > Users >  Create User For Sub Group > Validate user is created for a sub group', async function () {
        user_requestBody = usersPayload.postUsers(child_app_id, child_group_name)
        user_requestBody.user.email_address = common_utils.randEmail()

        res = await requests.postUsers(user_requestBody, userName, admin_id)
        assert.equal(res.status, 201, 'Actual status is ' + res.status)
        customer_key2 = res.body.fax_numbers[0].customer_key
        fax_number2 = res.body.fax_numbers[0].fax_number
        assert.isString(res.body.fax_numbers[0].fax_number, 'fax_number is not generated')
        assert.equal(res.body.fax_numbers[0].group_name, child_group_name, 'group_name is not same as created Applications child_group_name')
        assert.equal(res.body.fax_numbers[0].account_id, admin_id, 'Actual account_id is ' + res.body.fax_numbers[0].account_id)
        assert.isNumber(res.body.fax_numbers[0].customer_key, 'customer_key is not generated')
    })

    after(async function () {
        await requests.delApplications(child_app_id, child_requestBody)
        await requests.delApplications(par_app_id, par_requestBody)
    })
})

describe('POST users (+ve) - Verify new user created *end-to-end*', function () {
    this.timeout(timeout)
    let group_name
    let appRequestBody, userRequestBody
    let app_id, fax_number
    let admin_id = config.get('admin.corp_id')
    let userName = config.get('admin.username')
    let res

    before(async function () {
        try {
            group_name = "My Account\\Avijit Test Automation"
            appRequestBody = applicationsPayload.postApplications(admin_id, group_name)

            res = await requests.postApplications(appRequestBody)
            app_id = res.body.app_id
            console.log("app_id is " + app_id)

            userRequestBody = usersPayload.postUsers(app_id, group_name)

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C29399: POST > Users > Validate successful user information displayed if send_enabled and received_enabled are not passed *smoke*', async function () {
        userRequestBody.user.email_address = common_utils.randEmail()

        res = await requests.postUsers(userRequestBody, userName, admin_id)
        assert.equal(res.status, 201, 'Actual status is ' + res.status)
        fax_number = res.body.fax_numbers[0].fax_number
        assert.exists(res.body.fax_numbers[0].fax_number, 'fax_number has no content')
        assert.equal(res.body.fax_numbers[0].account_id, admin_id, 'account_id does not exist')
        assert.isNumber(res.body.fax_numbers[0].customer_key, 'customer_key does not exist')
        assert.equal(res.body.fax_numbers[0].group_name, group_name, 'group_name does not exist')
    })

    it('C32031: POST > Users > set send_enabled to true and receive_enabled to false > Validate fax_numbers has content with null values *smoke*', async function () {
        userRequestBody.user.send_enabled = true
        userRequestBody.user.receive_enabled = false
        userRequestBody.user.email_address = common_utils.randEmail()

        res = await requests.postUsers(userRequestBody, userName, admin_id)
        assert.equal(res.status, 201, 'Actual status is ' + res.status)
        assert.equal(res.body.user.account_id, admin_id, 'account_id does not exist')
        assert.isNumber(res.body.user.customer_key, 'customer_key does not exist')
        assert.equal(res.body.user.group_name, group_name, 'group_name does not exist')
    })

    it('C29401: POST > Users >  Validate No app_id and secret if only send_enabled set to true and receive_enabled set to false *smoke*', async function () {
        userRequestBody.user.send_enabled = true
        userRequestBody.user.receive_enabled = false
        userRequestBody.user.email_address = common_utils.randEmail()

        res = await requests.postUsers(userRequestBody, userName, admin_id)
        assert.equal(res.status, 201, 'Actual status is ' + res.status)
        assert.isEmpty(res.body.fax_numbers, 'fax_number has content')
    })

    after(async function () {
        await requests.delApplications(app_id, appRequestBody)
    })
})

describe('POST /applications after patch- Validate response *end-to-end*', function () {
    this.timeout(timeout)
    let par_group_name, child_group_name
    let par_appRequestBody, child_appRequestBody, user_requestBody
    let par_app_id, child_app_id, customer_key, fax_number
    let admin_id = config.get('admin.corp_id')
    let userName = config.get('admin.username')
    let res

    before(async function () {
        try {
            par_group_name = "My Account\\Avijit Test Automation"
            par_appRequestBody = applicationsPayload.postApplications(admin_id, par_group_name)

            child_group_name = "My Account\\Avijit Test Automation\\Child Group Test"

            res = await requests.postApplications(par_appRequestBody)
            par_app_id = res.body.app_id
            console.log("Parent app_id is " + par_app_id)

            par_appRequestBody.group_name = child_group_name
            res = await requests.patchApplications(par_app_id, par_appRequestBody, admin_id)
            child_app_id = res.body.app_id

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C30133: POST > Users >  Validate success while post users with child_group_name after post application with parent group followed by patch application with child_group', async function () {
        user_requestBody = usersPayload.postUsers(child_app_id, child_group_name)
        user_requestBody.user.email_address = common_utils.randEmail()
        res = await requests.postUsers(user_requestBody, userName, admin_id)
        assert.equal(res.status, 201, 'Actual status is ' + res.status)
        customer_key = res.body.fax_numbers[0].customer_key
        fax_number = res.body.fax_numbers[0].fax_number
    })

    after(async function () {
        await requests.delApplications(child_app_id, child_appRequestBody)
        await requests.delApplications(par_app_id, par_appRequestBody)
    })
})

describe('POST /users (US Region) - Validate user response *us*', function () {
    this.timeout(timeout)
    let group_name
    let app_requestBody, user_requestBody
    let app_id
    let admin_id = config.get('admin.corp_id')
    let userName = config.get('admin.username')
    let res

    before(async function () {
        try {
            group_name = "My Account\\Avijit Test Automation"
            app_requestBody = applicationsPayload.postApplications(admin_id, group_name)

            res = await requests.postApplications(app_requestBody)
            app_id = res.body.app_id
            console.log("app_id is " + app_id)

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C30143: POST > Users > Validate able to create user corresponding to post applications with US corp_id', async function () {
        user_requestBody = usersPayload.postUsers(app_id, group_name)
        user_requestBody.user.email_address = common_utils.randEmail()
        res = await requests.postUsers(user_requestBody, userName, admin_id)
        assert.equal(res.status, 201, 'Actual status is ' + res.status)
    })

    after(async function () {
        await requests.delApplications(app_id, app_requestBody)
    })
})

describe('POST /users (CA Region) - Validate user response *ca*', function () {
    this.timeout(timeout)
    let group_name
    let app_requestBody, user_requestBody
    let app_id
    let admin_id = config.get('admin.corp_id')
    let userName = config.get('admin.username')
    let res

    before(async function () {
        try {
            group_name = "My Account\\Avijit Test Automation"
            app_requestBody = applicationsPayload.postApplications(admin_id, group_name)

            console.log(admin_id)
            res = await requests.postApplications(app_requestBody)
            app_id = res.body.app_id
            console.log("app_id is " + app_id)

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C30144: POST > Users > Validate able to create user corresponding to post applications with CA corp_id', async function () {
        user_requestBody = usersPayload.postUsers(app_id, group_name)
        user_requestBody.user.email_address = common_utils.randEmail()
        res = await requests.postUsers(user_requestBody, userName, admin_id)
        assert.equal(res.status, 201, 'Actual status is ' + res.status)
    })

    after(async function () {
        await requests.delApplications(app_id, app_requestBody)
    })
})

describe('POST /users (EU Region) - Validate user response *eu*', function () {
    this.timeout(timeout)
    let group_name
    let app_requestBody, user_requestBody
    let app_id
    let admin_id = config.get('admin.corp_id')
    let userName = config.get('admin.username')
    let res

    before(async function () {
        try {
            group_name = "My Account\\Avijit Test Automation"
            app_requestBody = applicationsPayload.postApplications(admin_id, group_name)

            res = await requests.postApplications(app_requestBody)
            app_id = res.body.app_id
            console.log("app_id is " + app_id)

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C30145: POST > Users > Validate able to create user corresponding to post applications with EU corp_id', async function () {
        user_requestBody = usersPayload.postUsers(app_id, group_name)
        user_requestBody.user.email_address = common_utils.randEmail()
        res = await requests.postUsers(user_requestBody, userName, admin_id)
        assert.equal(res.status, 201, 'Actual status is ' + res.status)
    })

    after(async function () {
        await requests.delApplications(app_id, app_requestBody)
    })
})

describe('POST /users (AU Region) - Validate user response *au*', function () {
    this.timeout(timeout)
    let group_name
    let app_requestBody, user_requestBody
    let app_id
    let admin_id = config.get('admin.corp_id')
    let userName = config.get('admin.username')
    let res

    before(async function () {
        try {
            group_name = "My Account\\Avijit Test Automation"
            app_requestBody = applicationsPayload.postApplications(admin_id, group_name)

            res = await requests.postApplications(app_requestBody)
            app_id = res.body.app_id
            console.log("app_id is " + app_id)

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C30146: POST > Users > Validate able to create user corresponding to post applications with AU corp_id', async function () {
        user_requestBody = usersPayload.postUsers(app_id, group_name)
        user_requestBody.user.email_address = common_utils.randEmail()
        res = await requests.postUsers(user_requestBody, userName, admin_id)
        assert.equal(res.status, 201, 'Actual status is ' + res.status)
    })

    after(async function () {
        await requests.delApplications(app_id, app_requestBody)
    })
})

describe.skip('DB check users update_date after deleting users (+ve) - Verify database field *end-to-end*', function () {
 
     this.timeout(timeout)
     let group_name
     let app_requestBody, user_requestBody
     let app_id, user_id, customer_key, fax_number
     let orig_created_date, orig_updated_date, changed_created_date, changed_updated_date
     let admin_id = config.get('admin.corp_id')
     let userName = config.get('admin.username')
     let todayDate = new Date().toUTCString().substr(0, 16)
     let query1 = `select created from pf_gateway_users where user_id = :user_id`
     let query2 = `select updated from pf_gateway_users where user_id = :user_id`

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
             customer_key = res.body.fax_numbers[0].customer_key
             fax_number = res.body.fax_numbers[0].fax_number
             user_id = res.body.fax_numbers[0].user_id
 
             orig_created_date = await db_util.retrievepfgatewayusersdata(user_id, query1)
             console.log('Original Created value is '+orig_created_date)
 
             orig_updated_date = await db_util.retrievepfgatewayusersdata(user_id, query2)
             console.log('Original Updated value is '+orig_updated_date)
 
             let query3 = `update pf_gateway_users set created = ` + `'`+common_utils.pastDate(2, "dd-mmm-yy")+`'` + ` where user_id = :user_id`
             await db_util.retrievepfgatewayusersdata(user_id, query3)
             changed_created_date = await db_util.retrievepfgatewayusersdata(user_id, query1)
             console.log('Changed Created value is '+changed_created_date)

             let query4 = `update pf_gateway_users set updated = ` + `'`+common_utils.pastDate(1, "dd-mmm-yy")+`'` + ` where user_id = :user_id`
             await db_util.retrievepfgatewayusersdata(user_id, query4)
             changed_updated_date = await db_util.retrievepfgatewayusersdata(user_id, query2)
             console.log('Changed Updated value is '+changed_updated_date)
 
         } catch (e) {
             console.log(e)
             console.log(res.body)
         }
     })
 
     it('C33313: DB > Update Date > Validate If a user is inactivated, the updatedDate should reflect the most recent date of the action *smoke*', async function () {
         res = await requests.deleteUsersApiUsersFaxNumber(fax_number, app_id)
         assert.equal(res.status, 204, 'Actual status is ' + res.status)
         await delay(300)
         
         let actual_updated_date = await db_util.retrievepfgatewayusersdata(user_id, query2)
         assert.equal(new Date(actual_updated_date).toUTCString().substr(0, 16), todayDate, 'UPDATED value in database is not today date')
     })
 
     after(async function () {
         await requests.delApplications(app_id, app_requestBody)
     })
 })

 describe('DB check users update_date after deleting applications (+ve) - Verify database field *end-to-end*', function () {
 
    this.timeout(timeout)
    let group_name
    let app_requestBody, user_requestBody
    let app_id, user_id, customer_key, fax_number
    let orig_app_created_date, orig_app_updated_date, changed_app_created_date, changed_app_updated_date
    let orig_users_created_date, orig_users_updated_date, changed_users_created_date, changed_users_updated_date
    let admin_id = config.get('admin.corp_id')
    let userName = config.get('admin.username')
    let todayDate = new Date().toUTCString().substr(0, 16)
    let query1 = `select created from pf_gateway_applications where reseller_id = :reseller_id and app_id = :app_id`
    let query2 = `select updated from pf_gateway_applications where reseller_id = :reseller_id and app_id = :app_id`
    let query3 = `select created from pf_gateway_users where user_id = :user_id`
    let query4 = `select updated from pf_gateway_users where user_id = :user_id`

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
            customer_key = res.body.fax_numbers[0].customer_key
            fax_number = res.body.fax_numbers[0].fax_number
            user_id = res.body.fax_numbers[0].user_id

            orig_app_created_date = await db_util.retrievepfgatewayapplicationssdata(app_id, admin_id, query1)
            console.log('Original applications Created value is '+orig_app_created_date)

            orig_app_updated_date = await db_util.retrievepfgatewayapplicationssdata(app_id, admin_id, query2)
            console.log('Original applications Updated value is '+orig_app_updated_date)

            orig_users_created_date = await db_util.retrievepfgatewayusersdata(user_id, query3)
            console.log('Original users Created value is '+orig_users_created_date)

            orig_users_updated_date = await db_util.retrievepfgatewayusersdata(user_id, query4)
            console.log('Original users Updated value is '+orig_users_updated_date)

            let query5 = `update pf_gateway_applications set created = ` + `'`+common_utils.pastDate(2, "dd-mmm-yy")+`'` + ` where reseller_id = :reseller_id and app_id = :app_id`
            await db_util.retrievepfgatewayapplicationssdata(app_id, admin_id, query5)
            changed_app_created_date = await db_util.retrievepfgatewayapplicationssdata(app_id, admin_id, query5)
            console.log('Changed applications Created value is '+changed_app_created_date)

            let query6 = `update pf_gateway_applications set updated = ` + `'`+common_utils.pastDate(1, "dd-mmm-yy")+`'` + ` where reseller_id = :reseller_id and app_id = :app_id`
            await db_util.retrievepfgatewayapplicationssdata(app_id, admin_id, query6)
            changed_app_updated_date = await db_util.retrievepfgatewayapplicationssdata(app_id, admin_id, query6)
            console.log('Changed applications Updated value is '+changed_app_updated_date)

            let query7 = `update pf_gateway_users set created = ` + `'`+common_utils.pastDate(2, "dd-mmm-yy")+`'` + ` where user_id = :user_id`
            await db_util.retrievepfgatewayusersdata(user_id, query7)
            changed_users_created_date = await db_util.retrievepfgatewayusersdata(user_id, query7)
            console.log('Changed users Created value is '+changed_users_created_date)

            let query8 = `update pf_gateway_users set updated = ` + `'`+common_utils.pastDate(1, "dd-mmm-yy")+`'` + ` where user_id = :user_id`
            await db_util.retrievepfgatewayusersdata(user_id, query8)
            changed_users_updated_date = await db_util.retrievepfgatewayusersdata(user_id, query8)
            console.log('Changed users Updated value is '+changed_users_updated_date)

        } catch (e) {
            console.log(e)
            console.log(res.body)
        }
    })

    it('C33314: DB > Update Date > Validate If an application is inactivated, the user updatedDate should also reflect the same value as the application updated date *smoke*', async function () {
        res = await requests.delApplications(app_id, app_requestBody)
        assert.equal(res.status, 204, 'Actual status is ' + res.status)
        await delay(300)
        
        let actual_users_updated_date = await db_util.retrievepfgatewayusersdata(user_id, query4)
        assert.equal(new Date(actual_users_updated_date).toUTCString().substr(0, 16), todayDate, 'users UPDATED value in database is not today date')
    })

    after(async function () {
        await requests.delApplications(app_id, app_requestBody)
    })
})