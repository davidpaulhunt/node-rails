'use strict';

const BaseController = require('./base_controller');
const User = require('../models/user');

class UsersController extends BaseController {
  userParams(params) {
    return this.validParams(params).require('user').permit('username');
  }

  index(params) {
    return this.action('index', (params) => {
      return User.all().then(users => users.map(user => user.toAPI()));
    })(params);
  }

  create(params) {
    return this.action('create', (params) => {
      return new User(this.userParams(params)).save().then(user => user.toAPI()).catch((e) => {
        console.error(e);
        return Promise.reject(e);
      });
    })(params);
  }

  show(params) {
    return this.action('show', (params) => {
      const id = params.user_id;
      if (id) {
        return User.find(id).then(user => user.toAPI());
      }
      throw new Error('Missing param: user_id');
    })(params);
  }
}

module.exports = new UsersController({
  model: User,
});
//
// UsersController.index = function index(params, callback) {
//   return User.fetchAll().then(users => {
//     return users.map(user => user.toAPI());
//   }).nodeify(callback);
// }
//
// UsersController.create = function create(params, callback) {
//   return new User(userParams(params)).save().then(user => {
//     return user.toAPI();
//   }).nodeify(callback);
// }
//
// UsersController.show = function show(params, callback) {
//   return new User({ id: params.user_id }).fetch().then(user => {
//     return user.toAPI();
//   }).nodeify(callback);
// }
//
// module.exports = UsersController;
