var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var mongooseUniqueValidator = require('mongoose-unique-validator');


var notificationSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userModel'
    },
    state: {type: String, default: "pendent"},//viewed, pendent
    concept: {type: String},
    message: {type: String},
    link: {type: String},//aquí oju, a la app i a la web calen links diferents
    date: {type: Date},
    dateviewed: {type: Date},
    icon: {type: String}
})

notificationSchema.plugin(mongooseUniqueValidator);
module.exports = mongoose.model('notificationModel', notificationSchema);
