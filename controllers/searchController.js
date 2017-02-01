//File: controllers/userController.js
var mongoose = require('mongoose');
var userModel = mongoose.model('userModel');
var notificationModel  = mongoose.model('notificationModel');
var travelModel  = mongoose.model('travelModel');


/* */
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var express = require("express");
var app = express();
var config = require('../config'); // get our config file
app.set('superSecret', config.secret); // secret variable

var crypto = require('crypto');
/* */


exports.searchByString = function (req, res) {
    console.log(req.params.searchstring);
    userModel.find({
        username: new RegExp(req.params.searchstring, "i")
    })//perquè retorni tots els objectes que continguin l'string sense necessitat de que sigui exactament la mateixa string
        .limit(Number(req.query.pageSize))
        .skip(Number(req.query.pageSize) * Number(req.query.page))
        .lean()
        .select('username avatar')
        .exec(function (err, users) {
            if (err) return res.send(500, err.message);
            travelModel.find({
                $or:[
                    {'from.name': new RegExp(req.params.searchstring, "i")},
                    {'to.name': new RegExp(req.params.searchstring, "i")},
                    {title: new RegExp(req.params.searchstring, "i")}
                ]
            })//perquè retorni tots els objectes que continguin l'string sense necessitat de que sigui exactament la mateixa string
                .limit(Number(req.query.pageSize))
                .skip(Number(req.query.pageSize) * Number(req.query.page))
                .lean()
                .select('title from to date type')
                .exec(function (err, travels) {
                    if (err) return res.send(500, err.message);
                    res.json({
                        users: users,
                        travels: travels
                    });
                });//travels
        });//users
};
