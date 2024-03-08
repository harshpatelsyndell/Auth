const { userDetailRepository } = require("./userDetailRepository");

exports.userDetailService = async (req, res) => {
  try {
    const userId = req.userId;
    const result = await userDetailRepository(userId);
    return res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    console.log("userDetailControllerError:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
