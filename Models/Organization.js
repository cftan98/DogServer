const mongoose = require('mongoose');

const Organization = new mongoose.Schema({
    orgName: {
        reqired: true,
        type: String
    },
    isDeleted: {
        reqired: true,
        type: Boolean
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Organization", Organization);