var config = require('../config');
var pageSize=config.pageSize;

var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var express = require("express");
var app = express();
app.set('superSecret', config.secret); // secret variable

var crypto = require('crypto');
var mongoose = require('mongoose');
var userModel = mongoose.model('userModel');
var notificationModel  = mongoose.model('notificationModel');
var travelModel  = mongoose.model('travelModel');

exports.searchByString = function (req, res) {
    console.log(req.params.searchstring);
    userModel.find({
        username: new RegExp(req.params.searchstring, "i")
    })//to return all the objects containing the string, having exactly the same string
        .limit(pageSize)
        .skip(pageSize * Number(req.query.page))
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
            })//to return all the objects containing the string, without need of having the same string
                .limit(pageSize)
                .skip(pageSize * Number(req.query.page))
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
