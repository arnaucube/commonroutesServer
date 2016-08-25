var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;


var userSchema = new Schema({
    username: { type: String },
    password: { type: String },
    description:   { type: String },
    avatar:   { type: String },
    mail:   { type: String },
    phone: { type: String }
})
module.exports = mongoose.model('userModel', userSchema);
