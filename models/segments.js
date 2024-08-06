const mongoose = require("mongoose");

const segmentSchema = new mongoose.Schema({
    // _id: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     required: false,
    // },
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
        required: false,
    },
});

module.exports = mongoose.model("Segment", segmentSchema);
