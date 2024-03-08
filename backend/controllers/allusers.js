// controllers/UserController.js

const User = require("../models/userModel");

exports.getAllUserNames = async (req, res) => {
  try {
    // const jwt = req.cookies;
    // const authorization = req.cookies.authorization;
    // console.log("backend", jwt);
    // console.log("frontend", authorization);
    // Fetch all user documents from the database
    const users = await User.find({}, "name");

    // Extract user names from the user documents
    const userNames = users.map((user) => user.name);

    // Send the user names in the response
    res.status(200).json({ success: true, userNames });
  } catch (error) {
    // Handle errors
    console.error("Error fetching user names:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
