const mongoose = require("mongoose");

const RoundSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    required: true,
    default: 0,
  },
  encounter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Encounter",
  },
  //Name of the player
  player:{
      type: String,
  },
  //The players character
  playerCharacter: {
    type: String,
  },
  playerToRoll:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserNTW",
  },
  dm: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserNTW",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  rolled: {
    type: Boolean,
    default: false,
  },
  target: {
    type: Number,
    required: false,
  },
  playerRoll: {
    type: Number,
    required: false,
  },
  type: {
    type: String,
    required: false,
  },
  rollFor: {
    type: String,
    required: false,
  },
  nat20: {
    type: Boolean, 
    default: false,
  }, 
  rollCategory: {
    type: String,
    required: false,
  }
});

module.exports = mongoose.model("Round", RoundSchema);
