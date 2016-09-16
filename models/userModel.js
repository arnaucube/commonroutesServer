var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;


var userSchema = new Schema({
    username: { type: String },
    password: { type: String },
    description:   { type: String },
    avatar:   { type: String },
    mail:   { type: String },
    phone: { type: String },
    telegram: { type: String },
    valorations: [{
      username: { type: String },
      value: { type: Number },
      comment: { type: String }
    }]
})
module.exports = mongoose.model('userModel', userSchema);
