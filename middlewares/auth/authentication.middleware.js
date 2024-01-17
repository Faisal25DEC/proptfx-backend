const jwt = require("jsonwebtoken");
const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log(token);
  jwt.verify(token, "secretkey", function (err, decoded) {
    if (err) {
      res.status(404).send({ msg: "login first" });
    } else {
      req.userId = decoded.userId;
      next();
    }
  });
};

module.exports = { authenticate };
