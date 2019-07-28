const options = require('./options')
const { Pool } = require('pg')

const pool = new Pool({
  user: options.database.user,
  host: options.database.host,
  database: options.database.db,
  password: options.database.pass,
  port: options.database.port,
})

module.exports = {
  query: function(text, values) {
    return new Promise((resolve, reject) => {
      pool.connect()
        .then(client => {
          client.query(text, values)
            .finally(() => client.release())
            .then(res => resolve(res))
            .catch(err => reject(err))
        })
    })

  }
}
