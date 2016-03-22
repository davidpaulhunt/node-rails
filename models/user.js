'use strict';

const bookshelf = require('../services/bookshelf');
const Checkit = require('checkit');

const User = module.exports = bookshelf.Model.extend({
  tableName: 'users',
  className: 'User',
  hasTimestamps: ['created_at', 'updated_at'],
  initialize: function initialize(attrs, opts) {
    console.log(arguments);
    this.on('saving', this.validateSave);
  },
  validateSave: function validateSave() {
    return new Checkit({
      username: 'required',
    }).run(this.attributes);
  },
  toAPI: function toAPI() {
    return {
      id: this.get('id'),
      username: this.get('username'),
    };
  },
});
