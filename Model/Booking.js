const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    plan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plan',
        required: false 
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: false 
    },
    bookingDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending'
    }
}, {timestamps: true });

// Ensure that either a Plan or an Event is booked, but not both or neither
bookingSchema.pre('validate', function (next) {
    if ((!this.plan && !this.event) || (this.plan && this.event)) {
        return next(new Error("Booking must be linked to either a Plan or an Event, but not both!"));
    }
    next();
});

module.exports = mongoose.model('Booking', bookingSchema);
