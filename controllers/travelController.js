var request = require('request');

var config = require('../config');
var pageSize=config.pageSize;

//import data models
var mongoose = require('mongoose');
var userModel  = mongoose.model('userModel');
var notificationModel  = mongoose.model('notificationModel');
var travelModel  = mongoose.model('travelModel');
var commentModel  = mongoose.model('commentModel');

exports.getAllTravels = function(req, res) {
	//get travels with futures dates ($gte - greater than and equal than)
	travelModel.find({date: {$gte: new Date()}})
	.sort('date')
    .limit(pageSize)
    .skip(pageSize * Number(req.query.page))
    .lean()
    .populate('user', 'username avatar validated')
    .exec(function (err, travels) {
        if (err) return res.send(500, err.message);
        res.status(200).jsonp(travels);
    });
};

exports.getTravelById = function (req, res) {
    travelModel.findOne({_id: req.params.travelid})
    .lean()
    .populate('user', 'username avatar validated telegram phone')
    .populate('joins', 'username avatar')
    .populate('joinPetitions', 'username avatar')
    .populate('comments', 'comment user')
    .exec(function (err, travel) {
        if (err) return res.send(500, err.message);
        if (!travel) {
            res.json({success: false, message: 'travel not found.'});
        } else if (travel) {

            res.status(200).jsonp(travel);
        }
    });
};

exports.addTravel = function(req, res) {
	userModel.findOne({'token': req.headers['x-access-token']})
	.exec(function(err, user){
		if (err) return res.send(500, err.message);
		if (!user) {
			console.log("user not found");
            res.json({success: false, message: 'User not found.'});
        } else if (user) {
			var travel = new travelModel({
				title: req.body.title,
			    description:   req.body.description,
			    user:   user._id,
			    from:   req.body.from,
			    to:   req.body.to,
			    date:   req.body.date,
				periodic: req.body.periodic,
			    generateddate: Date(),
				seats: req.body.seats,
				package: req.body.package,
				collectivized: req.body.collectivized,
				type: req.body.type
			});

			travel.save(function(err, travel) {
				if(err) return res.send(500, err.message);

				// send travel to telegram bot
				request({
				  uri: 'http://127.0.0.1:3003/api/travel',
				  method: 'POST',
				  json: travel
				}, function (error, response, body) {
				  if (!error && response.statusCode == 200) {
				    // console.log(body.id) // Print the shortened url.
				  } else if (error){
						console.log("error sending travel to bot: " + error);
					}
				});


				user.travels.push(travel._id);
				user.save(function (err, user) {
                    if (err) return res.send(500, err.message);
					exports.getAllTravels(req, res);
                });
			});//end of travel.save
		}
	});//end of usermodel.find


};

exports.updateTravel = function(req, res) {
	userModel.findOne({'token': req.headers['x-access-token']})
	.exec(function(err, user){
        if (err) return res.send(500, err.message);
				// search if the travel exist for that user
				travelModel.findOne({_id: req.body._id, user: user._id})
				.exec(function(err, travel){
					if (!travel) {
							res.send(500, 'travel not found.');
					} else if (travel) {
						// now update travel
						travelModel.update({
							_id: req.body._id, user: user._id
						}, req.body,
						function(err, travel) {
							if (err) {
								res.send(500, 'travel not found.');
							}
							console.log(travel);
							res.status(200).jsonp(travel);
						});
					}
				});


    });
};

exports.deleteTravel = function(req, res) {
	userModel.findOne({'token': req.headers['x-access-token']})
	.exec(function(err, user){
		if (err) return res.send(500, err.message);
		travelModel.findById(req.params.travelid, function(err, travel) {
			if (err) return res.send(500, err.message);
			if(travel.user.equals(user._id))
			{
				travel.remove(function(err) {
					if(err) return res.send(500, err.message);

					console.log("deleted");
					exports.getAllTravels(req, res);
				});
			}
		});
	});
};


exports.addJoinPetition = function(req, res) {
	userModel.findOne({'token': req.headers['x-access-token']})
	.exec(function(err, userJoining){
		if (err) return res.send(500, err.message);
		if (!userJoining) {
            res.json({success: false, message: 'User not found.'});
        } else if (userJoining) {
			travelModel.findOne({
				_id: req.params.travelid,
				user: {'$ne': userJoining._id},
				joins: {'$ne': userJoining._id},
				joinPetitions: {'$ne': userJoining._id}
			})
			.exec(function(err, travel){
				if (err) return res.send(500, err.message);
				if (!travel) {
		            res.json({success: false, message: 'travel not found. You can not join a travel if you have created it, or if you have already joined'});
		        } else if (travel) {
					travel.joinPetitions.push(userJoining._id);
					travel.save(function(err, travel) {
						if(err) return res.send(500, err.message);

						//start saving notification, get user owner of travel
						userModel.findOne({_id: travel.user})
						.exec(function(err, user){
							if (err) return res.send(500, err.message);
							if (!user) {
					            res.json({success: false, message: 'User not found.'});
					        } else if (user) {
							//notification
								var notification = new notificationModel({
									concept: "join",
									message: "user "+userJoining.username+" joins your travel "+travel.title,
									date: new Date(),
									icon: 'ion-person-add',
									link: "travels/" + travel._id,
			                        user: user._id
								});
								notification.save(function(err, notification) {
									if (err) return res.send(500, err.message);
									user.notifications.push(notification._id);
									user.save(function(err, user) {
										if (err) return res.send(500, err.message);

										console.log("notification saved");
										exports.getTravelById(req, res);
									});
								});
							}
						});//end saving notification
					});
				}//end of else if travel
			});
		}//end of else if user
	});
};

exports.unJoin = function(req, res) {
	userModel.findOne({'token': req.headers['x-access-token']})
	.exec(function(err, userJoining){
		if (!userJoining) {
            res.json({success: false, message: 'userJoining not found.'});
        } else if (userJoining) {
			travelModel.findOne({
				_id: req.params.travelid,
				joinPetitions: userJoining._id
			})
			.exec(function(err, travel){
				if (err) return res.send(500, err.message);
				if (!travel) {
		            res.json({success: false, message: 'can not unjoin this travel'});
		        } else if (travel) {
					for(var i=0; i<travel.joinPetitions.length; i++)
					{
						if(travel.joinPetitions[i].equals(userJoining._id))
						{
							travel.joinPetitions.splice(i, 1);
						}
					}
					travel.save(function(err, travel) {
						if(err) return res.send(500, err.message);
						//start saving notification, get user owner of travel
						userModel.findOne({_id: travel.user})
						.exec(function(err, user){
							if (err) return res.send(500, err.message);
							if (!user) {
				            res.json({success: false, message: 'User not found.'});
				        } else if (user) {
								//notification
								var notification = new notificationModel({
									concept: "unjoin",
									message: "user "+userJoining.username+" unjoins your travel "+travel.title,
									date: new Date(),
									icon: 'ion-arrow-return-left',
									link: "travels/" + travel._id,
			                        user: user._id
								});
								notification.save(function(err, notification) {
									if (err) return res.send(500, err.message);
									user.notifications.push(notification._id);
									user.save(function(err, user) {
										if (err) return res.send(500, err.message);

										console.log("notification saved");
										exports.getTravelById(req, res);
									});
								});
							}
						});//end saving notification
					});
				}
			});
		}

	});
};


exports.declineJoin = function(req, res) {
	userModel.findOne({'token': req.headers['x-access-token']})
	.exec(function(err, userOwner){
		if (err) return res.send(500, err.message);
		if (!userOwner) {
            res.json({success: false, message: 'User not found.'});
        } else if (userOwner) {
			travelModel.findOne({
				_id: req.params.travelid,
				user: userOwner._id,
				joinPetitions: req.body.userid
			})
			.exec(function(err, travel){
				if (err) return res.send(500, err.message);
				if (!travel) {
		            res.json({success: false, message: 'travel not found. You can not join a travel if you have created it, or if you have already joined'});
		        } else if (travel) {
					var indexPetition=-1;
					for(var i=0; i<travel.joinPetitions.length; i++)
					{
						if(travel.joinPetitions[i].equals(req.body.userid))
						{
							indexPetition=JSON.parse(JSON.stringify(i));
						}
					}
					if(indexPetition>-1)
					{
						travel.joinPetitions.splice(indexPetition, 1);
					}
					travel.save(function(err, travel) {
						if(err) return res.send(500, err.message);

						//start saving notification, get user owner of travel
						userModel.findOne({_id: req.body.userid})
						.exec(function(err, user){
							if (err) return res.send(500, err.message);
							if (!user) {
					            res.json({success: false, message: 'User not found.'});
					        } else if (user) {
							//notification
								var notification = new notificationModel({
									concept: "travel",
									message: "user "+userOwner.username+" declines your petition for "+travel.title,
									date: new Date(),
									icon: 'ion-close',
									link: "travels/" + travel._id,
			                        user: user._id
								});
								notification.save(function(err, notification) {
									if (err) return res.send(500, err.message);
									user.notifications.push(notification._id);
									user.save(function(err, user) {
										if (err) return res.send(500, err.message);

										console.log("notification saved");
										exports.getTravelById(req, res);
									});
								});
							}
						});//end saving notification
					});//end of travel save
				}//end of else if travel
			});
		}//end of else if user
	});
};

exports.acceptJoin = function(req, res) {
	userModel.findOne({'token': req.headers['x-access-token']})
	.exec(function(err, userOwner){
		if (err) return res.send(500, err.message);
		if (!userOwner) {
            res.json({success: false, message: 'User not found.'});
        } else if (userOwner) {
			travelModel.findOne({
				_id: req.params.travelid,
				user: userOwner._id,
				joinPetitions: req.body.userid
			})
			.exec(function(err, travel){
				if (err) return res.send(500, err.message);
				if (!travel) {
		            res.json({success: false, message: 'travel not found. You can not join a travel if you have created it, or if you have already joined'});
		        } else if (travel) {
					var indexPetition=-1;
					for(var i=0; i<travel.joinPetitions.length; i++)
					{
						if(travel.joinPetitions[i].equals(req.body.userid))
						{
							indexPetition=JSON.parse(JSON.stringify(i));
						}
					}
					if(indexPetition>-1)
					{
						travel.joins.push(JSON.parse(JSON.stringify(travel.joinPetitions[indexPetition])));
						travel.joinPetitions.splice(indexPetition, 1);
						console.log(travel);
					}
					travel.save(function(err, travel) {
						if(err) return res.send(500, err.message);

						//start saving notification, get user owner of travel
						userModel.findOne({_id: req.body.userid})
						.exec(function(err, user){
							if (err) return res.send(500, err.message);
							if (!user) {
				            res.json({success: false, message: 'User not found.'});
				        } else if (user) {
								//notification
								var notification = new notificationModel({
									concept: "travel",
									message: "user "+userOwner.username+" accepts your petition for "+travel.title,
									date: new Date(),
									icon: 'ion-checkmark',
									link: "travels/" + travel._id,
			                        user: user._id
								});
								notification.save(function(err, notification) {
									if (err) return res.send(500, err.message);
									user.notifications.push(notification._id);
									user.save(function(err, user) {
										if (err) return res.send(500, err.message);

										console.log("notification saved");
										exports.getTravelById(req, res);
									});
								});
							}
						});//end saving notification
					});//end of travel save
				}//end of else if travel
			});
		}//end of else if user
	});
};

exports.leave = function(req, res) {
	userModel.findOne({'token': req.headers['x-access-token']})
	.exec(function(err, userLeaving){
		if (!userLeaving) {
            res.json({success: false, message: 'userLeaving not found.'});
        } else if (userLeaving) {
			travelModel.findOne({
				_id: req.params.travelid,
				joins: userLeaving._id
			})
			.exec(function(err, travel){
				if (err) return res.send(500, err.message);
				if (!travel) {
		            res.json({success: false, message: 'can not unjoin this travel'});
		        } else if (travel) {
					for(var i=0; i<travel.joins.length; i++)
					{
						if(travel.joins[i].equals(userLeaving._id))
						{
							travel.joins.splice(i, 1);
						}
					}
					travel.save(function(err, travel) {
						if(err) return res.send(500, err.message);
						//start saving notification, get user owner of travel
						userModel.findOne({_id: travel.user})
						.exec(function(err, user){
							if (err) return res.send(500, err.message);
							if (!user) {
					            res.json({success: false, message: 'User not found.'});
					        } else if (user) {
							//notification
								var notification = new notificationModel({
									concept: "leave",
									message: "user "+userLeaving.username+" leaves your travel "+travel.title,
									date: new Date(),
									icon: 'ion-log-out',
									link: "travels/" + travel._id,
			                        user: user._id
								});
								notification.save(function(err, notification) {
									if (err) return res.send(500, err.message);
									user.notifications.push(notification._id);
									user.save(function(err, user) {
										if (err) return res.send(500, err.message);

										console.log("notification saved");
										exports.getTravelById(req, res);
									});
								});
							}
						});//end saving notification
					});
				}
			});
		}

	});
};





//currently not used
exports.addComment = function(req, res) {
	/*var comment = new commentModel({
		travelId: req.params.travelId,
		commentUserId: req.body.commentUserId,
		commentUsername: req.body.commentUsername,
		comment: req.body.comment,
		commentAvatar: req.body.commentAvatar
	});

	comment.save(function(err, comment) {
		if(err) return res.send(500, err.message);
    res.status(200).jsonp(comment);
	});*/
	userModel.find({
		token: req.headers['x-access-token']
	}, function(err, users){
		var user=users[0];

		travelModel.findById(req.params.travelId, function(err, travel){
			console.log(travel.title);
			var comment = {
				commentUserId: user._id,
				commentUsername: user.username,
				comment: req.body.comment,
				commentAvatar: user.avatar
			};
			travel.comments.push(comment);

			travel.save(function(err, travel) {
				if(err) return res.send(500, err.message);
		    //res.status(200).jsonp(travel);
				travelModel.find({date: {$gte: new Date()}}, function(err, travels) {
				    if(err) res.send(500, err.message);
						res.status(200).jsonp(travels);
				});
			});

			//start saving notification, get user owner of travel
			userModel.find({
		      username: travel.owner
		  }, function(err, userowners) {
				var userowner=userowners[0];
				//notification
				var notification = {
					concept: "comment",
					otherusername: user.username,
					description: "user "+user.username+" comments your travel "+travel.title,
					date: new Date(),
					link: "",
					user: userowners[0]._id
				};
				userowner.notifications.push(notification);
				userowner.save(function(err, userowner) {
					console.log("notification saved");
				});
			});//end saving notification

		});
	});//end of userModel.find
};
//currently not used
exports.getCommentsByTravelId = function(req, res) {
    commentModel.find({
      travelId: req.params.travelId
  }, function(err, comments) {

      if (err) throw err;

      if (!comments) {
        res.json({ success: false, message: 'no comments for travelId' });
    } else if (comments) {
          // return the information including token as JSON
		 res.jsonp(comments);

      }

    });
};
