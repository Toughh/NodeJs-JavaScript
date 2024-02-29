const dbConfig = require('../../setup/dbConfig');

module.exports = {
    selectDataCorrespondingToUserId: async function (user_id, query) {
        let pool = dbConfig.check();
        const res = (await pool).getConnection();
        try {
            const result = await (await res).execute(query, [user_id])
            console.log(result);

            (await res).commit();
            (await pool).close();

            return result && result.rows && result.rows[0][0]

        } catch (e) {
            throw (e)
        }
    },

    selectDataCorrespondingToAppIdResellerId: async function (app_id, reseller_id, query) {
        let pool = dbConfig.check();
        const res = (await pool).getConnection();
        try {
            const result = await (await res).execute(query, [app_id][reseller_id])
            console.log(result);

            (await res).commit();
            (await pool).close();

            return result && result.rows && result.rows[0][0]

        } catch (e) {
            throw (e)
        }
    }
}