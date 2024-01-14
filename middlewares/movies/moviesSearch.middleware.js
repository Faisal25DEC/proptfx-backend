const { MovieModel } = require("../../models/Movie.model");
const checkQuery = (req, res, next) => {
  const { search } = req.query;

  req.search = search ? search : "";

  next();
};

const checkSearchPagination = (req, res, next) => {
  const { page, limit } = req.query;
  if (page) {
    req.page = page;
    req.limit = limit ? limit : 10;
  } else {
    req.page = 1;
    req.limit = MovieModel.find().count();
  }
  next();
};

const checkSearchSort = async (req, res, next) => {
  const { sort, order } = req.query;
  req.searchSort = {
    sort: sort,
    order: order == "desc" ? -1 : 1,
  };
  if (sort) {
    const searchResult = await MovieModel.find({
      title: { $regex: req.search, $options: "i" },
    })
      .skip((req.page - 1) * req.limit)
      .limit(req.limit)
      .sort({ [sort]: req.searchSort.order });
    req.searchResult = searchResult;
  } else {
    const searchResult = await MovieModel.find({
      title: { $regex: req.search, $options: "i" },
    })
      .skip((req.page - 1) * req.limit)
      .limit(req.limit);
    req.searchResult = searchResult;
  }
  next();
};

module.exports = { checkQuery, checkSearchPagination, checkSearchSort };
