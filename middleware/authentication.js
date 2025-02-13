const { Unauthorized } = require("../errors");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authMiddleware = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    throw new Unauthorized(
      `No token to access this route , please sign in to access`
    );
  }
  const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);
  req.user = await User.findById(decodedData.id);
  next();
};

const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new Unauthorized(
        `Role ${req.user.role} is not authorized to access this resource`
      );
    }
    next();
  };
};

module.exports = {
  authMiddleware,
  authorizeRole,
};
