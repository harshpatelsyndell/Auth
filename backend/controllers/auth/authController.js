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

// exports.protect = async (req, res, next) => {
//   // 1) Getting token and check if it's there
//   let token;
//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {
//     token = req.headers.authorization.split(" ")[1];
//   }

//   // console.log("Token:", token);
//   // If token is not present, return an error
//   if (!token) {
//     return res
//       .status(401)
//       .json({ success: false, error: "Authentication token is missing" });
//   }

//   // 2) Verification token
//   const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
//   if (!decoded) {
//     return res.status(401).json({
//       success: false,
//       error: "The User Belonging to this token does no longer exist.",
//     });
//   }
//   // console.log("decoded:", decoded);

//   // 3) check if user still exists
//   const freshUser = await User.findById(decoded.id);
//   if (!freshUser) {
//     return res.status(401).json({
//       success: false,
//       error: "The User Belonging to this token does no longer exist.",
//     });
//   }

//   // 4) check if user changed password after the token was issued

//   next();
// };

const {
  signupService,
  protectService,
  loginService,
} = require("./authService");
const {
  userSignupValidation,
  userLoginValidation,
} = require("../../Validation/validation");
const multer = require("multer");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/img/users");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `user-${Date.now()}.${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("image/jpeg") ||
    file.mimetype.startsWith("image/jpg") ||
    file.mimetype.startsWith("image/png")
  ) {
    cb(null, true);
  } else {
    const error = new Error(
      "Not an image! Please upload only JPEG, JPG, or PNG images."
    );
    error.statusCode = 400;
    cb(error, false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
exports.uploadUserPhoto = (req, res, next) => {
  upload.single("photo")(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: "Error uploading file",
      });
    }
    // No errors, proceed to next middleware
    next();
  });
};

exports.signup = async (req, res) => {
  try {
    const data = req.body;
    const validationError = userSignupValidation(data);

    if (validationError) {
      return res.status(400).json({ success: false, error: validationError });
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

exports.login = async (req, res) => {
  try {
    const data = req.body;
    const validationError = userLoginValidation(data);
    if (validationError) {
      return res.status(400).json({ success: false, error: validationError });
    }

    await loginService(req, res);
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.protect = async (req, res, next) => {
  try {
    await protectService(req, res, next);
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
