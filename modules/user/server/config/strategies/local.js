'use strict';

/**
 * Module dependencies
 */
var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  User = require('mongoose').model('User');

module.exports = function () {
  // Use local strategy
  passport.use(new LocalStrategy({
    usernameField: 'userName',
    passwordField: 'password'
  },function (userName, password, done) {
    console.log("11111111111111111111111111111111111111");
    console.log(done);
    console.log("11111111111111111111111111111111111111");
    User.findOne({
      $or: [{
        userName: userName.toLowerCase()
      }, {
        email: userName.toLowerCase()
      }]
    }, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user || !user.authenticate(password)) {
        return done(null, false, {
          message: 'Invalid username or password (' + (new Date()).toLocaleTimeString() + ')'
        });
      }
      return done(null, user);
    });
  }));
};
