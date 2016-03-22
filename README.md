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
