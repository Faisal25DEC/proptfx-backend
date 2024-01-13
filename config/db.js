const mongoose = require("mongoose");

const url =
  "mongodb+srv://faizaljohnson25dec:faisal@cluster0.utjpulc.mongodb.net/movie_api";

const connection = mongoose.connect(url);

module.exports = { connection };
