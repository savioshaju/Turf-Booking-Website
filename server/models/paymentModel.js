const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
    },
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: [true, 'Booking ID is required']
    },
    turfId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Turf',
        required: [true, 'Turf ID is required']
    },
    amount: {
        type: Number,
        required: [true, 'Payment amount is required'],
    },
    paymentMethod: {
        type: String,
        enum: ['upi', 'card', 'wallet', 'cash'],
        required: [true, 'Payment method is required']
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'successful', 'failed', 'refunded'],
        default: 'pending'
    },
    paymentDate: {
        type: Date,
        default: Date.now
    },
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
