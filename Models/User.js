const mongoose = require('mongoose');

const User = new mongoose.Schema({
    userName: {
        required: true,
        type: String
    },
    twitterId: {
        required: true,
        type: String
    },
    displayName: {
        required: true,
        type: String
    },
    scores: {
        required: true,
        type: Number
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("User", User);