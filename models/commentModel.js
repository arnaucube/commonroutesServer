var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;


var commentSchema = new Schema({
    comment: { type: String },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userModel'
    }
});
module.exports = mongoose.model('commentModel', commentSchema);
