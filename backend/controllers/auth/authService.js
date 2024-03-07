const { signupUser } = require("./authRepository");

exports.signupService = async (req, res) => {
  const data = req.body;

  try {
    const { token, newUser } = await signupUser(data);

    res.cookie("jwt", token, {
      maxAge: 5 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
    });
    return { token, newUser };
  } catch (error) {
    console.log("Error:", error);
    throw new Error(error.message);
  }
};
