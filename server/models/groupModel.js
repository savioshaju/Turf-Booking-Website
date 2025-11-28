const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true
  },

  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  message: {
    type: String,
    required: true
  },

  requiredPlayers: {
    type: Number,
    required: true
  },

  players: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],

  status: {
    type: String,
    enum: ["open", "closed"],
    default: "open"
  },

}, { timestamps: true });

module.exports = mongoose.model("Group", groupSchema);
