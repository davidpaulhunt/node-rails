'use strict';

const bookshelf = require('../services/bookshelf');
const RequireParams = require('../helpers/require_params');
const _ = require('lodash');
const Promise = require('bluebird');

class BaseController {
  constructor(options) {
    this._bookshelf = bookshelf;
    this.RequireParams = RequireParams;

    if (options) {
      ['model', 'beforeFilters'].map(opt => {
        if (options[opt]) {
          this[opt] = options[opt];
        }
      });
    }

    this._idKey = `${_.lowerCase(this.model.className)}_id`;
  }

  validParams(params) {
    return new RequireParams(params);
  }

  runFilters(filterType, actionName, params) {
    const filterName = `${filterType}Filters`;
    if (this[filterName] && this[filterName][actionName]) {
      return Promise.map(this[filterName][actionName], (filter) => {
        return Promise.resolve(filter(params));
      });
    }
    return Promise.resolve(true);
  }

  action(actionName, method) {
    return (params) => {
      return method(params);
    }
  }

  index(params) {
    return this.action('index', (params) => {
      return this.model.fetchAll().then(collection => collection.map(model => model.toAPI()));
    })(params);
  }

  create(params) {
    return this.action('create', (params) => {
      return new this.model(params).save().then(model => model.toAPI());
    })(params);
  }

  show(params) {
    return this.action('show', (params) => {
      const id = params[this.idKey];
      return new Promise(res => {
        if (id) {
          res(new this.model({ id }).fetch().then(model => model.toAPI()));
        } else {
          throw new Error(`Missing param: ${this.idKey}`);
        }
      });
    })(params);
  }

  update(params) {
    return this.action('update', (params) => {
      const id = params[this.idKey];
      return new Promise(res => {
        if (id) {
          res(new this.model({ id }).fetch().then(model => {
            return model.set(params[`${_.lowerCase(this.model.className)}`]);
          }));
        } else {
          throw new Error(`Missing param: ${this.idKey}`);
        }
      });
    })(params);
  }

  destroy(params) {
    return this.action('destroy', (params) => {
      const id = params[this.idKey];
      return new Promise(res => {
        if (id) {
          res(new this.model({ id }).destroy().then(() => {
            return `${this.model.className} destroyed`;
          }));
        } else {
          throw new Error(`Missing param: ${this.idKey}`);
        }
      });
    })(params);
  }
}

module.exports = BaseController;
