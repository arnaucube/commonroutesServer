var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var mongooseUniqueValidator = require('mongoose-unique-validator');


var userSchema = new Schema({
    username: { type: String, unique: true },
    password: { type: String },
    token: { type: String },
    description:   { type: String },
    avatar:   { type: String },
    mail:   { type: String },
    phone: { type: String },
    telegram: { type: String },
    valorations: [{
      username: { type: String },
      value: { type: Number },
      comment: { type: String }
    }],
    favs: [{
      username: { type: String },
      userId: { type: String },
      avatar: { type: String }
    }]
})

userSchema.plugin(mongooseUniqueValidator);
module.exports = mongoose.model('userModel', userSchema);
