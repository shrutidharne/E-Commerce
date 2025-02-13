const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getMyDetails,
  updateMyPassword,
  updateProfile,
  getAllUsers,
  getOneUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const {
  authMiddleware,
  authorizeRole,
} = require("../middleware/authentication");

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(authMiddleware, logoutUser);
router.route("/password/forgot").get(forgotPassword);
router.route("/password/reset/:token").patch(resetPassword);
router.route("/me").get(authMiddleware, getMyDetails);
router.route("/password/update").patch(authMiddleware, updateMyPassword);
router.route("/me/update").patch(authMiddleware, updateProfile);

router
  .route("/admin/user")
  .get(authMiddleware, authorizeRole("admin"), getAllUsers);
router
  .route("/admin/user/:id")
  .get(authMiddleware, authorizeRole("admin"), getOneUser)
  .patch(authMiddleware, authorizeRole("admin"), updateUser)
  .delete(authMiddleware, authorizeRole("admin"), deleteUser);

module.exports = router;
