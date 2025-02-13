const { StatusCodes } = require("http-status-codes");

const errorHandlerMiddleware = (err, req, res, next) => {
  (err.message = err.message || `Internal Server Error ...`),
    (err.statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR);

  if (err.name && err.name === "CastError") {
    (err.message = `Invalid syntax for ${err.path}`),
      (err.statusCode = StatusCodes.BAD_REQUEST);
  }

  if (err.name === "MongoError" && err.code === 11000) {
    err.message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    err.statusCode = StatusCodes.BAD_REQUEST;
  }

  // if()
  //JSON WEB TOKEN INVALID ERROR HANDLING
  //TOKEN EXPIRED ERROR

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

module.exports = errorHandlerMiddleware;
