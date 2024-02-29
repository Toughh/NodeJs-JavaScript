module.exports = {

    users: function (user_id, app_id, customer_key, service_key_inbound, service_key_outbound, fax_number, user_status) {

        let users = {
            "user_id": user_id,
            "app_id": app_id,
            "customer_key": customer_key,
            "service_key_inbound": service_key_inbound,
            "service_key_outbound": service_key_outbound,
            "fax_number": fax_number,
            "status": user_status,
            "defaults": []
        }
        return users
    },

    usersdefaults: function (user_id, app_id, customer_key, service_key_inbound, service_key_outbound, fax_number, user_status, default_value, default_enabled, default_status) {

        let createusersdefaults = {
            "user_id": user_id,
            "app_id": app_id,
            "customer_key": customer_key,
            "service_key_inbound": service_key_inbound,
            "service_key_outbound": service_key_outbound,
            "fax_number": fax_number,
            "status": user_status,
            "defaults": [
                {
                    "default_id": 3,
                    "default_value": default_value,
                    "enabled": default_enabled,
                    "status": default_status
                }
            ]
        }
        return createusersdefaults
    }
}
