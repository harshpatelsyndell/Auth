const User = require("../../models/userModel");

exports.userDetailRepository = async (userId) => {
  try {
    const user = await User.findById(userId);
    const { photo, email, name, googleId } = user;

    let imagePath;

    if (googleId && photo.startsWith("https://")) {
      imagePath = photo;
    } else {
      imagePath = `http://localhost:8000/img/users/${photo}`;
    }

    return { imagePath, email, name, googleId };
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw new Error("Failed to fetch user details");
  }
};
