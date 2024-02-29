const config = require('config')

let default_id

default_id = config.get('data.default_id')

module.exports = {
    applications: function (app_id, app_status, secret_id, enabled) {

        let createapplications = {
            "app_id": app_id,
            "status": app_status,
            "total_users": 0,
            "synced_users": [],
            "failed_users": [],
            "total_notifications": 0,
            "synced_notifications": [],
            "failed_notifications": [],
            "total_secrets": 1,
            "synced_secrets": [
                {
                    "secret_id": secret_id,
                    "status": app_status,
                    "enabled": enabled
                }
            ],
            "failed_secrets": [],
            "total_defaults": 0,
            "synced_defaults": [],
            "failed_defaults": []
        }
        return createapplications
    },

    applicationswithtwosecrets: function (app_id, app_status, secret_id0, secret_id0_enabled, secret_id1, secret_id1_status, secret_id1_enabled) {

        let createapplicationswithtwosecrets = {
            "app_id": app_id,
            "status": app_status,
            "total_users": 0,
            "synced_users": [],
            "failed_users": [],
            "total_notifications": 0,
            "synced_notifications": [],
            "failed_notifications": [],
            "total_secrets": 2,
            "synced_secrets": [
                {
                    "secret_id": secret_id0,
                    "status": app_status,
                    "enabled": secret_id0_enabled
                },
                {
                    "secret_id": secret_id1,
                    "status": secret_id1_status,
                    "enabled": secret_id1_enabled
                }
            ],
            "failed_secrets": [],
            "total_defaults": 0,
            "synced_defaults": [],
            "failed_defaults": []
        }
        return createapplicationswithtwosecrets
    },

    applicationsusers: function (app_id, app_status, secret_id, enabled, user_id, user_status) {

        let createapplicationsusers = {
            "app_id": app_id,
            "status": app_status,
            "total_users": 1,
            "synced_users": [
                {
                    "user_id": user_id,
                    "status": user_status
                }
            ],
            "failed_users": [],
            "total_notifications": 0,
            "synced_notifications": [],
            "failed_notifications": [],
            "total_secrets": 1,
            "synced_secrets": [
                {
                    "secret_id": secret_id,
                    "status": app_status,
                    "enabled": enabled
                }
            ],
            "failed_secrets": [],
            "total_defaults": 0,
            "synced_defaults": [],
            "failed_defaults": []
        }
        return createapplicationsusers
    },

    applicationsdefaultusers: function (app_id, app_status, secret_id, secret_enabled, user_id, user_status, default_enabled, default_status) {

        let createapplicationsdefaultusers = {
            "app_id": app_id,
            "status": app_status,
            "total_users": 1,
            "synced_users": [
                {
                    "user_id": user_id,
                    "status": user_status
                }
            ],
            "failed_users": [],
            "total_notifications": 0,
            "synced_notifications": [],
            "failed_notifications": [],
            "total_secrets": 1,
            "synced_secrets": [
                {
                    "secret_id": secret_id,
                    "status": app_status,
                    "enabled": secret_enabled
                }
            ],
            "failed_secrets": [],
            "total_defaults": 1,
            "synced_defaults": [
                {
                    "default_id": default_id,
                    "enabled": default_enabled,
                    "status": default_status,
                    "default_name": "send_options"
                }
            ],
            "failed_defaults": []
        }
        return createapplicationsdefaultusers
    },

    applicationsdefaultusersnotify: function (app_id, app_status, secret_id, secret_enabled, user_id, user_status, default_enabled, default_status, notification_id, notify_enabled, notify_status) {

        let createapplicationsdefaultusersnotify = {
            "app_id": app_id,
            "status": app_status,
            "total_users": 1,
            "synced_users": [
                {
                    "user_id": user_id,
                    "status": user_status
                }
            ],
            "failed_users": [],
            "total_notifications": 1,
            "synced_notifications": [
                {
                    "notification_id": notification_id,
                    "enabled": notify_enabled,
                    "status": notify_status
                }
            ],
            "failed_notifications": [],
            "total_secrets": 1,
            "synced_secrets": [
                {
                    "secret_id": secret_id,
                    "status": app_status,
                    "enabled": secret_enabled
                }
            ],
            "failed_secrets": [],
            "total_defaults": 1,
            "synced_defaults": [
                {
                    "default_id": default_id,
                    "enabled": default_enabled,
                    "status": default_status,
                    "default_name": "send_options"
                }
            ],
            "failed_defaults": []
        }
        return createapplicationsdefaultusersnotify
    },

    applicationsnotify: function (app_id, app_status, secret_id, secret_enabled, notification_id, notify_status, notify_enabled) {

        let createapplicationsnotify = {
            "app_id": app_id,
            "status": app_status,
            "total_users": 0,
            "synced_users": [],
            "failed_users": [],
            "total_notifications": 1,
            "synced_notifications": [
                {
                    "notification_id": notification_id,
                    "enabled": notify_enabled,
                    "status": notify_status
                }
            ],
            "failed_notifications": [],
            "total_secrets": 1,
            "synced_secrets": [
                {
                    "secret_id": secret_id,
                    "status": app_status,
                    "enabled": secret_enabled
                }
            ],
            "failed_secrets": [],
            "total_defaults": 0,
            "synced_defaults": [],
            "failed_defaults": []
        }
        return createapplicationsnotify
    }
}
