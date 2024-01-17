const mongoose = require("mongoose");

const MovieSchema = mongoose.Schema(
  {
    adult: Boolean,
    backdrop_path: { type: String, required: true },
    id: Number,
    genre: Array,
    tags: Array,
    original_language: String,
    overview: String,
    popularity: Number,
    poster_path: { type: String, required: true },
    release_date: { type: Date, required: true },
    title: { type: String, required: true },
    likedBy: Array,
    video: Boolean,
    trailer: String,
    vote_average: Number,
    vote_count: Number,
  },
  { timestamps: true }
);
const MovieModel = mongoose.model("movies", MovieSchema);

module.exports = { MovieModel };
