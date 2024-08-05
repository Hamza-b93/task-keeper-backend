const mongoose = require("mongoose");

const segmentSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    keywords: {
        type: Array,
        required: false,
    },
    name: {
        type: String,
        required: true,
    },
    updatedAt: {
        type: Date,
        trquired: false,
    },
});

module.exports = mongoose.model("Segment", segmentSchema);
