// const User = require("./../../models/userModel");
// const jwt = require("jsonwebtoken");

// // console.log(process.env.JWT_SECRET);

// const signToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRES_IN,
//   });
// };

// exports.signup = async (req, res) => {
//   const newUser = await User.create({
//     name: req.body.name,
//     email: req.body.email,
//     password: req.body.password,
//     passwordConfirm: req.body.passwordConfirm,
//   });

//   const token = signToken(newUser._id);

//   // Set the JWT token as a cookie
//   //   res.cookie("jwt", token, {
//   //     expires: new Date(
//   //       Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
//   //     ), // Cookie expires in X days
//   //     httpOnly: true, // Cookie cannot be accessed via client-side scripts
//   //     secure: req.secure || req.headers["x-forwarded-proto"] === "https", // Cookie sent over HTTPS only in production
//   //   });
//   res.cookie("token", token, {
//     maxAge: 5 * 60 * 60 * 1000,

//     // prevent XSS CSRF attacks
//     httpOnly: true,
//     sameSite: "strict",
//   });

//   res.status(201).json({
//     status: "success",
//     token,
//     data: {
//       newUser,
//     },
//   });
// };

const { signupService } = require("./authService");

exports.signup = async (req, res) => {
  try {
    const data = req.body;
    if (
      !data ||
      !data.name ||
      !data.email ||
      !data.password ||
      !data.passwordConfirm
    ) {
      return res
        .status(400)
        .json({ success: false, message: "some field missing" });
    }
    const result = await signupService(req, res);
    res.status(201).json({
      success: true,
      result,
    });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
