const common_utils = require('../../common/util/commonUtils')

let description

description = common_utils.randString('Test ', 20)

module.exports = {
    postApplicationsSecrets: function (enable) {

        let applicationsSecrets = {
            "enabled": enable,
            "description": description
        }
        return applicationsSecrets
    }
}
