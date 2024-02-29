const fetchrecords = require('../../datasource/coredb/getpfgatewayuserdata')


module.exports = {
    retrievepfgatewayusersdata: async function (user_id, query) {
        return await fetchrecords.selectDataCorrespondingToUserId(user_id, query)
    },

    retrievepfgatewayapplicationssdata: async function (app_id, reseller_id, query) {
        return await fetchrecords.selectDataCorrespondingToAppIdResellerId(app_id, reseller_id, query)
    }
}