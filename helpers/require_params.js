'use strict';

class RequireParams {
  constructor(params) {
    this.params = params;
    console.log(this.params);
  }
  require(key) {
    if (!this.params || !this.params[key]) {
      throw new Error(`Missing param: ${key}`);
    }

    this.params = this.params[key];

    return this;
  }
  permit() {
    const attrs = {};

    Array.from(arguments).map(field => {
      if (this.params[field]) {
        attrs[field] = this.params[field];
      }
    });

    return attrs;
  }
}

module.exports = RequireParams;
