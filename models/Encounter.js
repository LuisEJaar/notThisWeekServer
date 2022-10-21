const mongoose = require("mongoose");

const EncounterSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    require: false,
  },
  cloudinaryId: {
    type: String,
    require: false,
  },
  likes: {
    type: Number,
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  dm: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  characters: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Character",
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  initiative: {
    type: Number,
  },
  active: {
    type: Boolean,
    default: true,
  },
  dmTurn: {
    type: Boolean,
    default: false,
  }
});

module.exports = mongoose.model("Encounter", EncounterSchema);
