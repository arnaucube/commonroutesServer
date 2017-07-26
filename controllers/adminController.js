//File: controllers/userController.js
var mongoose = require('mongoose');
var userModel = mongoose.model('adminModel');

var config = require('../config');
var pageSize = config.pageSize;

/* */
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var express = require("express");
var app = express();
var config = require('../config'); // get our config file
app.set('superSecret', config.secret); // secret variable

var crypto = require('crypto');
/* */

var request = require('request');


//POST - Insert a new User in the DB
exports.signup = function(req, res) {
    //get random avatar
    var r = getRand(1, 10);
    randAvatar = getAvatar(r);


    var user = new userModel({
        username: req.body.username,
        password: crypto.createHash('sha256').update(req.body.password).digest('base64'),
        description: req.body.description,
        avatar: randAvatar,
        email: req.body.email,
        phone: req.body.phone,
        telegram: req.body.telegram
    });
    if (user.username == undefined) {
        return res.status(500).jsonp("empty inputs");
    } else if (user.password == undefined) {
        return res.status(500).jsonp("empty inputs");
    } else if (user.email == undefined) {
        return res.status(500).jsonp("empty inputs");
    }

    user.save(function(err, user) {
        if (err) return res.send(500, err.message);

        exports.login(req, res);
    });
};


//POST - auth user
exports.login = function(req, res) {
    // find the user
    userModel.findOne({
            username: req.body.username
        })
        .select('+password')
        .exec(function(err, user) {

            if (err) throw err;

            if (!user) {
                res.json({
                    success: false,
                    message: 'Authentication failed. User not found.'
                });
            } else if (user) {

                req.body.password = crypto.createHash('sha256').update(req.body.password).digest('base64');

                // check if password matches
                if (user.password != req.body.password) {
                    res.json({
                        success: false,
                        message: 'Authentication failed. Wrong password.'
                    });
                } else {

                    // if user is found and password is right
                    // create a token
                    var token = jwt.sign({
                        foo: 'bar'
                    }, app.get('superSecret'), {
                        //expiresInMinutes: 1440 // expires in 24 hours
                        //expiresIn: '60m'
                    });
                    user.token = token;
                    user.save(function(err, user) {
                        if (err) return res.send(500, err.message);
                        //res.status(200).jsonp(travel);
                        console.log(user);
                        // return the information including token as JSON
                        user.password = "";
                        res.json({
                            success: true,
                            message: 'Enjoy your token!',
                            token: token,
                            user: user
                        });
                    });

                }

            }

        });
};
exports.changePassword = function(req, res) {
    //if(req.body.)
    userModel.update({
            'token': req.headers['x-access-token']
        }, req.body,
        function(err) {
            if (err) return console.log(err);
            exports.getUserByToken(req, res);
        });
};
