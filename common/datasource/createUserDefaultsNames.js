const common_utils = require('../util/commonUtils')

let default_name, default_value

default_name = common_utils.randString('default_name ', 10)
default_value = common_utils.randString('default_value ', 10)

module.exports = {
    postUserDefaultDefaultName: function (default_name, default_value, enabled) {

        let userDefaultDefaultName = {
            "default_name": default_name,
            "default_value": default_value,
            "enabled": enabled
        }
        return userDefaultDefaultName
    }
}
