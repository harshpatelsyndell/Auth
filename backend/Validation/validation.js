const Joi = require("joi");

const userSignupValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    passwordConfirm: Joi.string()
      .valid(Joi.ref("password"))
      .required()
      .label("Password Confirmation")
      .messages({ "any.only": "Passwords do not match" }),
  });
  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: "Invalid Details..", error });
  }
  next();
};

module.exports = { userSignupValidation };
