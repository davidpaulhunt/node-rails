'use strict';

const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: './dev.sqlite3',
  },
  pool: {
    min: 1, max: 1,
  },
});

const bookshelf = require('bookshelf')(knex);

module.exports = bookshelf;
