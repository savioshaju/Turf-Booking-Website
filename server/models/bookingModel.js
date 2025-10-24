const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
    },
    teamName: {
        type: String,
        required: [true, 'Team name is required'],
        trim: true
    },
    turfId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Turf',
        required: [true, 'Turf ID is required']
    },
    date: {
        type: Date,
        required: [true, 'Booking date is required']
    },
    time: {
        type: String,
        required: [true, 'Booking time is required'],
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
