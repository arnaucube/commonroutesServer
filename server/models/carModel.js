var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;


var carSchema = new Schema({
    title: { type: String },
    description: { type: String },
    owner:   { type: String },
    zone:   { type: String },
    available: { type: Boolean },
    generateddate: { type: Date },
    seats: { type: Number }
})
module.exports = mongoose.model('carModel', carSchema);
