const express = require("express");
const {
  checkPagination,
  checkSort,
  checkFilter,
} = require("../middlewares/movies/movies.middleware");
const {
  checkQuery,
  checkSearchPagination,
  checkSearchSort,
} = require("../middlewares/movies/moviesSearch.middleware");
const { MovieModel } = require("../models/Movie.model");
const {
  authenticate,
} = require("../middlewares/auth/authentication.middleware");

const movieRouter = express.Router();

movieRouter.get(
  "/",
  checkPagination,
  checkSort,
  checkFilter,

  async (req, res) => {
    const query = req.query;

    res.send(req.filteredData);
  }
);

movieRouter.get(
  "/search",
  checkQuery,
  checkSearchPagination,
  checkSearchSort,
  (req, res) => {
    res.send(req.searchResult);
  }
);

movieRouter.post("/add", async (req, res) => {
  const body = req.body;
  console.log(body);
  if (
    !body.title ||
    !body.original_language ||
    !body.poster_path ||
    !body.backdrop_path
  ) {
    res.status(404).json({ msg: "Missing fields or paramenters" });
  } else {
    const {
      adult,
      backdrop_path,
      genre,
      id,
      tags,
      original_language,
      overview,
      popularity,
      poster_path,
      release_date,
      title,
      likedBy,
      video,
      vote_average,
      vote_count,
      trailer,
    } = req.body;
    try {
      await MovieModel.create({
        adult,
        backdrop_path,
        genre,
        id,
        tags,
        original_language,
        overview,
        popularity,
        poster_path,
        release_date,
        title,
        likedBy,
        video,
        vote_average,
        vote_count,
        trailer,
      });

      res.status(200).send({ msg: "Movie Successfully Added To Database" });
    } catch (error) {
      console.log(error);
    }
  }
});
movieRouter.patch("/watchlist", authenticate, async (req, res) => {
  try {
    const { movieId } = req.body;
    await MovieModel.findByIdAndUpdate(movieId, {
      $addToSet: { likedBy: req.userId },
    });
    const allMovies = await MovieModel.find({});
    res.status(200).send({ msg: "updated movies", movies: allMovies });
  } catch (error) {
    res.status(400).send({ mdg: "couldn't update movie" });
    console.log(error);
  }
});
movieRouter.patch("/watchlist/remove", authenticate, async (req, res) => {
  try {
    const { movieId } = req.body;
    await MovieModel.findByIdAndUpdate(movieId, {
      $pull: { likedBy: req.userId },
    });
    const allMovies = await MovieModel.find({});
    res.status(200).send({ msg: "updated movies", movies: allMovies });
  } catch (error) {}
});
module.exports = { movieRouter };
