var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var mongooseUniqueValidator = require('mongoose-unique-validator');


var userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, selected: false },
    token: { type: String, selected: false },
    description:   { type: String },
    avatar:   { type: String },
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
        state: {type: String},//viewed, pendent
        message: {type: String},
        link: {type: String},//aquí oju, a la app i a la web calen links diferents, però ho podem fer posant sempre a la app i a la web el prefix del link (#!/app) o (#/app/), i després afegint-hi la pàgina on volem enviar el routing, per exemple (dashboard)
        icon: {type: String},
        date: {type: Date},
        dateviewed: {type: Date}
    }]
})

userSchema.plugin(mongooseUniqueValidator);
module.exports = mongoose.model('userModel', userSchema);
