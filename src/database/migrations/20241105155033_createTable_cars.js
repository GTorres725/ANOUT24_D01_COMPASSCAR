/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
        .createTable('cars', (t)=> {
            t.increments('id').primary();
            t.string('brand').notNullable();
            t.string('model').notNullable();
            t.string('plate').notNullable().unique();
            t.integer('year').notNullable();
            t.datetime('created_At').defaultTo(knex.fn.now());
        })
        .createTable('cars_items', (t)=> {
            t.increments('id').primary();
            t.string('name').notNullable();
            t.integer('car_id').notNullable().references('id').inTable('cars');
            t.datetime('created_At').defaultTo(knex.fn.now());
        })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTable('cars')
    .dropTable('cars_items')
};
