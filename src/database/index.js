const knex = require ('knex');
const knexfile = require('./../../knexfile')
knex(knexfile)
const db = knex(knexfile)

module.exports = db;