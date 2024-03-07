const express = require("express");
const router = express.Router();
const authController = require("./../controllers/auth/authController");
const { userSignupValidation } = require("../Validation/validation");

router.post("/signup", userSignupValidation, authController.signup);

module.exports = router;
