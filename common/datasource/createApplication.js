const common_utils = require('../../common/util/commonUtils')
const config = require('config')
const configAdminId = config.get('admin.corp_id')

let company_name, calls_per_minute, contact_email, defaults_name, description

company_name = common_utils.randCompany()
calls_per_minute = common_utils.randNum(3)
contact_email = common_utils.randEmail()

defaults_name = common_utils.randString('defaults_name ', 10)
description = common_utils.randString('Test Description ', 10)

module.exports = {
    postApplications: function (admin_id, group_name) {

        let applications = {
            "app_name": "faxqa123",
            "reseller_id": admin_id || configAdminId,
            "group_name": group_name || "My Account\\Avijit Test Automation",
            "company_name": company_name,
            "calls_per_minute": calls_per_minute,
            "contact_email": contact_email,
            "status": "A"
        }
        return applications
    },

    postApplicationsDefaultsNames: function () {

        let applicationsDefaultsNames = {
            "defaults_name": defaults_name,
            "description": description
        }
        return applicationsDefaultsNames
    }
}
