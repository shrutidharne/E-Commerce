const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide product name"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please provide description"],
    },
    price: {
      type: Number,
      required: [true, "Please provide price"],
      maxlength: [8, "Price cannot exceed 8 digits"],
    },
    ratings: {
      type: Number,
      default: 0,
    },
    images: [
      {
        public_id: {
          type: String,
          required: [true, "Please provide public ID"],
        },
        url: {
          type: String,
          required: [true, "Please provide URL"],
        },
      },
    ],
    category: {
      type: String,
      required: [true, "Please eneter product category"],
    },
    stock: {
      type: Number,
      required: [true, "Please enter product stock amount"],
      default: 1,
    },
    numberOfReviews: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        name: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
        user: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
          required: true,
        },
      },
    ],
    // user: {
    //   type: mongoose.Schema.ObjectId,
    //   ref: "User",
    //   required: true,
    // },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
