var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;


var joinSchema = new Schema({
    travelId: { type: String },
    joinedUserId: { type: String },
    joinedUsername: { type: String },
    acceptedUserId: { type: String },
    comment: { type: String }

});
module.exports = mongoose.model('joinModel', joinSchema);
