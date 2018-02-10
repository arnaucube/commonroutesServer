var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var mongooseUniqueValidator = require('mongoose-unique-validator');


var userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    token: { type: String, select: false },
    description:   { type: String, default: "Hello world" },
    avatar:   { type: String, default: "img/avatars/racoon.png" },
    faircoinString:   { type: String, default: "faircoin wallet" },
    faircoin:   { type: String, default: "img/faircoinpublickey_sample.png" },
    email:   { type: String, required: true, select: false },
    phone: { type: String },
    telegram: { type: String },
    localNode: { type: String },
    validated: { type: Boolean, default: false },
    validatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'adminModel'
    },
    valorations: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'userModel'
        },
        value: { type: Number },
        comment: { type: String }
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userModel'
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
