const mongoose = require('mongoose');

const Form = new mongoose.Schema({
    twitterId: {
        require: true,
        type: String,
        trim: true
    },
    twitterDisplayName: {
        require: true,
        type: String
    },
    metaData: [{
        question: String,
        answer: String
    }],
    score: {
        type: Number,
    },
    isDeleted: {
        type: Boolean,
        require: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Form", Form);