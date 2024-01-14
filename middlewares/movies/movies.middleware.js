const { MovieModel } = require("../../models/Movie.model");
const checkPagination = (req, res, next) => {
  const query = req.query;
  const { page, limit } = req.query;
  if (!page) {
    return next();
  }
  req.pagination = {
    page: parseInt(page, 10) || 1,
    limit: parseInt(limit, 10) || 10, // You can set a default limit
  };
  next();
};
const checkSort = async (req, res, next) => {
  const { sort, order, original_language, adult } = req.query;
  req.original_language = original_language ? original_language : {};
  req.adult = adult ? adult : {};
  req.sortQuery = {
    sort: sort ? sort : "",
    order: order ? (order == "asc" ? 1 : -1) : 1,
  };
  if (!req.pagination) {
    console.log("no pagination");
    if (sort) {
      const sortedData = await MovieModel.aggregate([
        { $sort: { [req.sortQuery.sort]: req.sortQuery.order } },
      ]);
      req.sortedData = sortedData;
    } else {
      const sortedData = await MovieModel.find().sort({});

      req.sortedData = sortedData;
    }
  } else {
    const { page, limit } = req.pagination;
    if (sort) {
      const sortedData = await MovieModel.aggregate([
        { $skip: (page - 1) * limit },
        { $limit: limit },
        { $sort: { [req.sortQuery.sort]: req.sortQuery.order } },
      ]);
      req.sortedData = sortedData;
    } else {
      const sortedData = await MovieModel.find()
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({});
      req.sortedData = sortedData;
    }
  }

  next();
};

const checkFilter = (req, res, next) => {
  const sortedData = req.sortedData;
  const { original_language, adult } = req.query;
  const filterObject = {};
  if (original_language) {
    filterObject.original_language = original_language;
  }
  if (adult) {
    filterObject.adult = adult;
  }
  req.filteredData = sortedData.filter((item) => {
    return (
      (!original_language || item.original_language == original_language) &&
      (!adult || item.adult + "" == adult)
    );
  });

  next();
};

module.exports = { checkFilter, checkPagination, checkSort };
