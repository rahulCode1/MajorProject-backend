const jwt = require("jsonwebtoken");
const HttpError = require("../model/http-error");

const authCheck = async (req, res, next) => {
  const headers = req.headers.authorization;

  if (!headers) {
    return next(new HttpError("Headers not found", 401));
  }

  const token = headers.split(" ")[1];

  if (!token) {
    return next(new HttpError("Token not found.", 401));
  }
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decode.userId;
    next();
  } catch (error) {
    next(new HttpError("Invalid or Expired token.", 401));
  }
};


module.exports = authCheck