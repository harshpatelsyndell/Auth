const User = require("./../../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signupUser = async (data, file) => {
  const newUser = await User.create({
    name: data.name,
    email: data.email,
    password: data.password,
    passwordConfirm: data.passwordConfirm,
    photo: file?.filename,
  });

  const token = signToken(newUser._id);

  const result = { token, newUser };
  return result;
};

exports.loginUser = async (data) => {
  const { email, password } = data;
  const user = await User.findOne({ email });

  if (!user) {
    const statusCode = 401;
    const success = false;
    const result = { message: "Invalid email" };
    return { result, success, statusCode };
  }

  // Compare passwords
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    const statusCode = 401;
    const success = false;
    const result = { message: "Invalid password" };
    return { result, success, statusCode };
  }

  // Password is valid, generate token
  const token = signToken(user._id);
  result = { message: "User verified successfully", token, user };
  success = true;
  statusCode = 200;

  return { result, success, statusCode };
};

exports.protectUserRepo = async (decoded) => {
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return "The User Belonging to this token does no longer exist.";
  }
  return;
};
