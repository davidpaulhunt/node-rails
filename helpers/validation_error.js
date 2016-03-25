'use strict';

const _ = require('lodash');

class ValidationError {
  constructor(checkitError) {
    this.errors = {};
    const fullMessages = [];

    _.forIn(checkitError.errors, (iErrors, name) => {
      this.errors[name] = {};
      fullMessages.push(iErrors.message);
    });

    this.message = fullMessages.join('. ');
  }
}

module.exports = ValidationError;
