const mongoose = require("mongoose");
require("dotenv").config();

const mongoURI = process.env.MONGO_URI;

const url = mongoURI;

const connection = mongoose.connect(url);

module.exports = { connection };
