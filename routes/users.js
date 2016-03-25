'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const router = express.Router();
const Controller = require('../controllers/users_controller');

router.get('/', (req, res, next) => {
  return Controller.index(req.params).then(users => {
    res.render('users/index', { users: users });
  }).catch(console.error);
});

router.post('/', urlencodedParser, (req, res, next) => {
  return Controller.create({ user: req.body }).then(user => {
    res.redirect(`users/${user.id}`);
  }).catch((e) => {
    console.error(e);
    res.status(500).send(e.message);
  });
});

router.get('/new', (req, res, next) => {
  res.render('users/new');
});

router.get('/:user_id', (req, res, next) => {
  return Controller.show(req.params).then(user => {
    res.render('users/show', { user });
  }).catch(console.error);
});

module.exports = router;
