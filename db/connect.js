const mongoose = require("mongoose");

const connectDB = (url) => {
  console.log("connect db");
  return mongoose.connect(url);
};

module.exports = connectDB;
