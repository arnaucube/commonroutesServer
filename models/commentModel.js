var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;


var commentSchema = new Schema({
    travelId: { type: String },
    commentUserId: { type: String },
    commentUsername: { type: String },
    comment: { type: String }

});
module.exports = mongoose.model('commentModel', commentSchema);
