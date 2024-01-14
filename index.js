const express = require("express");

const app = express();

const { connection } = require("./config/db");
const { movieRouter } = require("./routes/movies.routes");

require("dotenv").config();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("api started");
});
app.use("/movies", movieRouter);

app.listen(8080, async () => {
  try {
    await connection;
    console.log("database connected");
  } catch (err) {
    console.log(err);
  }
});
