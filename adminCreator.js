//File: controllers/userController.js
var mongoose = require('mongoose');

var config = require('./config');
//var adminConfig = require('./adminConfig'); // get our config file

mongoose.Promise = global.Promise;
// Connection to DB
mongoose.connect(config.database, function(err, res) {
    if (err) {
        console.log(err);
    };
    console.log('Connected to Database');
});

var express = require("express");
var app = express();
var adminMdl = require('./models/adminModel')(app, mongoose);
var adminModel = mongoose.model('adminModel');


/* */
/*var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var express = require("express");
var config = require('./config'); // get our config file
app.set('superSecret', config.secret); // secret variable
var request = require('request');*/

var crypto = require('crypto');
/* */



var readlineSync = require('readline-sync');

var admin = new adminModel({});

console.log("Welcome to Common Routes");
console.log("----------");
console.log("This is the adminCreator.js");


admin.username = readlineSync.question('Enter the admin name: ');
if ((admin.username == "")) {
    console.log("username can't be empty");
    process.exit(0);
}
console.log('Hi ' + admin.username + '!');

var clearPassword = readlineSync.question('Enter the admin password: ', {
    hideEchoBack: true // The typed text on screen is hidden by `*` (default).
});
var clearPassword2 = readlineSync.question('Enter the admin password again: ', {
    hideEchoBack: true // The typed text on screen is hidden by `*` (default).
});
if (clearPassword != clearPassword2) {
    console.log("passwords don't match");
    process.exit(0);
}
if (clearPassword=="undefined") {
    console.log("Password can't be empty");
    process.exit(0);
}
if (clearPassword.length < 10) {
    console.log("Please, choose a password with more than 10 characters");
    process.exit(0);
}
admin.password = crypto.createHash('sha256').update(clearPassword).digest('base64')

admin.email = readlineSync.question('email: ');
admin.phone = readlineSync.question('phone: ');
admin.telegram = readlineSync.question('telegram: ');

if (admin.email == undefined) {
    console.log("username or email empty");
    process.exit(0);
}

console.log(admin);

admin.save(function(err, admin) {
    if (err){
        console.log(err.message);
        process.exit(0);
    }

    console.log("admin created correctly");
    process.exit(0);
});
