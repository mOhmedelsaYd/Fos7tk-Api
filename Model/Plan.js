const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        enum: ['Basic Plan', 'Standard Plan', 'Premium Plan']
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    placesToVisit: [String],
    hotel: {
        name: String,
        stars: Number
    },
    journeyPeriod: String,
    dateRange: {
        startDate: Date,
        endDate: Date
    }
});


module.exports = mongoose.model('Plan', planSchema);;
