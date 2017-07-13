//File: controllers/userController.js
var mongoose = require('mongoose');
var userModel = mongoose.model('userModel');
var notificationModel = mongoose.model('notificationModel');
var travelModel = mongoose.model('travelModel');

var config = require('../config');
var pageSize=config.pageSize;

/* */
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var express = require("express");
var app = express();
var config = require('../config'); // get our config file
app.set('superSecret', config.secret); // secret variable

var crypto = require('crypto');
/* */

var request = require('request');

function getRand(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}
function getAvatar(n){
    switch (n) {
        case 1:
            avatar = "img/avatars/racoon.png";
            break;
        case 2:
            avatar = "img/avatars/duck.png";
            break;
        case 3:
            avatar = "img/avatars/clown-fish.png";
            break;
        case 4:
            avatar = "img/avatars/tiger.png";
            break;
        case 5:
            avatar = "img/avatars/sloth.png";
            break;
        case 6:
            avatar = "img/avatars/penguin.png";
            break;
        case 7:
            avatar = "img/avatars/owl.png";
            break;
        case 8:
            avatar = "img/avatars/chameleon.png";
            break;
        case 9:
            avatar = "img/avatars/siberian-husky.png";
            break;
        case 10:
            avatar = "img/avatars/toucan.png";
            break;
        default:
            avatar = "img/avatars/racoon.png";
    }
    return avatar;
}

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

//GET - Return all Users in the DB
exports.getAllUsers = function(req, res) {
    userModel.find()
        .limit(pageSize)
        .skip(pageSize * Number(req.query.page))
        .exec(function(err, users) {
            if (err) return res.send(500, err.message);
            res.status(200).jsonp(users);
        });
};

exports.getUserById = function(req, res) {
    userModel.findOne({
            _id: req.params.userid
        })
        .lean()
        .populate('travels', 'title from to date type')
        .exec(function(err, user) {
            if (err) return res.send(500, err.message);
            if (!user) {
                res.json({
                    success: false,
                    message: 'User not found.'
                });
            } else if (user) {
                res.status(200).jsonp(user);
            }
        });
};
exports.getUserByToken = function(req, res) {
    userModel.findOne({
            'token': req.headers['x-access-token']
        })
        .lean()
        .populate('travels', 'title from to date')
        .exec(function(err, user) {
            if (err) return res.send(500, err.message);
            if (!user) {
                res.json({
                    success: false,
                    message: 'User not found.'
                });
            } else if (user) {

                res.status(200).jsonp(user);
            }
        });
};

exports.getTravelsByUserId = function(req, res) {
    travelModel.find({
            user: req.params.userid
        })
        .lean()
        .exec(function(err, travels) {
            if (err) return res.send(500, err.message);
            travelModel.find({
                    joins: req.params.userid
                })
                .lean()
                .exec(function(err, joins) {
                    if (err) return res.send(500, err.message);
                    res.json({
                        travels: travels,
                        joins: joins
                    });
                });
        });
};
exports.getUserLikes = function(req, res) {
    userModel.findOne({
            _id: req.params.userid
        })
        .lean()
        .populate('likes', 'username avatar description')
        .exec(function(err, user) {
            if (err) return res.send(500, err.message);
            if (!user) {
                res.json({
                    success: false,
                    message: 'User not found.'
                });
            } else if (user) {
                res.status(200).jsonp(user.likes);
            }
        });
};
exports.getNumNotificationsByToken = function(req, res) {
    userModel.findOne({
            'token': req.headers['x-access-token']
        })
        .lean()
        .exec(function(err, user) {
            if (err) return res.send(500, err.message);
            if (!user) {
                res.json({
                    success: false,
                    message: 'User not found.'
                });
            } else if (user) {

                res.status(200).jsonp(user.notifications);
            }
        });
};
exports.getNotifications = function(req, res) {
    userModel.findOne({
            'token': req.headers['x-access-token']
        })
        .lean()
        .populate('notifications')
        .exec(function(err, user) {
            if (err) return res.send(500, err.message);
            if (!user) {
                res.json({
                    success: false,
                    message: 'User not found.'
                });
            } else if (user) {

                notificationModel.find({
                        'user': user._id,
                        'state': 'pendent'
                    })
                    .lean()
                    .exec(function(err, notifications) {
                        if (err) return res.send(500, err.message);
                        if (!notifications) {
                            res.json({
                                success: false,
                                message: 'No pendent notifications.'
                            });
                        } else if (notifications) {
                            //here, maybe in the future is better delete the viewed notifications
                            notificationModel.update({
                                    state: "pendent"
                                }, {
                                    state: "viewed"
                                }, {
                                    multi: true
                                },
                                function(err) {
                                    if (err) {
                                        console.log(err);
                                    }
                                }
                            );
                            res.status(200).jsonp(notifications);
                        }
                    });

                //now, clean notifications count from user
                userModel.update({
                        'token': req.headers['x-access-token']
                    }, {
                        notifications: []
                    },
                    function(err) {
                        if (err) {
                            console.log(err);
                        }
                    }
                );
            }
        });
};

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function postImage(req, res, filename, fileImg) {
    url = "http://127.0.0.1:3050/image";
    var importFile = function(fileImg) {
        var decodedFile = new Buffer(fileImg, 'base64');
        var r = request.post(url, function(err, httpResponse, body) {
            if (err) {
                console.log(err);
            }
            //console.log(body);
            updateUserWithNewImages(req, res, body);
        });
        var form = r.form();
        form.append('file', decodedFile, {
            filename: filename + '.png'
        });
    }
    importFile(fileImg);
}

function updateUserWithNewImages(req, res, imgUrl) {
    //adding random number to the url, to force ionic reload the image
    req.body.avatar = imgUrl + "?" + getRandomInt(1, 9999);
    userModel.update({
            'token': req.headers['x-access-token']
        }, req.body,
        function(err) {
            if (err) return console.log(err);
            exports.getUserByToken(req, res);
        });
}
exports.updateUser = function(req, res) {
    if (req.body.newAvatar) {
        urlImg = postImage(req, res, "avatar_" + req.body.username, req.body.newAvatar);
    }
    /*if (req.body.newFaircoin) {
        urlImg = postImage(req, res, "fairdir_"+req.body.username,req.body.newFaircoin);
    }*/
    if (!req.body.newAvatar) {
        updateUserWithNewImages(req, res, req.body.avatar);
    }
    /*userModel.update({
            'token': req.headers['x-access-token']
        }, req.body,
        function(err) {
            if (err) return console.log(err);
            exports.getUserByToken(req, res);
        });*/
};

//DELETE - Delete a user with specified ID
exports.deleteUser = function(req, res) {
    userModel.findOne({
            'token': req.headers['x-access-token']
        })
        .exec(function(err, user) {
            user.remove(function(err) {
                if (err) return res.send(500, err.message);
                res.status(200).jsonp("deleted");
            })
        });
};
exports.likeUser = function(req, res) {
    userModel.findOne({
            'token': req.headers['x-access-token']
        })
        .exec(function(err, userL) {
            if (err) return res.send(500, err.message);
            if (!userL) {
                res.json({
                    success: false,
                    message: 'no user with that token, login again'
                });
            } else if (userL) {

                userModel.findOne({
                        _id: req.params.userid,
                        likes: {
                            '$ne': userL._id
                        }
                    })
                    .exec(function(err, user) {
                        if (err) return res.send(500, err.message);
                        if (!user) {
                            res.json({
                                success: false,
                                message: 'Like not posible, user not exist, or like was already done'
                            });
                        } else if (user) {
                            //res.status(200).jsonp(user);
                            var notification = new notificationModel({
                                concept: "like",
                                message: "user " + userL.username + " adds a like to you",
                                date: new Date(),
                                icon: 'ion-heart',
                                link: "users/" + user._id,
                                user: user._id
                            });
                            notification.save(function(err, notification) {
                                if (err) return res.send(500, err.message);

                                user.likes.push(userL._id);
                                user.notifications.push(notification._id);
                                user.save(function(err, user) {
                                    if (err) return res.send(500, err.message);

                                    exports.getUserById(req, res);
                                });
                            });

                        } //end of else if user
                    });
            } //end of else if userL
        });
};
exports.unlikeUser = function(req, res) {
    userModel.findOne({
            'token': req.headers['x-access-token']
        })
        .exec(function(err, userL) {
            if (err) return res.send(500, err.message);
            if (!userL) {
                res.json({
                    success: false,
                    message: 'no user with that token, login again'
                });
            } else if (userL) {

                userModel.findOne({
                        _id: req.params.userid,
                        likes: userL._id
                    })
                    .exec(function(err, user) {
                        if (err) return res.send(500, err.message);
                        if (!user) {
                            res.json({
                                success: false,
                                message: 'Unlike not posible'
                            });
                        } else if (user) {
                            //res.status(200).jsonp(user);
                            var notification = new notificationModel({
                                concept: "like",
                                message: "user " + userL.username + " removes like on you",
                                date: new Date(),
                                icon: 'ion-heart-broken',
                                link: "users/" + user._id,
                                user: user._id
                            });
                            notification.save(function(err, notification) {
                                if (err) return res.send(500, err.message);

                                var indexOf = user.likes.indexOf(userL._id);
                                user.likes.splice(indexOf, 1);
                                user.notifications.push(notification._id);
                                user.save(function(err, user) {
                                    if (err) return res.send(500, err.message);

                                    exports.getUserById(req, res);
                                });
                            });

                        } //end of else if user
                    });
            } //end of else if userL
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
                concept: "like",
                otherusername: tokenuser.username,
                description: "user " + tokenuser.username + " favs you",
                date: new Date(),
                link: "",
                user: user._id
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
