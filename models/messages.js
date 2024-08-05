const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  conversationID: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true
  },
  receiverID: {
    type: String,
    required: true
  },
  senderID: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },

  updatedAt: {
    type: Date,
    trquired: false,
  }
});

module.exports = mongoose.model('Message', messageSchema);