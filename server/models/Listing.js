const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
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
    images: [{
        type: String
    }],
    hostId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bookingDates: [{
        start: {
            type: Date,
            required: true
        },
        end: {
            type: Date,
            required: true
        }
    }]
}, {

    timestamps: true
});

module.exports = mongoose.model('Listing', listingSchema);