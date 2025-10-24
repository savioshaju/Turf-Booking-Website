const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        trim: true,
        minlength: [5, 'Password must be at least 5 characters long']
    },
    role: {
        type: String,
        enum: ['user', 'admin'], 
        default: 'user'
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
        minlength: [10, 'Phone number must be at least 10 digits'],
    },
}, { timestamps: true }); 

module.exports = mongoose.model('User', userSchema);
