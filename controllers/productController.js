const { BadRequest } = require("../errors");
const Product = require("../models/productModel");
const { StatusCodes } = require("http-status-codes");
const APIFeatures = require("../utils/api-feature");

//ADMIN route which creates a product to be displayed on the site
const createProduct = async (req, res) => {
  req.body.user = req.user._id;
  const product = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({
    success: true,
    product,
  });
};

//ADMIN route which updates info of a product
const updateProduct = async (req, res) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    throw new BadRequest(`No product with id ${req.params.id}`);
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  });
  res.status(StatusCodes.CREATED).json({
    success: true,
    product,
  });
};

//ADMIN route to delete a product
const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new BadRequest(`No product with id ${req.params.id}`);
  }
  await Product.findByIdAndDelete(req.params.id);
  res.status(StatusCodes.OK).json({
    success: true,
  });
};

//Route which is used to fetch all products
const getAllProducts = async (req, res) => {
  const noOfItemsPerPage = 5;
  const noOfProducts = await Product.countDocuments();
  const apifeature = new APIFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(noOfItemsPerPage);
  const products = await apifeature.query;
  res.status(StatusCodes.OK).json({ success: true, products, noOfProducts });
};

//Gets one particular product if it exists
const getOneProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new BadRequest(`No product with id ${req.params.id}`);
  }
  res.status(StatusCodes.OK).json({ success: true, product });
};

//Add review to a product
const createProductReview = async (req, res) => {
  const { rating, comment, productId } = req.body;
  const product = await Product.findById(productId);
  if (!product) {
    throw new BadRequest(`No product with id ${productId}`);
  }
  const review = {
    rating: Number(rating),
    comment,
    name: req.user.name,
    user: req.user._id,
  };

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );
  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString()) {
        (rev.comment = comment), (rev.rating = rating);
      }
    });
  } else {
    product.reviews.push(review);
    product.numberOfReviews = product.reviews.length;
  }

  await product.save({ validateBeforeSave: true });

  let avg = 0;
  product.reviews.forEach((rev) => (avg += rev.rating));
  product.ratings = avg / product.reviews.length;
  await product.save({ validateBeforeSave: false });
  res.status(StatusCodes.OK).json({
    success: true,
    message: `Review added successfully`,
  });
};

//get all the reviews
//get one review
//delete one review
const getAllReviews = async (req, res) => {
  const product = await Product.findById(req.query.productId);
  if (!product) {
    throw new BadRequest(`No product with id ${req.query.productId}`);
  }
  res.status(StatusCodes.OK).json({
    success: true,
    noOfReviews: product.reviews.length,
    reviews: product.reviews,
  });
};

const getOneReview = async (req, res) => {
  const product = await Product.findById(req.query.productId);
  if (!product) {
    throw new BadRequest(`No product with id ${req.query.productId}`);
  }
  const review = product.reviews.find(
    (rev) => rev._id.toString() === req.params.id.toString()
  );
  if (!review) {
    throw new BadRequest(`No review with id ${req.params.id}`);
  }
  res.status(StatusCodes.OK).json({
    success: true,
    review,
  });
};

const deleteReview = async (req, res) => {
  const product = await Product.findById(req.query.productId);
  if (!product) {
    throw new BadRequest(`No product with id ${req.query.productId}`);
  }
  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );
  let avg = 0;
  reviews.forEach((rev) => (avg += rev.rating));
  const ratings = reviews.length > 0 ? avg / reviews.length : 0;
  const numberOfReviews = reviews.length;
  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      ratings,
      numberOfReviews,
      reviews,
    },
    {
      runValidators: true,
      new: true,
    }
  );
  res.status(StatusCodes.OK).json({
    success: true,
    message: "Review deleted Successfully",
  });
};

const updateOneReview = async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.query.productId);
  if (!product) {
    throw new BadRequest(`No product with id ${req.query.productId}`);
  }

  const review = product.reviews.find(
    (rev) => rev._id.toString() === req.query.id.toString()
  );
  review.comment = comment;
  review.rating = Number(rating);
  await product.save({ validateBeforeSave: false });

  let avg = 0;
  product.reviews.forEach((rev) => (avg += rev.rating));
  product.ratings = avg / product.reviews.length;
  await product.save({ validateBeforeSave: false });

  res.status(StatusCodes.OK).json({
    success: true,
    product,
  });
};

module.exports = {
  getAllProducts,
  getOneProduct,
  deleteProduct,
  updateProduct,
  createProduct,
  createProductReview,
  getAllReviews,
  getOneReview,
  deleteReview,
  updateOneReview,
};
