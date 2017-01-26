var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var mongooseUniqueValidator = require('mongoose-unique-validator');


var userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, selected: false },
    token: { type: String, selected: false },
    description:   { type: String, default: "Hello world" },
    avatar:   { type: String, default: "img/avatars/racoon.png" },
    email:   { type: String, required: true },
    phone: { type: String },
    telegram: { type: String },
    valorations: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'userModel'
        },
        value: { type: Number },
        comment: { type: String }
    }],
    favs: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'userModel'
        },
        date: {type: Date}
    }],
    travels: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'travelModel'
    }],
    notifications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'notificationModel'
    }]
})

userSchema.plugin(mongooseUniqueValidator);
module.exports = mongoose.model('userModel', userSchema);
