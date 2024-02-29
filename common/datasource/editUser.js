const common_utils = require('../util/commonUtils')

let name, primaryAddress, secondaryAddress, company_name, contact_email

name = common_utils.randName()
primaryAddress = common_utils.randPrimaryAddress()
secondaryAddress = common_utils.randSecondaryAddress()
company_name = common_utils.randCompany()
contact_email = common_utils.randEmail()


module.exports = {
    editUsers: function (app_id, group_name) {

        let usersEdit = {
            "user": {
                "group_name": group_name,
                "email_address": contact_email,
                "first_name": name,
                "last_name": name,
                "address_line_1": primaryAddress,
                "address_line_2": secondaryAddress,
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
                "owned_number": "",
                "area_code": "213",
                "country_iso_code": "US",
                "services_api_app_id": app_id
            }
        }
        return usersEdit
    }
}
