var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;


var travelSchema = new Schema({
    title: { type: String },
    description: { type: String },
    owner:   { type: String },
    from: { type: String },
    to: { type: String },
    date: { type: Date },
    periodic: { type: Boolean },
    generateddate: { type: Date },
    seats: { type: Number },
    package: { type: Boolean },
    icon: { type: String },
    phone: { type: Number },
    telegram: { type: String },
    collectivized: { type: Boolean },
    modality: { type: String } //if is an offering travel or asking for travel
})
module.exports = mongoose.model('travelModel', travelSchema);


//modality can be: offering, asking, package
