var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var mongooseUniqueValidator = require('mongoose-unique-validator');


var adminSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    email:   { type: String, required: true },
    phone: { type: String },
    telegram: { type: String },
    token: { type: String, select: false }
})

adminSchema.plugin(mongooseUniqueValidator);
module.exports = mongoose.model('adminModel', adminSchema);
