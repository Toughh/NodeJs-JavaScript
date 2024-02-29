/**
 * Import required packages
 */
var config = require('config')
var endpoint = require('../endpoint')
var request = require('supertest')
const { assert } = require('chai')

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
    verifyheaders1: async function (resobj) {
        console.log("\t Checking response headers...")
        assert.equal(resobj.headers['Vary'], 'Origin,Access-Control-Request-Method,Access-Control-Request-Headers', 'Actual Vary is: ' + resobj.headers['Vary'])
        return result
    },

    verifyheaders: async function (resobj) {
        console.log("\t Checking response headers...")
        let Vary = resobj.headers['Vary']
        return Vary
    }
}

