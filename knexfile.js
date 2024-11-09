require('dotenv').config()

module.exports = {
    client: 'mysql2',
    connection: {
      host: process.env.SQL_HOST,
      user: process.env.SQL_USER,
      password: process.env.SQL_PASS,
      database: process.env.SQL_DATABASE,
      port: process.env.SQL_PORT
    },
    migrations: {
      directory: './migrations'
  },
  seeds: {
    directory: './seeds'
  }
};
