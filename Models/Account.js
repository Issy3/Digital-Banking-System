const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    accountNumber: {
        type: String,
        unique: true,
        required: true
    },
    bankCode: {
        type: String,
        required: true
    },
    bankName: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Account', accountSchema);