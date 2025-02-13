const express = require("express");
const router = express.Router();
const {
  authMiddleware,
  authorizeRole,
} = require("../middleware/authentication");
const {
  createOrder,
  getMyOneOrder,
  getAllMyOrders,
  updateOrder,
  deleteOrder,
  getAllOrders,
} = require("../controllers/orderController");
router.route("/orders").get(getAllOrders);

router.route("/order").get(authMiddleware, getAllMyOrders);
router.route("/order/:id").get(authMiddleware, getMyOneOrder);
router.route("/order/new").post(authMiddleware, createOrder);
router
  .route("/admin/order")
  .get(authMiddleware, authorizeRole("admin"), getAllOrders);
router
  .route("/admin/order/:id")
  .patch(authMiddleware, authorizeRole("admin"), updateOrder)
  .delete(authMiddleware, authorizeRole("admin"), deleteOrder);

module.exports = router;
