/**
 * Import required packages
 */
var config = require('config')
var endpoint = require('../endpoint')
var request = require('supertest')

/*
 * Set global variables
 */
const baseurl = config.get('base.url')
const proxyurl = config.get('base.proxy')
const intUrl = request(baseurl + proxyurl)
const extUrl = request(baseurl)

/**
 * Set endpoints used in tests
 */
const applicationsEndpoint = endpoint.core.applications
const applicationsAppIdEndpoint = endpoint.core.applicationsAppId
const applicationsAppIdRefreshEndpoint = endpoint.core.applicationsAppIdRefresh
const applicationsAppIdDefaultsEndpoint = endpoint.core.applicationsAppIdDefaults
const applicationsAppIdDefaultsDefaultNameEndpoint = endpoint.core.applicationsAppIdDefaultsDefaultName
const usersEndpoint = endpoint.core.users
const applicationsAppIdUsersEndpoint = endpoint.core.applicationsAppIdUsers
const applicationsAppIdSecretsEndpoint = endpoint.core.applicationsAppIdSecrets
const applicationsAppIdSecretsSecretIdEndpoint = endpoint.core.applicationsAppIdSecretsSecretId
const applicationsDefaultsNamesEndpoint = endpoint.core.applicationsDefaultsNames
const applicationsDefaultsNamesIdEndpoint = endpoint.core.applicationsDefaultsNamesId
const usersCustomerKeyEndpoint = endpoint.core.usersCustomerKey
const usersCustomerKeySSOEndpoint = endpoint.core.usersCustomerKeySSO
const userFaxNumberEndpoint = endpoint.core.userFaxNumber
const usersApiUsersUserIdEndpoint = endpoint.core.usersApiUsersUserId
const usersApiUsersuserIdRefreshEndpoint = endpoint.core.usersApiUsersuserIdRefresh
const usersApiUsersUserIdDefaultsEndpoint = endpoint.core.usersApiUsersUserIdDefaults
const usersApiUsersUserIdDefaultsDefaultNameEndpoint = endpoint.core.usersApiUsersUserIdDefaultsDefaultName
const numbersEndpoint = endpoint.core.numbers
const numbersFaxNumbersEndpoint = endpoint.core.numbersFaxNumbers
const numbersUnassignedEndpoint = endpoint.core.numbersUnassigned
const numbersAssignedEndpoint = endpoint.core.numbersAssigned
const usersApiUsersFaxNumberEndpoint = endpoint.core.usersApiUsersFaxNumber
const applicationAppIdNotificationEndpoint = endpoint.core.applicationAppIdNotification
const applicationAppIdNotificationNotificationIdEndpoint = endpoint.core.applicationAppIdNotificationNotificationId
const applicationsAppIdNotificationsNotifyIdAuthEndpoint = endpoint.core.applicationsAppIdNotificationsNotifyIdAuth
const applicationsAppIdNotificationsNotifyIdAuthNotifyAuthIdEndpoint = endpoint.core.applicationsAppIdNotificationsNotifyIdAuthNotifyAuthId
const healthEndpoint = endpoint.core.health
const citiesAreaCodeEndpoint = endpoint.core.citiesAreaCode
const oauthTokenEndpoint = endpoint.core.oauthToken
const groupsEndpoint = endpoint.core.groups
const ssoConfigsEndpoint = endpoint.sso.ssoConfigs
const ssoConfigsSsoConfigIdEndpoint = endpoint.sso.ssoConfigsSsoConfigId
const ssoUsersEndpoint = endpoint.sso.ssoUsers
const ssoUsersCustomerKeyEndpoint = endpoint.sso.ssoUsersCustomerKey
const ssoUsersSsoUserIdEndpoint = endpoint.sso.ssoUsersSsoUserId
const ssoGroupsEndpoint = endpoint.sso.ssoGroups
const ssoGroupsOauthGroupEndpoint = endpoint.sso.ssoGroupsOauthGroup
const ssoApplicationsEndpoint = endpoint.sso.ssoApplications
const ssoApplicationsClientIdEndpoint = endpoint.sso.ssoApplicationsClientId
const ssoApplicationsClientIdResetSecretEndpoint = endpoint.sso.ssoApplicationsClientIdResetSecret

/**
 * Set headers used in tests
 */
const headers = {
    'Content-Type': 'application/json',
    'admin-id': config.get('admin.corp_id'),
    'admin-username': config.get('admin.username'),
    'admin-password': config.get('admin.password')
}

/**
 * User defined functions used in tests
 */
module.exports = {
    postApplications: async function (requestBody) {
        console.log("\t Post Applications")
        let result = await intUrl.post(applicationsEndpoint)
            .send(requestBody)
        return result
    },

    postApplicationsExt: async function (requestBody, access_token, admin_username) {
        console.log("\t Post Applications with Authorization")
        let result = await intUrl.post(applicationsEndpoint)
            .set(Object.assign(headers, {
                'Authorization': 'Bearer ' + access_token,
                'admin-username': admin_username
            }))
            .send(requestBody)

        return result
    },

    postApplicationsAppIdSecrets: async function (app_id, requestBody, admin_id) {
        console.log("\t Post Applications AppId Secrets")
        let applicationsAppIdSecrets = applicationsAppIdSecretsEndpoint.replace('{app_id}', app_id)
        let result = await intUrl.post(applicationsAppIdSecrets)
            .set({
                'Content-Type': 'application/json',
                'admin-id': admin_id,
                'admin-username': config.get('admin.username'),
                'admin-password': config.get('admin.password')
            })
            .send(requestBody)

        return result
    },

    postApplicationsAppIdSecretsExt: async function (app_id, requestBody, access_token, admin_username) {
        console.log("\t Post Applications AppId Secrets with Authorization")
        let applicationsAppIdSecrets = applicationsAppIdSecretsEndpoint.replace('{app_id}', app_id)
        let result = await extUrl.post(applicationsAppIdSecrets)
            .set(Object.assign(headers, {
                'Authorization': 'Bearer ' + access_token,
                'admin-username': admin_username,
            }))
            .send(requestBody)

        return result
    },

    postApplicationsDefaultsNames: async function (requestBody) {
        console.log('\t Post Applications Default Names')
        let result = await intUrl.post(applicationsDefaultsNamesEndpoint)
            .set(headers)
            .send(requestBody)

        return result
    },

    patchApplications: async function (app_id, requestBody, admin_id) {
        console.log("\t Patch Applications")
        let applicationsAppId = applicationsAppIdEndpoint.replace('{app_id}', app_id)
        let result = await intUrl.patch(applicationsAppId)
            .set({ 'admin-id': admin_id })
            .send(requestBody)

        return result
    },

    patchApplicationsAppIdSecretsSecretId: async function (app_id, requestBody, secret_id, admin_id) {
        console.log("\t Patch Applications app_id Secrets with secret_id")
        let applicationsAppIdSecretsSecretId = applicationsAppIdSecretsSecretIdEndpoint.replace('{app_id}', app_id).replace('{secret_id}', secret_id)
        let result = await intUrl.patch(applicationsAppIdSecretsSecretId)
            .set({
                'Content-Type': 'application/json',
                'admin-id': admin_id,
                'admin-username': config.get('admin.username'),
                'admin-password': config.get('admin.password')
            })
            .send(requestBody)

        return result
    },

    patchApplicationsAppIdSecretsSecretIdExt: async function (app_id, requestBody, access_token, secret_id, admin_id) {
        console.log("\t Patch Applications app_id Secrets with secret_id with Authorization")
        let applicationsAppIdSecretsSecretId = applicationsAppIdSecretsSecretIdEndpoint.replace('{app_id}', app_id).replace('{secret_id}', secret_id)
        let result = await intUrl.patch(applicationsAppIdSecretsSecretId)
            .set(Object.assign(headers, {
                'Authorization': 'Bearer ' + access_token,
                'admin-id': admin_id
            }))
            .send(requestBody)

        return result
    },

    putApplicationsAppIdRefresh: async function (app_id) {
        console.log('\t Put Applications corresponnding to app_id and then refresh')
        let applicationsAppIdRefresh = applicationsAppIdRefreshEndpoint.replace('{app_id}', app_id)
        if (app_id != undefined) {
            let result = await intUrl.put(applicationsAppIdRefresh)
                .set({
                    'Content-Type': 'application/json',
                    'admin-id': config.get('admin.corp_id'),
                    'admin-username': config.get('admin.username'),
                    'admin-password': config.get('admin.password'),
                    'app-id': app_id
                })

            return result
        }
        else {
            let result = await intUrl.put(applicationsAppIdRefresh)
                .set(headers)

            return result
        }
    },

    delApplications: async function (app_id, requestBody) {
        console.log("\t Delete Applications")
        let applicationsAppId = applicationsAppIdEndpoint.replace('{app_id}', app_id)
        let result = await intUrl.delete(applicationsAppId)
            .send(requestBody)

        return result
    },

    delApplicationsExt: async function (app_id, requestBody, access_token) {
        console.log("\t Delete Applications")
        let applicationsAppId = applicationsAppIdEndpoint.replace('{app_id}', app_id)
        let result = await intUrl.delete(applicationsAppId)
            .set(Object.assign(headers, {
                'Authorization': 'Bearer ' + access_token
            }))
            .send(requestBody)

        return result
    },

    delApplicationsAppIdSecretsSecretId: async function (app_id, requestBody, secret_id, admin_id) {
        console.log("\t Delete Applications app_id Secrets with secret_id")
        let applicationsAppIdSecretsSecretId = applicationsAppIdSecretsSecretIdEndpoint.replace('{app_id}', app_id).replace('{secret_id}', secret_id)
        let result = await intUrl.delete(applicationsAppIdSecretsSecretId)
            .set({
                'admin-id': admin_id
            })
            .send(requestBody)

        return result
    },

    delApplicationsDefaults: async function (app_id, defaultName) {
        console.log("\t Delete Applications Defaults")
        let applicationsAppIdByDefaultName = applicationsAppIdDefaultsDefaultNameEndpoint.replace('{app_id}', app_id).replace('{default_name}', defaultName)
        let result = await intUrl.delete(applicationsAppIdByDefaultName)

        return result
    },

    delApplicationsAppIdSecretsSecretIdExt: async function (app_id, requestBody, secret_id, access_token, admin_id) {
        console.log("\t Delete Applications app_id Secrets with secret_id with Authorization")
        let applicationsAppIdSecretsSecretId = applicationsAppIdSecretsSecretIdEndpoint.replace('{app_id}', app_id).replace('{secret_id}', secret_id)
        let result = await intUrl.delete(applicationsAppIdSecretsSecretId)
            .set(Object.assign(headers, {
                'Authorization': 'Bearer ' + access_token,
                'admin-id': admin_id
            }))
            .send(requestBody)

        return result
    },

    deleteApplicationsDefaultsNamesId: async function (id) {
        console.log('\t Delete Applications Default Names corresponding to id')
        let applicationsDefaultsNamesId = applicationsDefaultsNamesIdEndpoint.replace('{id}', id)
        let result = await intUrl.delete(applicationsDefaultsNamesId)
            .set(headers)

        return result
    },

    getApplications: async function (app_id) {
        console.log("\t Get Applications corresponding to app_id")
        let applicationsAppId = applicationsAppIdEndpoint.replace('{app_id}', app_id)
        let result = await intUrl.get(applicationsAppId)

        return result
    },

    postApplicationsDefaults: async function (requestBody, appId) {
        console.log("\t Post Application Defaults")
        const applicationsAppIdDefaultsUrl = applicationsAppIdDefaultsEndpoint.replace('{app_id}', appId)
        const result = await intUrl.post(applicationsAppIdDefaultsUrl)
            .send(requestBody)

        return result
    },

    updateApplicationsDefaults: async function (appId, defaultName, requestBody) {
        console.log("\t Update Application Defaults")
        const applicationsDefaultAppIdByNameUrl = applicationsAppIdDefaultsDefaultNameEndpoint.replace('{app_id}', appId).replace('{default_name}', defaultName)
        const result = await intUrl.patch(applicationsDefaultAppIdByNameUrl)
            .send(requestBody)

        return result
    },

    getApplicationsDefaults: async function (appId) {
        console.log("\t Get Application Defaults")
        const applicationsDefaultAppIdUrl = applicationsAppIdDefaultsEndpoint.replace('{app_id}', appId)
        const result = await intUrl.get(applicationsDefaultAppIdUrl)

        return result
    },

    getApplicationsDefaultsByDefaultName: async function (appId, defaultName) {
        console.log("\t Get Application Defaults by default name")
        const applicationsDefaultAppIdByNameUrl = applicationsAppIdDefaultsDefaultNameEndpoint.replace('{app_id}', appId).replace('{default_name}', defaultName)
        let result = await intUrl.get(applicationsDefaultAppIdByNameUrl)

        return result
    },

    delApplicationDefaults: async function (appId, defaultName) {
        console.log("\t Delete Application Defaults")
        const applicationsDefaultAppIdByNameUrl = applicationsAppIdDefaultsDefaultNameEndpoint.replace('{app_id}', appId).replace('{default_name}', defaultName)
        const result = await intUrl.delete(applicationsDefaultAppIdByNameUrl)

        return result
    },

    getApplicationsAppIdSecrets: async function (app_id) {
        console.log("\t Get Applications app_id Secrets")
        let applicationsAppIdSecrets = applicationsAppIdSecretsEndpoint.replace('{app_id}', app_id)
        let result = await intUrl.get(applicationsAppIdSecrets)
            .set(headers)

        return result
    },

    getApplicationsAppIdSecretsExt: async function (app_id, access_token) {
        console.log("\t Get Applications app_id Secrets with Authorization")
        let applicationsAppIdSecrets = applicationsAppIdSecretsEndpoint.replace('{app_id}', app_id)
        let result = await intUrl.get(applicationsAppIdSecrets)
            .set(Object.assign(headers, {
                'Authorization': 'Bearer ' + access_token
            }))

        return result
    },

    getApplicationsAppIdSecretsSecretId: async function (app_id, secret_id) {
        console.log("\t Get Applications app_id Secrets with secret_id")
        let applicationsAppIdSecretsSecretId = applicationsAppIdSecretsSecretIdEndpoint.replace('{app_id}', app_id).replace('{secret_id}', secret_id)
        let result = await intUrl.get(applicationsAppIdSecretsSecretId)
        // .set(headers)

        return result
    },

    getApplicationsDefaultsNames: async function () {
        console.log('\t Get Applications Defaults Names')
        let result = await intUrl.get(applicationsDefaultsNamesEndpoint)
            .set(headers)

        return result
    },

    postUsers: async function (requestBody, admin_username, admin_id) {
        console.log("\t Post Users")

        if (admin_id != undefined) {
            let result = await intUrl.post(usersEndpoint)

                .set({
                    'Content-Type': 'application/json',
                    'admin-id': config.get('admin.corp_id'),
                    'admin-username': admin_username,
                    'admin-password': config.get('admin.password')
                })
                .send(requestBody)

            return result
        }
        else {
            let result = await intUrl.post(usersEndpoint)
                .set({
                    'Content-Type': 'application/json',
                    'admin-username': admin_username,
                    'admin-password': config.get('admin.password')
                })
                .send(requestBody)

            return result
        }
    },

    getUsers: async function (app_id) {
        console.log('\t Get Users')
        let applicationsAppIdUsers = applicationsAppIdUsersEndpoint.replace('{app_id}', app_id)
        let result = await intUrl.get(applicationsAppIdUsers)
            .set(headers)

        return result
    },

    getUsersCustomerKey: async function (customer_key, admin_username, admin_id) {
        console.log('\t Get Users corresponding to Customer Key')
        let usersCustomerKey = usersCustomerKeyEndpoint.replace('{customer_key}', customer_key)
        if (admin_id != undefined) {
            let result = await intUrl.get(usersCustomerKey)
                .set({
                    'Content-Type': 'application/json',
                    'admin-id': config.get('admin.corp_id'),
                    'admin-username': admin_username,
                    'admin-password': config.get('admin.password')
                })

            return result
        }
        else {
            let result = await intUrl.get(usersCustomerKey)
                .set({
                    'Content-Type': 'application/json',
                    'admin-username': admin_username,
                    'admin-password': config.get('admin.password')
                })

            return result
        }
    },

    getUsersCustomerKeySSO: async function (customer_key) {
        console.log('\t Get Users corresponding to customer_key to check if SSO user')
        let usersCustomerKeySSO = usersCustomerKeySSOEndpoint.replace('{customer_key}', customer_key)
        let result = await intUrl.get(usersCustomerKeySSO)

        return result
    },

    postUsersApiUsersUserIdDefaults: async function (requestBody, user_id) {
        console.log('\t Post Users API Users Default corresponding to user_id')
        let usersApiUsersUserIdDefaults = usersApiUsersUserIdDefaultsEndpoint.replace('{user_id}', user_id)
        let result = await intUrl.post(usersApiUsersUserIdDefaults)
            .set(headers)
            .send(requestBody)

        return result
    },

    getUsersApiUsersUserIdDefaults: async function (user_id) {
        console.log('\t Get Users API Users Defaults corresponding to user_id')
        let usersApiUsersUserIdDefaults = usersApiUsersUserIdDefaultsEndpoint.replace('{user_id}', user_id)
        let result = await intUrl.get(usersApiUsersUserIdDefaults)
            .set(headers)

        return result
    },

    getUsersApiUsersUserId: async function (user_id) {
        console.log('\t Get Users API Users corresponding to user_id')
        let usersApiUsersUserId = usersApiUsersUserIdEndpoint.replace('{user_id}', user_id)
        let result = await intUrl.get(usersApiUsersUserId)
            .set(headers)

        return result
    },

    getUsersApiUsersFaxNumber: async function (fax_number, app_id, admin_username) {
        console.log('\t Get Users API Users corresponding to fax_number')
        let usersApiUsersFaxNumber = usersApiUsersFaxNumberEndpoint.replace('{fax_number}', fax_number)
        if (app_id != undefined) {
            let result = await extUrl.get(usersApiUsersFaxNumber)
                .set({
                    'Content-Type': 'application/json',
                    'admin-id': config.get('admin.corp_id'),
                    'admin-username': admin_username,
                    'admin-password': config.get('admin.password'),
                    'app-id': app_id
                })

            return result
        }
        else {
            let result = await extUrl.get(usersApiUsersFaxNumber)
                .set({
                    'Content-Type': 'application/json',
                    'admin-id': config.get('admin.corp_id'),
                    'admin-username': admin_username,
                    'admin-password': config.get('admin.password')
                })

            return result
        }
    },

    patchUsersCustomerKey: async function (customer_key, requestBody, admin_id) {
        console.log('\t Patch Users corresponding to customer_key')
        let usersCustomerKey = usersCustomerKeyEndpoint.replace('{customer_key}', customer_key)

        if (admin_id != undefined) {
            let result = await intUrl.patch(usersCustomerKey)
                .set(headers)
                .send(requestBody)

            return result
        }
        else {
            let result = await intUrl.patch(usersCustomerKey)
                .set({
                    'Content-Type': 'application/json',
                    'admin-username': config.get('admin.username'),
                    'admin-password': config.get('admin.password')
                })
                .send(requestBody)

            return result
        }
    },

    patchUsersApiUsersFaxNumber: async function (fax_number, app_id, admin_username, requestBody) {
        console.log('\t Patch Users API Users corresponding to fax_number')
        let usersApiUsersFaxNumber = usersApiUsersFaxNumberEndpoint.replace('{fax_number}', fax_number)
        if (app_id != undefined) {
            let result = await intUrl.patch(usersApiUsersFaxNumber)
                .set({
                    'Content-Type': 'application/json',
                    'admin-id': config.get('admin.corp_id'),
                    'admin-username': admin_username,
                    'admin-password': config.get('admin.password'),
                    'app-id': app_id
                })
                .send(requestBody)

            return result
        }
        else {
            let result = await intUrl.patch(usersApiUsersFaxNumber)
                .set({
                    'Content-Type': 'application/json',
                    'admin-id': config.get('admin.corp_id'),
                    'admin-username': admin_username,
                    'admin-password': config.get('admin.password')
                })
                .send(requestBody)

            return result
        }
    },

    patchUsersApiUsersUserIdDefaultsDefaultName: async function (user_id, default_name, requestBody) {
        console.log('\t Patch Users API Users Default corresponding to user_id and default_name')
        let usersApiUsersUserIdDefaultsDefaultName = usersApiUsersUserIdDefaultsDefaultNameEndpoint.replace('{user_id}', user_id).replace('{default_name}', default_name)
        let result = await intUrl.patch(usersApiUsersUserIdDefaultsDefaultName)
            .set(headers)
            .send(requestBody)

        return result
    },

    patchApplicationsDefaultsNamesId: async function (requestBody, id) {
        console.log('\t Patch applications defaults names corresponding to id')
        let applicationsDefaultsNamesId = applicationsDefaultsNamesIdEndpoint.replace('{id}', id)
        let result = await intUrl.patch(applicationsDefaultsNamesId)
            .set(headers)
            .send(requestBody)

        return result
    },

    deleteUsersApiUsersFaxNumber: async function (fax_number, app_id) {
        console.log('\t Deleting assigned Fax Number to Particular User')
        let usersApiUsersFaxNumber = usersApiUsersFaxNumberEndpoint.replace('{fax_number}', fax_number)
        if (app_id != undefined) {
            let result = await intUrl.del(usersApiUsersFaxNumber)
                .set({
                    'Content-Type': 'application/json',
                    'admin-id': config.get('admin.corp_id'),
                    'admin-username': config.get('admin.username'),
                    'admin-password': config.get('admin.password'),
                    'app-id': app_id
                })

            return result
        }
        else {
            let result = await intUrl.del(usersApiUsersFaxNumber)
                .set(headers)

            return result
        }
    },

    deleteUsersApiUsersUserIdDefaultsDefaultName: async function (user_id, default_name) {
        console.log('\t Delete Users API Users Default corresponding to user_id and default_name')
        let usersApiUsersUserIdDefaultsDefaultName = usersApiUsersUserIdDefaultsDefaultNameEndpoint.replace('{user_id}', user_id).replace('{default_name}', default_name)
        let result = await intUrl.delete(usersApiUsersUserIdDefaultsDefaultName)
            .set(headers)

        return result
    },

    putUsersApiUsersFaxNumber: async function (fax_number, app_id) {
        console.log('\t Put assigned fax_number to Particular User')
        let usersApiUsersFaxNumber = usersApiUsersFaxNumberEndpoint.replace('{fax_number}', fax_number)
        if (app_id != undefined) {
            let result = await intUrl.put(usersApiUsersFaxNumber)
                .set({
                    'Content-Type': 'application/json',
                    'admin-id': config.get('admin.corp_id'),
                    'admin-username': config.get('admin.username'),
                    'admin-password': config.get('admin.password'),
                    'app-id': app_id
                })

            return result
        }
        else {
            let result = await intUrl.put(usersApiUsersFaxNumber)
                .set(headers)

            return result
        }
    },

    putUsersApiUsersUserIdRefresh: async function (user_id, app_id) {
        console.log('\t Put Users Api users Refresh corresponnding to user_id and app_id')
        let usersApiUsersuserIdRefresh = usersApiUsersuserIdRefreshEndpoint.replace('{user_id}', user_id)
        if (app_id != undefined) {
            let result = await intUrl.put(usersApiUsersuserIdRefresh)
                .set({
                    'Content-Type': 'application/json',
                    'admin-id': config.get('admin.corp_id'),
                    'admin-username': config.get('admin.username'),
                    'admin-password': config.get('admin.password'),
                    'app-id': app_id
                })

            return result
        }
        else {
            let result = await intUrl.put(usersApiUsersuserIdRefresh)
                .set(headers)

            return result
        }
    },

    deleteUsersCustomerId: async function (customer_key, admin_id) {
        console.log('\t Deleting user corresponding to customer_id')
        let usersCustomerKey = usersCustomerKeyEndpoint.replace('{customer_key}', customer_key)

        if (admin_id != undefined) {
            let result = await intUrl.del(usersCustomerKey)
                .set({
                    'Content-Type': 'application/json',
                    'admin-id': admin_id,
                    'admin-username': config.get('admin.username'),
                    'admin-password': config.get('admin.password')
                })

            return result
        }
        else {
            let result = await intUrl.del(usersCustomerKey)
                .set({
                    'Content-Type': 'application/json',
                    'admin-username': config.get('admin.username'),
                    'admin-password': config.get('admin.password')
                })

            return result
        }
    },

    deleteNumbers: async function (requestBody) {
        console.log('\t Deleting Numbers')
        let result = await intUrl.del(numbersEndpoint)
            .set({
                'Content-Type': 'application/json',
                'admin-id': config.get('admin.corp_id'),
                'admin-username': config.get('admin.username'),
                'admin-password': config.get('admin.password')
            })
            .send(requestBody)

        return result
    },

    deleteNumbersExt: async function (requestBody, access_token) {
        console.log('\t Deleting Numbers')
        let result = await extUrl.del(numbersEndpoint)
            .set({
                'Authorization': 'Bearer ' + access_token,
                'Content-Type': 'application/json',
                'admin-id': config.get('admin.corp_id'),
                'admin-username': config.get('admin.username'),
                'admin-password': config.get('admin.password')
            })
            .send(requestBody)

        return result
    },

    deleteNumbersFaxNumber: async function (fax_number) {
        console.log('\t Deleting assigned fax_number to Particular User')
        let numbersFaxNumbers = numbersFaxNumbersEndpoint.replace('{fax_number}', fax_number)
        let result = await intUrl.del(numbersFaxNumbers)
            .set({
                'Content-Type': 'application/json',
                'admin-id': config.get('admin.corp_id'),
                'admin-username': config.get('admin.username'),
                'admin-password': config.get('admin.password')
            })

        return result
    },

    deleteNumbersFaxNumberExt: async function (fax_number, access_token) {
        console.log('\t Deleting assigned fax_number to Particular User')
        let numbersFaxNumbers = numbersFaxNumbersEndpoint.replace('{fax_number}', fax_number)
        let result = await intUrl.del(numbersFaxNumbers)
            .set({
                'Authorization': 'Bearer ' + access_token,
                'Content-Type': 'application/json',
                'admin-id': config.get('admin.corp_id'),
                'admin-username': config.get('admin.username'),
                'admin-password': config.get('admin.password')
            })

        return result
    },

    getNumbersFaxNumber: async function (fax_number) {
        console.log('\t Get Numbers corresponding to fax_number generated')
        let numbersFaxNumbers = numbersFaxNumbersEndpoint.replace('{fax_number}', fax_number)
        let result = await intUrl.get(numbersFaxNumbers)
            .set({
                'Content-Type': 'application/json',
                'admin-id': config.get('admin.corp_id'),
                'admin-username': config.get('admin.username'),
                'admin-password': config.get('admin.password')
            })

        return result
    },

    getNumberAssigned: async function (admin_username, offset, limit) {
        console.log('\t Get Unassigned fax_numbers')
        let result = await intUrl.get(numbersAssignedEndpoint)
            .set({
                'Content-Type': 'application/json',
                'admin-id': config.get('admin.corp_id'),
                'admin-username': admin_username,
                'admin-password': config.get('admin.password')
            })
            .query({
                'offset': offset,
                'limit': limit
            })

        return result
    },

    getNumberUnassigned: async function (admin_username, offset, limit) {
        console.log('\t Get Unassigned fax_numbers')
        let result = await intUrl.get(numbersUnassignedEndpoint)
            .set({
                'Content-Type': 'application/json',
                'admin-id': config.get('admin.corp_id'),
                'admin-username': admin_username,
                'admin-password': config.get('admin.password')
            })
            .query({
                'offset': offset,
                'limit': limit
            })

        return result
    },

    postNumbers: async function (requestBody, admin_username) {
        console.log('\t Post Numbers')
        let result = await extUrl.post(numbersEndpoint)
            .set({
                'Content-Type': 'application/json',
                'admin-id': config.get('admin.corp_id'),
                'admin-username': admin_username,
                'admin-password': config.get('admin.password')
            })
            .send(requestBody)

        return result
    },

    patchNumbers: async function (fax_number, requestBody) {
        console.log('\t Patch Number corresponding to fax_number generated')
        let numbersFaxNumbers = numbersFaxNumbersEndpoint.replace('{fax_number}', fax_number)
        let result = await extUrl.patch(numbersFaxNumbers)
            .set(headers)
            .send(requestBody)

        return result
    },

    postNotification: async function (app_id, requestBody) {
        console.log('\t Post Notification corresponding to app_id')
        let applicationAppIdNotification = applicationAppIdNotificationEndpoint.replace('{app_id}', app_id)
        let result = await intUrl.post(applicationAppIdNotification)
            .send(requestBody)

        return result
    },

    postNotificationExt: async function (app_id, requestBody) {
        console.log('\t Post Notification corresponding to app_id')
        let applicationAppIdNotification = applicationAppIdNotificationEndpoint.replace('{app_id}', app_id)
        let result = await intUrl.post(applicationAppIdNotification)
            .set({
                'Content-Type': 'application/json',
                'admin-id': config.get('admin.corp_id'),
                'admin-username': config.get('admin.username'),
                'admin-password': config.get('admin.password')
            })
            .send(requestBody)

        return result
    },

    postApplicationsNotificationsAuth: async function (app_id, requestBody, notify_id) {
        console.log('\t Post Applications Notification auth corresponding to notification_id')
        let applicationsAppIdNotificationsNotifyIdAuth = applicationsAppIdNotificationsNotifyIdAuthEndpoint.replace('{app_id}', app_id).replace('{notify_id}', notify_id)
        let result = await intUrl.post(applicationsAppIdNotificationsNotifyIdAuth)
            .set({
                'Content-Type': 'application/json',
                'admin-id': config.get('admin.corp_id'),
                'admin-username': config.get('admin.username'),
                'admin-password': config.get('admin.password')
            })
            .send(requestBody)

        return result
    },

    patchNotification: async function (app_id, notification_id, requestBody) {
        console.log('\t Patch Notification')
        let applicationAppIdNotificationNotificationId = applicationAppIdNotificationNotificationIdEndpoint.replace('{app_id}', app_id).replace('{notification_id}', notification_id)
        let result = await intUrl.patch(applicationAppIdNotificationNotificationId)
            .set({
                'Content-Type': 'application/json',
                'admin-id': config.get('admin.corp_id'),
                'admin-username': config.get('admin.username'),
                'admin-password': config.get('admin.password')
            })
            .send(requestBody)

        return result
    },

    patchApplicationsNotificationsAuth: async function (app_id, requestBody, notify_id, notify_auth_id) {
        console.log('\t Patch Applications Notification auth corresponding to notification_id and notification_auth_id')
        let applicationsAppIdNotificationsNotifyIdAuthNotifyAuthId = applicationsAppIdNotificationsNotifyIdAuthNotifyAuthIdEndpoint.replace('{app_id}', app_id).replace('{notify_id}', notify_id).replace('{notify_auth_id}', notify_auth_id)
        let result = await intUrl.patch(applicationsAppIdNotificationsNotifyIdAuthNotifyAuthId)
            .set({
                'Content-Type': 'application/json',
                'admin-id': config.get('admin.corp_id'),
                'admin-username': config.get('admin.username'),
                'admin-password': config.get('admin.password')
            })
            .send(requestBody)

        return result
    },

    getApplicationsNotificationsAuth: async function (app_id, notify_id) {
        console.log('\t Get Applications Notification auth corresponding to notify_id')
        let applicationsAppIdNotificationsNotifyIdAuth = applicationsAppIdNotificationsNotifyIdAuthEndpoint.replace('{app_id}', app_id).replace('{notify_id}', notify_id)
        let result = await intUrl.get(applicationsAppIdNotificationsNotifyIdAuth)
            .set({
                'Content-Type': 'application/json',
                'admin-id': config.get('admin.corp_id'),
                'admin-username': config.get('admin.username'),
                'admin-password': config.get('admin.password')
            })

        return result
    },

    deleteApplicationsNotificationsAuth: async function (app_id, requestBody, notify_id, notify_auth_id) {
        console.log('\t Delete Applications Notification auth corresponding to notification_id and notification_auth_id')
        let applicationsAppIdNotificationsNotifyIdAuthNotifyAuthId = applicationsAppIdNotificationsNotifyIdAuthNotifyAuthIdEndpoint.replace('{app_id}', app_id).replace('{notify_id}', notify_id).replace('{notify_auth_id}', notify_auth_id)
        let result = await intUrl.delete(applicationsAppIdNotificationsNotifyIdAuthNotifyAuthId)
            .set({
                'Content-Type': 'application/json',
                'admin-id': config.get('admin.corp_id'),
                'admin-username': config.get('admin.username'),
                'admin-password': config.get('admin.password')
            })
            .send(requestBody)

        return result
    },

    deleteApplicationsNotifications: async function (app_id, notification_id, requestBody) {
        console.log('\t Delete Notification corresponding to app_id and notification_id')
        let applicationAppIdNotificationNotificationId = applicationAppIdNotificationNotificationIdEndpoint.replace('{app_id}', app_id).replace('{notification_id}', notification_id)
        let result = await intUrl.del(applicationAppIdNotificationNotificationId)
            .set({
                'Content-Type': 'application/json',
                'admin-id': config.get('admin.corp_id'),
                'admin-username': config.get('admin.username'),
                'admin-password': config.get('admin.password')
            })
            .send(requestBody)

        return result
    },

    getHealth: async function (admin_username) {
        console.log('\t Get Health')
        let result = await intUrl.get(healthEndpoint)
            .set({
                'Content-Type': 'application/json',
                'admin-id': config.get('admin.corp_id'),
                'admin-username': admin_username,
                'admin-password': config.get('admin.password')
            })

        return result
    },

    getCitiesAreaCode: async function (area_code) {
        console.log('\t Get Cities based on area_code')
        let citiesAreaCode = citiesAreaCodeEndpoint.replace('{area_code}', area_code)
        let result = await extUrl.get(citiesAreaCode)
            .set({
                'Content-Type': 'application/json',
                'admin-id': config.get('admin.corp_id'),
                'admin-username': config.get('admin.username'),
                'admin-password': config.get('admin.password')
            })

        return result
    },

    postOauthToken: async function (admin_username, admin_password) {
        console.log('\t Post Oauth Token')
        let result = await extUrl.post(oauthTokenEndpoint)
            .auth(admin_username, admin_password)
            .set({
                'Content-Type': 'application/x-www-form-urlencoded',
                'admin-id': config.get('admin.corp_id'),
                'admin-username': admin_username,
                'admin-password': admin_password
            })
            .send('grant_type=client_credentials')

        return result
    },

    postAppWithInvalidContentType: async function (requestBody) {
        console.log("\t Post Applications with invalid content type")
        let result = await intUrl.post(applicationsEndpoint)
            .set({
                'Content-Type': 'applications/json',
                'admin-id': config.get('admin.corp_id'),
                'admin-username': config.get('admin.username'),
                'admin-password': config.get('admin.password')
            })
            .send(requestBody)
        return result
    },

    patchUsersWithInvalidContentType: async function (customer_key, requestBody) {
        console.log('\t Patch Users corresponding to customer_key with invalid content type')
        let usersCustomerKey = usersCustomerKeyEndpoint.replace('{customer_key}', customer_key)

        let result = await intUrl.patch(usersCustomerKey)
            .set({
                'Content-Type': 'applications/json',
                'admin-id': config.get('admin.corp_id'),
                'admin-username': config.get('admin.username'),
                'admin-password': config.get('admin.password')
            })
            .send(requestBody)

        return result
    },

    postAppAppIdSecretsExtWithInvalidContentType: async function (app_id, requestBody, access_token, admin_username) {
        console.log("\t Post Applications AppId Secrets with Authorization")
        let applicationsAppIdSecrets = applicationsAppIdSecretsEndpoint.replace('{app_id}', app_id)
        let result = await extUrl.post(applicationsAppIdSecrets)
            .set(Object.assign(headers, {
                'Authorization': 'Bearer ' + access_token,
                'Content-Type': 'applications/json',
                'admin-id': config.get('admin.corp_id'),
                'admin-username': admin_username,
                'admin-password': config.get('admin.password')
            }))
            .send(requestBody)

        return result
    },

    postNotificationWithInvalidContentType: async function (app_id, requestBody) {
        console.log('\t Post Notification corresponding to app_id with invalid content type')
        let applicationAppIdNotification = applicationAppIdNotificationEndpoint.replace('{app_id}', app_id)
        let result = await intUrl.post(applicationAppIdNotification)
            .set({
                'Content-Type': 'applications/json',
                'admin-id': config.get('admin.corp_id'),
                'admin-username': config.get('admin.username'),
                'admin-password': config.get('admin.password')
            })
            .send(requestBody)

        return result
    },

    postGroups: async function (requestBody) {
        console.log('\t Post Groups')
        let result = await intUrl.post(groupsEndpoint)

            .send(requestBody)

        return result
    },

    postSSOConfigs: async function (requestBody) {
        console.log('\t Post SSO Configs')
        let result = await intUrl.post(ssoConfigsEndpoint)
            .set(headers)
            .send(requestBody)

        return result
    },

    getSSOConfigs: async function (sso_config_id) {
        console.log('\t Get SSO Configs corresponding to sso_config_id')
        let ssoConfigsSsoConfigId = ssoConfigsSsoConfigIdEndpoint.replace('{sso_config_id}', sso_config_id)
        let result = await intUrl.get(ssoConfigsSsoConfigId)

        return result
    },

    patchSSOConfigs: async function (obj, sso_config_id) {
        console.log('\t Patch SSO Configs corresponding to sso_config_id')
        let ssoConfigsSsoConfigId = ssoConfigsSsoConfigIdEndpoint.replace('{sso_config_id}', sso_config_id)
        let result = await intUrl.patch(ssoConfigsSsoConfigId)
            .send(obj)

        return result
    },

    deleteSSOConfigs: async function (sso_config_id) {
        console.log('\t Delete SSO Configs corresponding to sso_config_id')
        let ssoConfigsSsoConfigId = ssoConfigsSsoConfigIdEndpoint.replace('{sso_config_id}', sso_config_id)
        let result = await intUrl.delete(ssoConfigsSsoConfigId)

        return result
    },

    postSSOUsers: async function (requestBody) {
        console.log('\t Post SSO Users')
        let result = await intUrl.post(ssoUsersEndpoint)
            .send(requestBody)

        return result
    },

    getSSOUsers: async function (sso_user_id) {
        console.log('\t Get SSO Users corresponding to sso_user_id')
        let ssoUsersSsoUserId = ssoUsersSsoUserIdEndpoint.replace('{sso_user_id}', sso_user_id)
        let result = await intUrl.get(ssoUsersSsoUserId)

        return result
    },

    patchSSOUsers: async function (obj, sso_user_id) {
        console.log('\t Patch SSO Users corresponding to sso_user_id')
        let ssoUsersSsoUserId = ssoUsersSsoUserIdEndpoint.replace('{sso_user_id}', sso_user_id)
        let result = await intUrl.patch(ssoUsersSsoUserId)
            .send(obj)

        return result
    },

    deleteSSOUsers: async function (sso_user_id) {
        console.log('\t Delete SSO Users corresponding to sso_user_id')
        let ssoUsersSsoUserId = ssoUsersSsoUserIdEndpoint.replace('{sso_user_id}', sso_user_id)
        let result = await intUrl.delete(ssoUsersSsoUserId)

        return result
    },

    postSSOGroups: async function (requestBody) {
        console.log('\t Post SSO Groups')
        let result = await intUrl.post(ssoGroupsEndpoint)
            .send(requestBody)

        return result
    },

    getSSOGroups: async function (oauth_group) {
        console.log('\t Get SSO Groups corresponding to oauth_group')
        let ssoGroupsOauthGroup = ssoGroupsOauthGroupEndpoint.replace('{oauth_group}', oauth_group)
        let result = await intUrl.get(ssoGroupsOauthGroup)

        return result
    },

    patchSSOGroups: async function (obj, oauth_group) {
        console.log('\t Patch SSO Groups corresponding to oauth_group')
        let ssoGroupsOauthGroup = ssoGroupsOauthGroupEndpoint.replace('{oauth_group}', oauth_group)
        let result = await intUrl.patch(ssoGroupsOauthGroup)
            .send(obj)

        return result
    },

    deleteSSOGroups: async function (oauth_group) {
        console.log('\t Delete SSO Groups corresponding to oauth_group')
        let ssoGroupsOauthGroup = ssoGroupsOauthGroupEndpoint.replace('{oauth_group}', oauth_group)
        let result = await intUrl.delete(ssoGroupsOauthGroup)

        return result
    },

    postSSOApplications: async function (requestBody) {
        console.log('\t Post SSO Applications')
        let result = await intUrl.post(ssoApplicationsEndpoint)
            .send(requestBody)

        return result
    },

    getSSOApplications: async function (client_id) {
        console.log('\t Get SSO Applications corresponding to client_id')
        let ssoApplicationsClientId = ssoApplicationsClientIdEndpoint.replace('{client_id}', client_id)
        let result = await intUrl.get(ssoApplicationsClientId)

        return result
    },

    patchSSOApplications: async function (obj, client_id) {
        console.log('\t Patch SSO Applications corresponding to client_id')
        let ssoApplicationsClientId = ssoApplicationsClientIdEndpoint.replace('{client_id}', client_id)
        let result = await intUrl.patch(ssoApplicationsClientId)
            .send(obj)

        return result
    },

    deleteSSOApplications: async function (client_id) {
        console.log('\t Delete SSO Applications corresponding to client_id')
        let ssoApplicationsClientId = ssoApplicationsClientIdEndpoint.replace('{client_id}', client_id)
        let result = await intUrl.delete(ssoApplicationsClientId)

        return result
    },

    putSSOApplications: async function (client_id) {
        console.log('\t Put SSO Applications corresponding to client_id')
        let ssoApplicationsClientIdResetSecret = ssoApplicationsClientIdResetSecretEndpoint.replace('{client_id}', client_id)
        let result = await intUrl.put(ssoApplicationsClientIdResetSecret)

        return result
    }
}

