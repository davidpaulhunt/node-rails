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
const _ = require('lodash');
const Promise = require('bluebird');
const ValidationError = require('../helpers/validation_error');

class Base {
  constructor(attrs, options) {
    this.attributes = {};

    _.forIn(attrs, (value, key) => {
      this.attributes[key] = value;
    });

    this._className = this.constructor.className();
    this._tableName = this.constructor.tableName();
  }

  static find(id) {
    return knex(this.tableName()).where({ id }).first().then(attrs => {
      return new this(attrs)
    });
  }

  static findBy(column, value) {
    return knex(this.tableName()).where(column, value).first().then(attrs => {
      return new this(attrs)
    });
  }

  static where(options) {
    return knex(this.tableName()).where(options).then(records => {
      return records.map(record => new this(record));
    });
  }

  static all() {
    return knex(this.tableName()).then(records => {
      return records.map(record => new this(record));
    });
  }

  isPersisted() {
    return !!this.get('id');
  }

  set(attr, value) {
    if (_.isPlainObject(attr)) {
      _.forIn(attr, (value, key) => {
        this.set(key, value);
      });
    } else {
      if (this.attributes[attr]) {
        this.changes[attr] = this.attributes[attr];
      }
      this.attributes[attr] = value;
    }

    return this;
  }

  get(attr) {
    return this.attributes[attr];
  }

  validateSave() {
    return Promise.resolve(this);
  }

  save() {
    let fn;
    if (this.isPersisted()) {
      this.attributes('updated_at', new Date());
      fn = knex(this._tableName).update(this.attributes).where({ id: this.attributes.id });
    } else {
      const date = new Date();
      this.set({ created_at: date, updated_at: date });

      fn = knex(this._tableName).insert(this.attributes).then((id) => {
        return this.set('id', id);
      });
    }

    return this.validateSave().then(() => {
      return fn.then(() => { return this; });
    }).catch((e) => {
      console.error(e);
      throw new ValidationError(e);
    });
  }

  update(attr, value) {
    this.set(attr, value).save();
  }

  refresh() {
    if (this.attributes.id) {
      return knex(this._tableName).where({ id: this.attributes.id }).first().then(attrs => {
        return this.set(attrs);
      });
    }
    return this;
  }

  destroy() {
    if (this.attributes.id) {
      return knex(this._tableName).where({ id: this.attributes.id }).del();
    }
    return this;
  }
}

module.exports = Base;
