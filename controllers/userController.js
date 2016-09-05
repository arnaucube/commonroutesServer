//File: controllers/userController.js
var mongoose = require('mongoose');
var userModel  = mongoose.model('userModel');

/* */
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var express         = require("express");
var app             = express();
var config = require('../config'); // get our config file
app.set('superSecret', config.secret); // secret variable
/* */

//GET - Return all Users in the DB
exports.findAllUsers = function(req, res) {
	userModel.find(function(err, users) {
    if(err) res.send(500, err.message);

	//password deletion
	for(var i=0; i<users.length; i++)
	{
		users[i].password="";
		console.log(users[i].password);
	}

    console.log('GET /users');
		res.status(200).jsonp(users);
	});
};

//GET - Return a User with specified ID
exports.findById = function(req, res) {
	userModel.findById(req.params.id, function(err, user) {
    if(err) return res.send(500, err.message);

    console.log('GET /users/' + req.params.id);
	//password deletion

		user.password="";
		res.status(200).jsonp(user);
	});
};

exports.findUserByUsername = function(req, res) {
    userModel.find({
      username: req.params.username
  }, function(err, user) {

      if (err) throw err;

      if (!user) {
        res.json({ success: false, message: 'no user found' });
    } else if (user) {
          // return the information including token as JSON
          //res.jsonp(user);
		  user.password="";
          console.log(user);
	  		res.status(200).jsonp(user[0]);


      }

    });
};

//POST - Insert a new User in the DB
exports.addUser = function(req, res) {
	console.log('POST new user, name: ' + req.body.username);
	//console.log(req.body);

	var user = new userModel({
		username: req.body.username,
		password: req.body.password,
	    description:   req.body.description,
	    avatar:   req.body.avatar,
	    mail:   req.body.mail,
		phone: req.body.phone,
		telegram: req.body.telegram
	});

	user.save(function(err, user) {
		if(err) return res.send(500, err.message);
    res.status(200).jsonp(user);
	});
};

//PUT - Update a user already exists
exports.updateUser = function(req, res) {
	userModel.findById(req.params.id, function(err, user) {
		user.username   = req.body.username;
		user.password    = req.body.password;
		user.description = req.body.description;
		user.avatar  = req.body.avatar;
		user.mail = req.body.mail;
		user.phone   = req.body.phone;
		user.telegram = req.body.telegram;

		user.save(function(err) {
			if(err) return res.send(500, err.message);
			user.password="";
      	res.status(200).jsonp(user);
		});
	});
};

//DELETE - Delete a user with specified ID
exports.deleteUser = function(req, res) {
	userModel.findById(req.params.id, function(err, user) {
		user.remove(function(err) {
			if(err) return res.send(500, err.message);
      		res.status(200).jsonp(req.params.id);
		    console.log('DELETE /users/' + req.params.id);
		})
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
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

      // check if password matches
      if (user.password != req.body.password) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {

        // if user is found and password is right
        // create a token
        var token = jwt.sign(user, app.get('superSecret'), {
          //expiresInMinutes: 1440 // expires in 24 hours
		  //expiresIn: '60m'
        });
console.log(user);
        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token,
		  avatar: user.avatar
        });
      }

    }

  });
};
