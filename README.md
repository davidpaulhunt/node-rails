# node-rails example
Example of making an Express app feel more like Rails.

# Flow
* Routes call on the controller
* Controllers direct helpers like `RequireParams` and models to serve request
* Model methods return a Model or Collection
* Controllers are responsible for returning JSON, usually by calling `model.toAPI()`

# Getting it going
1. Clone it
2. `npm install`
3. `DEBUG=node-rails:* ./bin/www`
4. See it at [localhost:3000](http://localhost:3000/)

# Using BaseController
```js
const BaseController = require('./base_controller');

class FooController extends BaseController {
  fooParams(params) {
    return this.validParams(params).permit('foo').require('bar_id', 'cool_attribute');
  }

  changeSomething(params) {
    return this.action('changeSomething', (params) => {
      // do something and return here
    })(params);
  }
}

module.exports = new FooController({
  model: Foo,
});
```

# User BaseModel
```js
const Base = require('./base_model');
const Checkit = require('checkit');

class Foo extends Base {
  // declare tableName and className
  static tableName() {
    return 'foos';
  }

  static className() {
    return 'Foo';
  }

  validateSave(attrs) {
    return new Checkit({
      bar_id: 'required',
    }).run(this.attributes);
  }

  toAPI() {
    return {
      // special objecty stuff here
    }
  }
}

module.exports = Foo;
```
