const mongoose = require('mongoose');

const Campaigns = new mongoose.Schema({
    campaignName: {
        require: true,
        type: String,
        trim: true,
        minLength: 1
    },
    isDeleted: {
        require: true,
        type: Boolean,
    },
    organizationName: {
        require: true,
        type: String
    },
    metaData: [{
        quesiton: String,
        answer: String
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Campaigns', Campaigns);