//File: controllers/userController.js
var mongoose = require('mongoose');
var userModel = mongoose.model('userModel');


/* */
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var express = require("express");
var app = express();
var config = require('../config'); // get our config file
app.set('superSecret', config.secret); // secret variable

var crypto = require('crypto');
/* */

//POST - Insert a new User in the DB
exports.addUser = function(req, res) {
    console.log('POST new user, name: ' + req.body.username);
    //console.log(req.body);

    var user = new userModel({
        username: req.body.username,
        password: crypto.createHash('sha256').update(req.body.password).digest('base64'),
        description: req.body.description,
        avatar: req.body.avatar,
        mail: req.body.mail,
        phone: req.body.phone,
        telegram: req.body.telegram
    });
    if (user.username == undefined) {
        return res.status(500).jsonp("empty inputs");
    } else if (user.password == undefined) {
        return res.status(500).jsonp("empty inputs");
    } else if (user.mail == undefined) {
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
    }, function(err, user) {

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
                var token = jwt.sign(user, app.get('superSecret'), {
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

//GET - Return all Users in the DB
exports.findAllUsers = function(req, res) {
    userModel.find(function(err, users) {
        if (err) res.send(500, err.message);

        //password deletion
        for (var i = 0; i < users.length; i++) {
            users[i].password = "";
            users[i].token = "";
            console.log(users[i].password);
        }

        console.log('GET /users');
        res.status(200).jsonp(users);
    });
};

//GET - Return a User with specified ID
exports.findById = function(req, res) {
    userModel.findById(req.params.id, function(err, user) {
        if (err) return res.send(500, err.message);

        console.log('GET /users/' + req.params.id);
        //password deletion
        if (user != null) {
            user.password = "";
            users.token = "";
        }
        res.status(200).jsonp(user);
    });
};

exports.findUserByUsername = function(req, res) {
    userModel.find({
        username: req.params.username
    }, function(err, user) {

        if (err) throw err;

        if (!user) {
            res.json({
                success: false,
                message: 'no user found'
            });
        } else if (user) {
            // return the information including token as JSON
            //res.jsonp(user);
            user.password = "";
            users.token = "";
            console.log(user);
            res.status(200).jsonp(user[0]);


        }

    });
};



/* fav */
exports.addFav = function(req, res) {
    var tokenuser;
    userModel.find({
        token: req.headers['x-access-token']
    }, function(err, users) {
        tokenuser = users[0];
    });
    userModel.findById(req.params.userId, function(err, user) {

        // first search if user have already said like
        var favRepeated = false;
        for (var i = 0; i < user.favs.length; i++) {
            if (user.favs[i].username == tokenuser.username) {
                favRepeated = true;
            }
        }
        console.log("favRepeated: " + favRepeated);
        if (favRepeated == false) {
            //fav
            var fav = {
                userId: tokenuser._id,
                username: tokenuser.username,
                avatar: tokenuser.avatar
            };
            user.favs.push(fav);

            //notification
            var notification = {
                type: "fav",
                otherusername: tokenuser.username,
                description: "user " + tokenuser.username + " favs you",
                date: new Date(),
                link: ""
            };
            user.notifications.push(notification);

            user.save(function(err, user) {
                if (err) return res.send(500, err.message);


                //once saved, send the users json to client
                userModel.find(function(err, users) {
                    if (err) res.send(500, err.message);
                    res.status(200).jsonp(users);
                });
            });
        } else {
            userModel.find(function(err, users) {
                if (err) res.send(500, err.message);
                res.status(200).jsonp(users);
            });
        }

    });
};
exports.doUnfav = function(req, res) {
    var tokenuser;
    userModel.find({
        token: req.headers['x-access-token']
    }, function(err, users) {
        tokenuser = users[0];
    });

    userModel.findById(req.params.userId, function(err, user) {
        for (var i = 0; i < user.favs.length; i++) {
            if (user.favs[i].username == tokenuser.username) {
                user.favs.splice(i, 1);
            }
        }

        user.save(function(err, travel) {
            if (err) return res.send(500, err.message);
            //res.status(200).jsonp(travel);
            userModel.find(function(err, users) {
                if (err) res.send(500, err.message);
                res.status(200).jsonp(users);
            });
        });
    });
};

//PUT - Update a user already exists
exports.updateUser = function(req, res) {
    userModel.findById(req.params.id, function(err, user) {
        user.username = req.body.username;
        user.password = md5(req.body.password);
        user.description = req.body.description;
        user.avatar = req.body.avatar;
        user.mail = req.body.mail;
        user.phone = req.body.phone;
        user.telegram = req.body.telegram;

        user.save(function(err) {
            if (err) return res.send(500, err.message);
            user.password = "";
            users.token = "";
            res.status(200).jsonp(user);
        });
    });
};

//DELETE - Delete a user with specified ID
exports.deleteUser = function(req, res) {
    userModel.findById(req.params.id, function(err, user) {
        user.remove(function(err) {
            if (err) return res.send(500, err.message);
            res.status(200).jsonp(req.params.id);
            console.log('DELETE /users/' + req.params.id);
        })
    });
};
