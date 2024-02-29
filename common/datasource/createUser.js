const common_utils = require('../util/commonUtils')

let name, primaryAddress, secondaryAddress, company_name, contact_email, web_account_id

name = common_utils.randName()
primaryAddress = common_utils.randPrimaryAddress()
secondaryAddress = common_utils.randSecondaryAddress()
company_name = common_utils.randCompany()
contact_email = common_utils.randEmail()
web_account_id = 'WebAccountId' + common_utils.randNum(6)


module.exports = {
    postUsers: function (app_id, group_name) {

        let users = {
            "user": {
                "group_name": group_name,
                "email_address": contact_email,
                "first_name": name,
                "last_name": name,
                "address_line_1": primaryAddress,
                "address_line_2": secondaryAddress,
                "send_enabled": true,
                "receive_enabled": true,
                "city": "Los Angeles",
                "mail_region": "US",
                "mail_code": "90017",
                "timezone_code": "America/Bogota",
                "company_name": company_name,
                "country": "US",
                "department_code": "CA",
                "fax_file_type": "EFX",
                "generic_1": "G1",
                "generic_2": "G2",
                "generic_3": "G3",
                "generic_4": "G4",
                "generic_5": "G5",
                "generic_6": "G6",
                "language_code": "es",
                "phone_number": "5448768"
            },
            "number_preferences": {
                "area_code": "213",
                "country_iso_code": "US",
                "services_api_app_id": app_id
            }
        }
        return users
    },

    apiUsers: function () {

        let apiusers = {
            watermark_inbound: "2019-09-30T13:53:15",
            watermark_outbound: "2019-09-30T13:53:15",
            owner_id_inbound: "49256271",
            owner_id_outbound: "49256271",
            service_key_inbound: "1",
            service_key_outbound: "2",
        }
        return apiusers
    }
}
