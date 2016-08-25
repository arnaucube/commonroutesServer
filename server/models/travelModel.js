var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;


var travelSchema = new Schema({
    title: { type: String },
    description: { type: String },
    owner:   { type: String },
    from: { type: String },
    to: { type: String },
    date: { type: Date },
    generateddate: { type: Date },
    seats: { type: Number },
    icon: { type: String }
})
module.exports = mongoose.model('travelModel', travelSchema);
