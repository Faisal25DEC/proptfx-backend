const express = require("express");
const app = express();
const cors = require("cors");
const { connection } = require("./config/db");
const { movieRouter } = require("./routes/movies.routes");
const { userRouter } = require("./routes/users.routes");

require("dotenv").config();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://propftx-frontend.vercel.app",
      "https://proptfx-frontend.vercel.app",
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);
app.options("*", cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("api started");
});
app.use("/movies", movieRouter);
app.use("/users", userRouter);

app.listen(8080, async () => {
  try {
    await connection;
    console.log("database connected");
  } catch (err) {
    console.log(err);
  }
});
