//File: controllers/travelController.js
var mongoose = require('mongoose');
var travelModel  = mongoose.model('travelModel');

var userModel  = mongoose.model('userModel');

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
      authorname: req.params.userid
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
	console.log('POST new travel, content: ' + req.body.content);
	console.log(req.body);

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
	ActivityModel.findById(req.params.id, function(err, activity) {
		activity.remove(function(err) {
			if(err) return res.send(500, err.message);
      		res.status(200).jsonp(req.params.id);
		    console.log('DELETE /activities/' + req.params.id);
		})
	});
};
