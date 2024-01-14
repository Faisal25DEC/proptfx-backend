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

module.exports = { movieRouter };
