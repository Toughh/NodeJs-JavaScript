// module.exports = {
//     postGroupsAPIFalseDisabledSSO: function (
//         inventory_status = 0, 
//         default_cover_page = -1,
//                 delete_on_download =  0,
//                 electronic_signature_enabled =  0
//         ) {

//         let groups = {
//             "group_name": "anyvalue",
//             "api_access": FALSE,
//             "inventory_status": `${inventory_status}` ,
//             "sso_enabled": FALSE,
//             "billing_code_required": "0",
//             "dept_code": "anyvalue",
//             "settings" {
//                 "default_cover_page": `${default_cover_page}`,
//                 "delete_on_download": "0",
//                 "electronic_signature_enabled": "0",
//                 "email_format": "H"(HTML),
//                 "email_language_preference": English(en),
//                 "enforce_sso": "0",
//                 "fax_file_type": "0"(JFX),
//                 "inbound_fax_notification": "0",
//                 "large_file_transfer": "0",
//                 "received_email_format": "H"(HTML),
//                 "report_country": "AF",
//                 "report_date_format": "1"(ISO 24 Hours),
//                 "report_language_preference": "en"(English),
//                 "report_time_zone_preference": "Pacific/Fiji",
//                 "send_receipt": "1"(both),
//                 "send_receipt_attachment": "none",
//                 "send_receipt_email_format": "H"(HTML),
//                 "send_welcome_email": "0",
//                 "storage_duration_type": "-1"(for lifetime),
//                 "storage_enabled" "0",
//                 "suppress_cover_page": "0",
//                 "time_zone_preference": "Africa/Cairo",
//                 "unassigned_fax_email": "anyvalue@domain.com",
//                 "user_edit_email_format": "0",
//                 "user_edit_fax_email_format": "0",
//                 "user_may_delete_msgs": "0",
//                 "user_may_edit_email_settings": "0",
//                 "user_may_edit_profile": "0",
//                 "user_may_enable_storage": "0",
//                 "user_may_receive_faxes": "0",
//                 "user_may_send_faxes": "Send",
//                 "user_may_send_faxes_from_web": "E"(Enabled),
//                 "user_will_receive_training_message": "0"
//             }
//         }
//         return groups
//     },

//     postGroupsWithEnabledSSO: function (obj) {

//         let groups = {
//             "group_name": "anyvalue",
//             "api_access": FALSE,
//             "inventory_status": 0,
//             "sso_enabled": FALSE,
//             "billing_code_required": "0",
//             "dept_code": "anyvalue",
//             "sso_cofig": {
//                 "idp_sso_url": "",
//                 "idp_entity_id": ""
//             },
//             "settings" {
//                 "default_cover_page": "-1",
//                 "delete_on_download": "0",
//                 "electronic_signature_enabled": "0",
//                 "email_format": "H"(HTML),
//                 "email_language_preference": English(en),
//                 "enforce_sso": "0",
//                 "fax_file_type": "0"(JFX),
//                 "inbound_fax_notification": "0",
//                 "large_file_transfer": "0",
//                 "received_email_format": "H"(HTML),
//                 "report_country": "AF",
//                 "report_date_format": "1"(ISO 24 Hours),
//                 "report_language_preference": "en"(English),
//                 "report_time_zone_preference": "Pacific/Fiji",
//                 "send_receipt": "1"(both),
//                 "send_receipt_attachment": "none",
//                 "send_receipt_email_format": "H"(HTML),
//                 "send_welcome_email": "0",
//                 "storage_duration_type": "-1"(for lifetime),
//                 "storage_enabled" "0",
//                 "suppress_cover_page": "0",
//                 "time_zone_preference": "Africa/Cairo",
//                 "unassigned_fax_email": "anyvalue@domain.com",
//                 "user_edit_email_format": "0",
//                 "user_edit_fax_email_format": "0",
//                 "user_may_delete_msgs": "0",
//                 "user_may_edit_email_settings": "0",
//                 "user_may_edit_profile": "0",
//                 "user_may_enable_storage": "0",
//                 "user_may_receive_faxes": "0",
//                 "user_may_send_faxes": "Send",
//                 "user_may_send_faxes_from_web": "E"(Enabled),
//                 "user_will_receive_training_message": "0"
//             }
//         }
//         return groups
//     },

//     postGroupsWithoutSettings: function (obj) {

//         let groups = {
//             "group_name": "anyvalue",
//             "api_access": FALSE,
//             "inventory_status": 0,
//             "sso_enabled": FALSE,
//             "billing_code_required": "0",
//             "dept_code": "anyvalue",
//             "sso_cofig": {
//                 "idp_sso_url": "",
//                 "idp_entity_id": ""
//             }
//         }
//         return groups
//     }
// }
