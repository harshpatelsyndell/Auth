const { userDetailService } = require("./userDetailService");

exports.userDetail = async (req, res) => {
  try {
    await userDetailService(req, res);
  } catch (error) {
    console, log("userDetailControllerError:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
