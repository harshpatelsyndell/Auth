const User = require("../../models/userModel");

exports.userDetailRepository = async (userId) => {
  try {
    const user = await User.findById(userId);
    const { photo, email, name } = user;
    const imagePath = `/img/users/${photo}`;
    return { imagePath, email, name };
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw new Error("Failed to fetch user details");
  }
};
