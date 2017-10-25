'use strict';
module.exports = function(app, passport) {
  var users = require('../controllers/UserController');
  var VerifyToken = require("../auth/VerifyToken");

  app.route("/user/authenticate")
    .post(users.authenticate);

  app.route('/users')
    .get(users.list_all_users)
    .post(users.create_an_user);

  app
    .route("/users/:userId")
    .get(VerifyToken, users.read_an_user)
    .put(users.update_an_user)
    .delete(users.delete_an_user);
};