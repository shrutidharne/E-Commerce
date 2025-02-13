const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
    maxlength: [30, "Name should be less than 30 characters"],
    minlength: [4, "Name should have more than 4 characters"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    validate: [validator.isEmail, "Please enter valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minlength: [8, "Password should be greater than 8 characters"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

//hash password before storing them
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

//Generate JWT token for the user
UserSchema.methods.createJWT = function () {
  const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_LIFETIME,
  });
  return token;
};

//Check the input password
UserSchema.methods.isPasswordCorrect = async function (inputPassword) {
  const isPasswordMatch = await bcrypt.compare(inputPassword, this.password);
  return isPasswordMatch;
};

//generate reset token
UserSchema.methods.generateResetToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = new Date(Date.now() + 15 * 60 * 1000);

  return resetToken;
};

module.exports = mongoose.model("User", UserSchema);
