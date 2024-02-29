const config = require('config')
const oracledb = require('Oracledb')

module.exports = {
  check: async function () {
    return oracledb.createPool({

      username: config.get('db.core.username'),
      password: config.get('db.core.password'),
      connectString: config.get('db.core.connectString'),
      poolMax: 1,
      poolMin: 1,
      poolIncrement: 0
    })
  }
}

  // function (err, pool) {
  //   if (err) { console.error(err.message); return; }
  //   pool.getConnection(function (err, connection) {
  //     console.log('Trying to connect to database....')
  //     if (err) { console.error(err.message); return; }
  //     console.log('Connection was successful!!!')

  //     connection.close(
  //       function (err) {
  //         if (err) { console.error(err.message); return; }
  //         console.log('Database connection is closed!!!')
  //       });
  //   });
  // });
