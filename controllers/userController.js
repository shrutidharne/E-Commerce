const crypto = require("crypto");
const User = require("../models/userModel");
const { StatusCodes } = require("http-status-codes");
const sendToken = require("../utils/sendToken");
const sendEmail = require("../utils/sendEmail");
const {
  BadRequest,
  Unauthorized,
  NotFound,
  CustomAPIError,
} = require("../errors");
const ApiFeatures = require("../utils/api-feature");

const registerUser = async (req, res) => {
  const { email, name, password } = req.body;
  const user = await User.create({
    email,
    name,
    password,
    avatar: {
      public_id: "This is public id",
      url: "This is profile photo url",
    },
  });
  sendToken(user, StatusCodes.CREATED, res);
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequest(`Please enter the email and password`);
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new Unauthorized(`Invalid email or password`);
  }
  const checkPassword = await user.isPasswordCorrect(password);
  if (!checkPassword) {
    throw new Unauthorized(`Invalid email or passwords`);
  }

  // If user requested for password and while changing realises his old password and then logs back in using old password .. now we need to reset the resetPasswordToken in that case
  if (user.resetPasswordToken) {
    user.resetPasswordExpire = null;
    user.resetPasswordToken = null;
    await user.save();
  }
  sendToken(user, StatusCodes.OK, res);
};

const logoutUser = async (req, res) => {
  res.cookie("token", null, {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({
    success: true,
    message: "Logged out successfully",
  });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({
    email,
  });
  if (!user) {
    throw new BadRequest(`No user with email ${email}`);
  }

  const resetToken = user.generateResetToken();
  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;
  const resetPasswordMessage = "Here is the link to reset your password";

  try {
    await sendEmail({
      to: email,
      subject: `E-commerce website reset password`,
      resetPasswordMessage,
      resetPasswordUrl,
    });
    res.status(StatusCodes.OK).json({
      success: true,
      message: `Email sent successfully to ${email}`,
    });
  } catch (err) {
    user.resetPasswordToken = null;
    user.resetPasswordToken = null;
    await user.save({ validateBeforeSave: false });
    throw new CustomAPIError(`Internal Server Error`);
  }
};

//reset password using link sent on mail
const resetPassword = async (req, res) => {
  const token = req.params.token;
  const { newPassword, confirmNewPassword } = req.body;

  const resetToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordExpire: { $gt: Date.now() },
    resetPasswordToken: resetToken,
  }).select("+password");

  if (!user) {
    throw new Unauthorized(`Token invalid or expired`);
  }

  const isPasswordSame = await user.isPasswordCorrect(newPassword);

  if (isPasswordSame) {
    throw new BadRequest(`New password cannot be same as last`);
  }

  if (newPassword !== confirmNewPassword) {
    throw new BadRequest(`Password dont match`);
  }

  user.password = newPassword;
  user.resetPasswordExpire = null;
  user.resetPasswordToken = null;
  await user.save({ validateBeforeSave: false });
  sendToken(user, StatusCodes.OK, res);
};

//view profile
const getMyDetails = async (req, res) => {
  const user = await User.findById(req.user._id);
  res.status(StatusCodes.OK).json({
    success: true,
    user,
  });
};

//change password
const updateMyPassword = async (req, res) => {
  const user = await User.findById(req.user._id).select("+password");
  const { oldPassword, newPassword, confirmNewPassword } = req.body;
  const isOldCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isOldCorrect) {
    throw new Unauthorized(`Invalid Password entered for old pass`);
  }
  if (oldPassword === newPassword) {
    throw new BadRequest(`New password cannot be same as last`);
  }
  if (newPassword !== confirmNewPassword) {
    throw new BadRequest(`Password dont match`);
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });
  sendToken(user, StatusCodes.OK, res);
};

//change profile email or name
const updateProfile = async (req, res) => {
  const updatedData = {
    email: req.body.email,
    name: req.body.name,
  };
  const user = await User.findByIdAndUpdate(req.user._id, updatedData, {
    runValidators: true,
    new: true,
  });

  res.status(StatusCodes.OK).json({
    success: true,
    user,
  });
};

//ADMIN ROUTES FOR USER MANAGEMENT
const getAllUsers = async (req, res) => {
  const usersPerPage = 5;
  const apifeatures = new ApiFeatures(User.find(), req.query)
    .search()
    .pagination(usersPerPage);
  const users = await apifeatures.query;
  res.status(StatusCodes.OK).json({
    success: true,
    users,
  });
};

const getOneUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new NotFound(`No user found with id ${req.params.id}`);
  }
  res.status(StatusCodes.OK).json({
    success: true,
    user,
  });
};

const updateUser = async (req, res) => {
  const updatedData = {
    email: req.body.email,
    name: req.body.name,
    role: req.body.role,
  };
  const user = await User.findByIdAndUpdate(req.params.id, updatedData, {
    runValidators: true,
    new: true,
  });
  if (!user) {
    throw new NotFound(`No user found with id ${req.params.id}`);
  }
  res.status(StatusCodes.OK).json({
    success: true,
    user,
  });
};

const deleteUser = async (req, res) => {
  //Delete data from cloud also
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    throw new NotFound(`No user found with id ${req.params.id}`);
  }
  res.status(StatusCodes.OK).json({
    success: true,
    message: `User deleted successfully`,
  });
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  getMyDetails,
  updateMyPassword,
  resetPassword,
  updateProfile,
  getAllUsers,
  getOneUser,
  deleteUser,
  updateUser,
};
