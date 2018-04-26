/*
script to reset password for a user
*/

var config = require('./config');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var crypto = require('crypto');

var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
// Connection to DB
mongoose.connect(config.database, function(err, res) {
    if (err) {
        console.log(err);
    };
    console.log('Connected to Database');
});

var userMdl = require('./models/userModel');
var userModel = mongoose.model('userModel');

var readlineSync = require('readline-sync');



console.log("Welcome to Common Routes");
console.log("----------");
console.log("This is the resetPassword.js");


var username = readlineSync.question('Enter the username: ');
if ((username == "")) {
  console.log("username can't be empty");
  process.exit(0);
}

console.log('Hi ' + username + '!');


var clearPassword = readlineSync.question('Enter the new password: ', {
  hideEchoBack: true // The typed text on screen is hidden by `*` (default).
});
var clearPassword2 = readlineSync.question('Enter the new password again: ', {
  hideEchoBack: true // The typed text on screen is hidden by `*` (default).
});
if (clearPassword != clearPassword2) {
  console.log("passwords don't match");
  process.exit(0);
}
if (clearPassword == "undefined") {
  console.log("Password can't be empty");
  process.exit(0);
}
/*if (clearPassword.length < 10) {
  console.log("Please, choose a password with more than 10 characters");
  process.exit(0);
}*/


var newPassword = crypto.createHash('sha256').update(clearPassword).digest('base64')
console.log(newPassword);
userModel.findOne({
    username: username
  })
  .select('+password')
  .exec(function(err, user) {
    if (err) {
      console.log(err);
      process.exit(0);
    }
    console.log(user);

    if (!user) {
      console.log("user not found");
      process.exit(0);
    } else if (user) {
      user.password = newPassword;
      user.save(function(err, user) {
        if (err) {
          console.log(err);
          process.exit(0);
        }

        console.log("password successfully changed");
        process.exit(0);
      });
    }

  });
