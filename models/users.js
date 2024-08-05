const mongoose = require("mongoose");
// const Conversations = require("./conversations");

const userSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  contactNumber: {
    type: String,
    required: false,
  },
  // conversations: {
  //   type: [{ type: mongoose.Schema.Types.ObjectId, ref: Conversations }],
  //   required: false,
  // },
  createdAt: {
    type: Date,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: false
  },
  emailAddress: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  imagePath: {
    type: String,
    required: false
  },
  isActive: {
    type: Boolean,
    required: true
  },
  lastName: {
    type: String,
    required: true,
  },
  middleName: {
    type: String,
    required: false,
  },
  otpSecret: {
    type: String,
    required: false
  },
  password: {
    type: String,
    required: true,
  },
  permanentAddress: {
    type: String,
    required: false,
  },
  permanentJWT: {
    type: String,
    required: false,
  },
  salt: {
    type: String,
    required: true
  },
  sex: {
    type: String,
    required: true,
  },
  updatedAt: {
    type: Date,
    required: false
  },
  userType: {
    type: String,
    required: false,
  },
  verificationToken: {
    type: Number,
    required: false
  }
});

module.exports = mongoose.model("User", userSchema);
