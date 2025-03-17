const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    time: {
        type: String, 
        required: true
    },
    ImageURL: {
        type: String, 
        required: true
    }
}, { timestamps: true });

const setImgUrl = (doc) => {
    if (doc.ImageURL) {
        const URL = `${process.env.BASE_URL}/events/${doc.ImageURL}`;
        doc.ImageURL = URL;
    }
}

// find, update
eventSchema.post('init', (doc => {
    setImgUrl(doc);
}))

// create
eventSchema.post('save', (doc => {
    setImgUrl(doc);
}))

module.exports = mongoose.model('Event', eventSchema);;
