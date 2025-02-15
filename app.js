// //env
// require("dotenv").config();
// console.log("MongoDB URI:", process.env.MONGO_URI);


// //config files and packages
// require("express-async-errors");


// //basic imports
// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// const cookieParser = require("cookie-parser");

// //Handling uncaught exceptions
// process.on("uncaughtException", (err) => {
//   console.log(err.message);
//   console.log(`Server is shutting down due to uncaught exception`);
//   process.exit(1);
// });

// //basic middlware imports
// app.use(express.json());
// app.use(cookieParser());

// //custom middleware imports
// const errorHandlerMiddleware = require("./middleware/error-handler");
// const notFound = require("./middleware/not-found");

// //monogoose deprecations
// mongoose.set("strictQuery", true);

// //db import
// const connectDB = require("./db/connect");

// //const route imports
// const productRouter = require("./routes/productRouter");
// const userRouter = require("./routes/userRouter");
// const orderRouter = require("./routes/orderRouter");

// //cors
// const cors = require("cors");

// // Enable CORS
// app.use(cors({
//   origin: "http://localhost:3001", // Allow requests from your frontend
//   methods: "GET,POST,PUT,DELETE",
//   allowedHeaders: "Content-Type,Authorization"
// }));


// //routes
// app.get("/api/v1/docs", (req, res) => {
//   res.send();
// });
// app.use("/api/v1", productRouter);
// app.use("/api/v1", userRouter);
// app.use("/api/v1", orderRouter);
// app.use(errorHandlerMiddleware);
// app.use(notFound);

// //const server and connect and start
// // const port = process.env.PORT || 3000;
// // const start = async () => {
// //   try {
// //     await connectDB(process.env.MONGO_URI);
// //     const server = app.listen(port, () => {
// //       console.log(`Server running on port ${port}`);
// //     });
// //   } catch (err) {
// //     console.log(err);
// //   }
// // };

// start();
// const serverless = require("serverless-http");
// module.exports = serverless(app);

// //Handling unhandled promise rejection
// process.on("unhandledRejection", (err) => {
//   console.log(err.message);
//   console.log(`Server is shutting down due to unhandled promise rejection`);
//   server.close(() => {
//     process.exit(1);
//   });
// });




require("dotenv").config();
console.log("MongoDB URI:", process.env.MONGO_URI);

require("express-async-errors");

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const serverless = require("serverless-http");

// Connect to MongoDB
const connectDB = require("./db/connect");
connectDB(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:3001",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization"
}));

// Import routes
const productRouter = require("./routes/productRouter");
const userRouter = require("./routes/userRouter");
const orderRouter = require("./routes/orderRouter");

app.get("/api/v1/docs", (req, res) => res.send());

app.use("/api/v1", productRouter);
app.use("/api/v1", userRouter);
app.use("/api/v1", orderRouter);

const errorHandlerMiddleware = require("./middleware/error-handler");
const notFound = require("./middleware/not-found");

app.use(errorHandlerMiddleware);
app.use(notFound);

// Export as serverless function for Vercel
module.exports = serverless(app);

