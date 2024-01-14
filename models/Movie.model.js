const mongoose = require("mongoose");

const MovieSchema = mongoose.Schema({
  adult: Boolean,
  backdrop_path: { type: String, required: true },
  id: Number,
  original_language: String,
  overview: String,
  popularity: Number,
  poster_path: { type: String, required: true },
  release_date: { type: String, required: true },
  title: { type: String, required: true },
  likedBy: Array,
  video: Boolean,
  vote_average: Number,
  vote_count: Number,
});
const MovieModel = mongoose.model("movie", MovieSchema);

module.exports = { MovieModel };
