//File: controllers/travelController.js
var mongoose = require('mongoose');
var userModel  = mongoose.model('userModel');
var travelModel  = mongoose.model('travelModel');
var commentModel  = mongoose.model('commentModel');

//GET
exports.getAllTravels = function(req, res) {
	//get travels with futures dates ($gte - greater than and equal than)
	travelModel.find({date: {$gte: new Date()}})
        .limit(Number(req.query.pageSize))
        .skip(Number(req.query.pageSize) * Number(req.query.page))
        .exec(function (err, travels) {
            if (err) return res.send(500, err.message);
            res.status(200).jsonp(travels);
        });
};

exports.getTravelById = function (req, res) {
    travelModel.findOne({_id: req.params.travelid})
        .lean()
        .populate('joins', 'username avatar')
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
				type: req.body.modality
			});

			travel.save(function(err, travel) {
				if(err) return res.send(500, err.message);

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
        if (err) return console.log(err);
        console.log(user);
        userModel.findOne({_id: user._id})
        .lean()
        .populate('travels', 'title from to date')
        .exec(function (err, user) {
            if (err) return res.send(500, err.message);
            if (!user) {
                res.json({success: false, message: 'User not found.'});
            } else if (user) {

                res.status(200).jsonp(user);
            }
        });
    });
};

//DELETE
exports.deleteTravel = function(req, res) {
	userModel.find({
		token: req.headers['x-access-token']
	}, function(err, users){
		var user=users[0];

		travelModel.findById(req.params.id, function(err, travel) {
			if(travel.owner==user.username)
			{
				travel.remove(function(err) {
					if(err) return res.send(500, err.message);

					travelModel.find({date: {$gte: new Date()}}, function(err, travels) {
							if(err) res.send(500, err.message);
							res.status(200).jsonp(travels);
					});
				});
			}
		});
	});
};

/* join */
exports.addJoin = function(req, res) {
	userModel.findOne({'token': req.headers['x-access-token']})
	.exec(function(err, user){
		travelModel.findById(req.params.travelId, function(err, travel){
			console.log(travel.title);
			var join = {
				joinedUserId: user._id,
				joinedUsername: user.username,
				acceptedUserId: req.body.acceptedUserId,
				joinedAvatar: user.avatar
			};
			travel.joins.push(join);



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
					type: "join",
					otherusername: user.username,
					description: "user "+user.username+" joins your travel "+travel.title,
					date: new Date(),
					link: ""
				};
				userowner.notifications.push(notification);
				userowner.save(function(err, userowner) {
					console.log("notification saved");
				});
			});//end saving notification

		});

	});
};

exports.doUnjoin = function(req, res) {
	userModel.find({
		token: req.headers['x-access-token']
	}, function(err, users){
		var user=users[0];

		travelModel.findById(req.params.travelId, function(err, travel){
			for(var i=0; i<travel.joins.length; i++)
			{
				if(travel.joins[i].joinedUsername==user.username)
				{
					travel.joins.splice(i, 1);
				}
			}

			travel.save(function(err, travel) {
				if(err) return res.send(500, err.message);
				//res.status(200).jsonp(travel);
				travelModel.find({date: {$gte: new Date()}}, function(err, travels) {
				    if(err) res.send(500, err.message);
						res.status(200).jsonp(travels);
				});
			});

		});
	});
};

exports.getJoinsByTravelId = function(req, res) {
    joinModel.find({
      travelId: req.params.travelId
  }, function(err, joins) {

      if (err) throw err;

      if (!joins) {
        res.json({ success: false, message: 'no joins for travelId' });
    } else if (joins) {
          // return the information including token as JSON
		 res.jsonp(joins);

      }

    });
};

exports.findAllTravelsFromUsername = function(req, res) {
    travelModel.find({
      owner: req.params.username,
			date: {$gte: new Date()}
  }, function(err, travels) {

      if (err) throw err;

      if (!travels) {
        res.json({ success: false, message: 'no travels for user' });
    } else if (travels) {
        console.log(travels);
          // return the information including token as JSON
          res.jsonp(travels);


      }

    });
};






/* comment */
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
					type: "comment",
					otherusername: user.username,
					description: "user "+user.username+" comments your travel "+travel.title,
					date: new Date(),
					link: ""
				};
				userowner.notifications.push(notification);
				userowner.save(function(err, userowner) {
					console.log("notification saved");
				});
			});//end saving notification

		});
	});//end of userModel.find
};

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
