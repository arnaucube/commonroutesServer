//File: controllers/travelController.js
var mongoose = require('mongoose');
var travelModel  = mongoose.model('travelModel');

var userModel  = mongoose.model('userModel');

var joinModel  = mongoose.model('joinModel');
var commentModel  = mongoose.model('commentModel');

//GET
exports.findAllTravels = function(req, res) {

	travelModel.find(function(err, travels) {
	    if(err) res.send(500, err.message);

		res.status(200).jsonp(travels);
	});


};

//GET
exports.findById = function(req, res) {
	travelModel.findById(req.params.id, function(err, travel) {
    if(err) return res.send(500, err.message);

    console.log('GET /travel/' + req.params.id);
		res.status(200).jsonp(travel);
	});
};

exports.findAllTravelsFromUsername = function(req, res) {
    travelModel.find({
      owner: req.params.username
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

exports.addTravel = function(req, res) {
	console.log('POST new travel, title: ' + req.body.title);
	var travel = new travelModel({
		title: req.body.title,
	    description:   req.body.description,
	    owner:   req.body.owner,
	    from:   req.body.from,
	    to:   req.body.to,
	    date:   req.body.date,
		periodic: req.body.periodic,
	    generateddate:   req.body.generateddate,
		seats: req.body.seats,
		package: req.body.package,
		icon: req.body.icon,
		phone: req.body.phone,
		telegram: req.body.telegram,
		collectivized: req.body.collectivized,
		modality: req.body.modality
	});

	travel.save(function(err, travel) {
		if(err) return res.send(500, err.message);
    res.status(200).jsonp(travel);
	});
};

//PUT
exports.updateTravel = function(req, res) {
	ActivityModel.findById(req.params.id, function(err, tvshow) {
		tvshow.title   = req.body.petId;
		tvshow.year    = req.body.year;
		tvshow.country = req.body.country;
		tvshow.poster  = req.body.poster;
		tvshow.seasons = req.body.seasons;
		tvshow.genre   = req.body.genre;
		tvshow.summary = req.body.summary;

		tvshow.save(function(err) {
			if(err) return res.send(500, err.message);
      res.status(200).jsonp(tvshow);
		});
	});
};

//DELETE
exports.deleteTravel = function(req, res) {
	travelModel.findById(req.params.id, function(err, travel) {
		travel.remove(function(err) {
			if(err) return res.send(500, err.message);
      		res.status(200).jsonp(req.params.id);
		    console.log('DELETE /traves/' + req.params.id);
		})
	});
};


/* join */
exports.addJoin = function(req, res) {
	var join = new joinModel({
		travelId: req.params.travelId,
		joinedUserId: req.body.joinedUserId,
		joinedUsername: req.body.joinedUsername,
		acceptedUserId: req.body.acceptedUserId,
		joinedAvatar: req.body.joinedAvatar
	});

	join.save(function(err, join) {
		if(err) return res.send(500, err.message);
    res.status(200).jsonp(join);
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


/* comment */
exports.addComment = function(req, res) {
	var comment = new commentModel({
		travelId: req.params.travelId,
		commentUserId: req.body.commentUserId,
		commentUsername: req.body.commentUsername,
		comment: req.body.comment,
		commentAvatar: req.body.commentAvatar
	});

	comment.save(function(err, comment) {
		if(err) return res.send(500, err.message);
    res.status(200).jsonp(comment);
	});
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
