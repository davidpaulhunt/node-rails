'use strict';

const bookshelf = require('../services/bookshelf');
const RequireParams = require('../helpers/require_params');
const User = require('../models/user');

const UsersController = {};

function userParams(params) {
  return new RequireParams(params).require('user').permit('username');
}

UsersController.index = function index(params, callback) {
  return User.fetchAll().then(users => {
    return users.map(user => user.toAPI());
  }).nodeify(callback);
}

UsersController.create = function create(params, callback) {
  return new User(userParams(params)).save().then(user => {
    return user.toAPI();
  }).nodeify(callback);
}

UsersController.show = function show(params, callback) {
  return new User({ id: params.user_id }).fetch().then(user => {
    return user.toAPI();
  }).nodeify(callback);
}

module.exports = UsersController;
