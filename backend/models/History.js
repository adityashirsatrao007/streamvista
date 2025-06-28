const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  userId: String,
  movieTitle: String,
  genre: String,
  watchedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("History", historySchema);
