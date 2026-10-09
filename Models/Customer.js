//CREATE CUSTOMER MODEL
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
    type: String,
    required: true
    },
   phone: {
        type: String,
        required: true,
        unique: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    kycType: {
        type: String,
        required: true,
            enum: ['bvn', 'nin']
    },
    kycId: {
        type: String,
        required: true,
        unique: true
    },
    isVerified: {
        type: Boolean,
        default: false
}
});

module.exports = mongoose.model('Customer', customerSchema);