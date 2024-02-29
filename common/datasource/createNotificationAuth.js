const common_utils = require('../util/commonUtils')

let description

description = common_utils.randString('Test ', 20)

module.exports = {
    postNotificationAuth: function () {

        let notificationAuth = {
            "client_id": "test_client_id",
            "client_secret": "test_client_secret",
            "token_endpoint": "https://test_token_endpoint",
            "grant_type": "client_credentials",
            "scope": "test_scope",
            "description": description
        }
        return notificationAuth
    },

    patchNotificationAuth: function (enabled) {

        let notificationAuth = {
            "enabled": enabled,
            "description": description
        }
        return notificationAuth
    }
}
