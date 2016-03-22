'use strict';

exports.up = function up(knex, Promise) {
  return knex.schema.createTable('users', (table) => {
    table.increments();
    table.string('username');
    table.timestamps();
  });
};

exports.down = function down(knex, Promise) {

};
