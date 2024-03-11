const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
  },
  name: {
    type: String,
    required: [true, "Please tell us Your name!"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email!"],
    unique: true,
    lowercase: true,
  },
  photo: {
    type: String,
    default: "default.png",
  },
  password: {
    type: String,
    // required: [true, "please provide a password"],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    // required: [true, "please confirm your password"],
  },
});

userSchema.pre("save", async function (next) {
  // only run this function if pass was actually modified
  if (!this.isModified("password")) return next();

  // hash the pass with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // delete passwordconfirm field
  this.passwordConfirm = undefined;
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;

// npm i bcryptjs
