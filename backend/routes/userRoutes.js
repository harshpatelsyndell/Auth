const express = require("express");
const router = express.Router();
const authController = require("./../controllers/auth/authController");
const { getAllUserNames } = require("../controllers/allusers");
const {
  userDetail,
} = require("../controllers/userDetail.js/userDetailController");

router.post("/signup", authController.uploadUserPhoto, authController.signup);
router.post("/loginwithgoogle", authController.signupWithGoogle);
router.post("/login", authController.login);
router.get("/users", authController.protect, getAllUserNames);
router.get("/", authController.protect, userDetail);

module.exports = router;
