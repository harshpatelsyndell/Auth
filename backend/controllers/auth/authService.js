const {
  signupUser,
  protectUserRepo,
  loginUser,
  signupWithGoogleUser,
} = require("./authRepository");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
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
  console.log(file);
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

exports.uploadProfileImageService = async (req, res, next) => {
  try {
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
  } catch (error) {
    console.log("Error(uploadProfileImageService):", error);
    throw new Error(error.message);
  }
};

exports.signupService = async (req, res) => {
  const data = req.body;
  const file = req.file;

  try {
    const { token, newUser } = await signupUser(data, file);

    // res.cookie("jwt", token, {
    //   maxAge: 5 * 60 * 60 * 1000,
    //   httpOnly: true,
    //   sameSite: "strict",
    // });
    return { token, newUser };
  } catch (error) {
    console.log("Error(signupService):", error);
    throw new Error(error.message);
  }
};

exports.signupWithGoogleService = async (req, res) => {
  const data = req.body;
  try {
    const { token, newUser } = await signupWithGoogleUser(data);
    return { token, newUser };
  } catch (error) {
    console.log("Error(signupService):", error);
    throw new Error(error.message);
  }
};

exports.loginService = async (req, res) => {
  const data = req.body;

  try {
    const { success, result, statusCode } = await loginUser(data);
    return res.status(statusCode).json({
      success,
      result,
    });
  } catch (error) {
    console.log("Error(loginService):", error);
    throw new Error(error.message);
  }
};

exports.protectService = async (req, res, next) => {
  try {
    // 1) Getting token and check if it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return res
        .status(401)
        .json({ success: false, error: "Authentication token is missing" });
    }
    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        error: "The User Belonging to this token does no longer exist.",
      });
    }
    const userNotFindError = await protectUserRepo(decoded);

    if (userNotFindError) {
      return res.status(401).json({ success: false, error: userNotFindError });
    }
    req.userId = decoded.id;
    // Authentication successful, call next middleware or route handler
    next();
  } catch (error) {
    console.log("Error(protectService):", error);
    throw new Error(error.message);
  }
};
