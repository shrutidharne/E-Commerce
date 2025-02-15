const mongoose = require("mongoose");

const connectDB = (url) => {
  console.log("connect db");
  return mongoose.connect(url);
};

 module.exports = connectDB;
// const mongoose = require("mongoose");

// const connectDB = async () => {
//   try {
//     const uri = process.env.MONGO_URI;
//     if (!uri) {
//       throw new Error("MONGO_URI is not defined!");
//     }
//     await mongoose.connect(uri, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log("✅ MongoDB Connected...");
//   } catch (error) {
//     console.error("🚨 MongoDB Connection Error:", error.message);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;
