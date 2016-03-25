'use strict';

const bookshelf = require('../services/bookshelf');
const Checkit = require('checkit');
const Base = require('./base_model');

class User extends Base {
  static tableName() {
    return 'users';
  }

  static className() {
    return 'User';
  }

  constructor(attrs) {
    super(attrs);
  }

  validateSave() {
    return new Checkit({
      username: 'required',
    }).run(this.attributes);
  }

  toAPI() {
    return this.attributes;
  }
}

module.exports = User;
