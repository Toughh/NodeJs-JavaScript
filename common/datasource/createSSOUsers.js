const common_utils = require('../../common/util/commonUtils')

let sso_name_id

sso_name_id = common_utils.randEmail()

module.exports = {
    postSSOUsers: function (sso_config_id, email, customer_key, enabled) {

        let SSOUsers = {
            "sso_config_id": sso_config_id,
            "sso_name_id": sso_name_id,
            "email": email,
            "customer_key": customer_key,
            "enabled": enabled
        }
        return SSOUsers
    }
}
