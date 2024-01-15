const authenticate = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[0];
  console.log(token);
  jwt.verify(token, "secretkey", function (err, decoded) {
    if (err) {
      res.send({ msg: "login first" });
    } else {
      req.userId = decoded.userId;
      next();
    }
  });
};

module.exports = { authenticate };
