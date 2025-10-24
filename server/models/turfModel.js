const mongoose = require('mongoose');

const turfSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Turf name is required'],
        trim: true
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
        trim: true
    },
    type: {
        type: String,
        required: [true, 'Turf type is required'],
        trim: true,
    },
    cost: {
        type: Number,
        required: [true, 'Turf cost is required'],
    },
    openTime: {
        type: String,
        required: [true, 'Opening time is required'],
        trim: true
    },
    closeTime: {
        type: String,
        required: [true, 'Closing time is required'],
        trim: true
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
        minlength: [10, 'Phone number must be at least 10 digits'],
    },
    turfImg: {
        type: String,
        default: null
    }
}, { timestamps: true })

module.exports = mongoose.model('Turf', turfSchema);
