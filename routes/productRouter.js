const express = require("express");
const router = express.Router();
const {
  authMiddleware,
  authorizeRole,
} = require("../middleware/authentication");

const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getOneProduct,
  createProductReview,
  getAllReviews,
  deleteReview,
  getOneReview,
  updateOneReview,
} = require("../controllers/productController");

router.route("/products").get(getAllProducts);
router.route("/products/:id").get(getOneProduct);
router
  .route("/admin/products/new")
  .post(authMiddleware, authorizeRole("admin"), createProduct);
router
  .route("/admin/products/:id")
  .patch(authMiddleware, authorizeRole("admin"), updateProduct)
  .delete(authMiddleware, authorizeRole("admin"), deleteProduct);

// FOR ALL THE REVIEW RELATED
router.route("/review").get(getAllReviews);
router.route("/review").put(authMiddleware, createProductReview);
router.route("/review").patch(authMiddleware, updateOneReview);
router.route("/review").delete(authMiddleware, deleteReview);
router.route("/review/:id").get(getOneReview);

module.exports = router;
