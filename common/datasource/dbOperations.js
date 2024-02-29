var config = require('config')
var dbConfig = require('../setup/dbConfig')
const oracledb = require('oracledb')

async function getUpdate() {
    try { 
        let pool = await oracledb.getConnection(config)
        let update = await pool.execute("select * from PF_GATEWAY_USERS")
        return update.UPDATE
    }
    catch (err) {
        console.log(err)
    }
}

module.exports = {
    getUpdate:getUpdate
}