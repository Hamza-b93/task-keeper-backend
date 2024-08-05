const mongoose = require("mongoose");
const Segments = require("./segments");
const Users = require("./users");

const taskSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  currentStatus: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  editors: {
    type: [{ type: mongoose.Schema.Types.String, ref: Users }],
    required: true,
  },
  expectedReleaseDate: {
    type: Date,
    required: true,
  },
  guests: {
    type: Array,
    required: true,
  },
  hosts: {
    type: [{ type: mongoose.Schema.Types.String, ref: Users }],
    required: true
  },
  isEdited: {
    type: Boolean,
    required: true,
  },
  isShot: {
    type: Boolean,
    required: true,
  },
  isUploaded: {
    type: Boolean,
    required: true,
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
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  updatedAt: {
    type: Date,
    required: false,
  },
});

module.exports = mongoose.model("Task", taskSchema);
