const common_utils = require('../util/commonUtils')

let redirect_url, redirect_url_error

redirect_url = 'http://www.' + common_utils.randString('redirecturl', 8) + ".com"
redirect_url_error = 'http://www.' + common_utils.randString('redirecturlerror', 8) + ".com"

module.exports = {
    postSSOApplications: function (oauth_group, enabled) {

        let SSOApplications = {
            redirect_url: redirect_url,
            redirect_url_error: redirect_url_error,
            oauth_group: oauth_group,
            enabled: enabled
        }
        return SSOApplications
    }
}
