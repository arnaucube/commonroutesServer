var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var mongooseUniqueValidator = require('mongoose-unique-validator');


var notificationSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userModel'
    },
    state: {type: String, default: "pendent"},//viewed, pendent
    message: {type: String},
    link: {type: String},//aquí oju, a la app i a la web calen links diferents, però ho podem fer posant sempre a la app i a la web el prefix del link (#!/app) o (#/app/), i després afegint-hi la pàgina on volem enviar el routing, per exemple (dashboard)
    icon: {type: String},
    date: {type: Date},
    dateviewed: {type: Date}
})

notificationSchema.plugin(mongooseUniqueValidator);
module.exports = mongoose.model('notificationModel', notificationSchema);
