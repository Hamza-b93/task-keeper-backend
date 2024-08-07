  const mongoose = require("mongoose");
  const Segments = require("./segments");
  const Users = require("./users");

  const taskSchema = new mongoose.Schema({
    // _id: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   required: false,
    // },
    createdAt: {
      type: Date,
      required: false,
    },
    currentStatus: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    editors: {
      type: [{ type: mongoose.Schema.Types.String, ref: Users }],
      required: false,
    },
    expectedReleaseDate: {
      type: Date,
      required: false,
    },
    guests: {
      type: Array,
      required: false,
    },
    hosts: {
      type: [{ type: mongoose.Schema.Types.String, ref: Users }],
      required: false
    },
    isEdited: {
      type: Boolean,
      required: false,
    },
    isShot: {
      type: Boolean,
      required: false,
    },
    isUploaded: {
      type: Boolean,
      required: false,
    },
    remarks: {
      type: String,
      required: false
    },
    researchLinks: {
      type: Array,
      required: false,
    },
    segment: {
      type: [{ type: mongoose.Schema.Types.String, ref: Segments }],
      required: false,
    },
    title: {
      type: String,
      required: false,
    },
    updatedAt: {
      type: Date,
      required: false,
    },
  });

  module.exports = mongoose.model("Task", taskSchema);
