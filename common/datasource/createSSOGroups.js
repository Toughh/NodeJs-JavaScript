const common_utils = require('../../common/util/commonUtils')

let oauth_group, group_name, group_description

oauth_group = common_utils.randString('oauth_group ', 6)
group_name = common_utils.randString('group_name ', 6)
group_description = common_utils.randString('group_description ', 8)

module.exports = {
    postSSOGroups: function () {

        let SSOGroups = {
            "oauth_group": oauth_group,
            "group_name": group_name, 
            "group_description": group_description
        }
        return SSOGroups
    }
}
