require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/productModel"); // Adjust based on your schema
const User = require("./models/userModel"); // Adjust based on your schema
const { products, users } = require("./data/sampleData");
const connectDB = require("./db/connect");

const seedDatabase = async () => {
  try {
    await connectDB(process.env.MONGO_URI);

    // Clear existing data
    await Product.deleteMany();
    await User.deleteMany();

    // Insert sample data
    await Product.insertMany(products);
    await User.insertMany(users);

    console.log("Sample data inserted successfully!");
    process.exit();
  } catch (error) {
    console.error("Error inserting sample data:", error);
    process.exit(1);
  }
};

seedDatabase();
