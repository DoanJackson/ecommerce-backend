import Joi from "joi";
import ERROR_CODES from "../constants/errorCodes.js";

const registerUserSchema = Joi.object({
  username: Joi.string().min(1).max(100).required(),
  password: Joi.string().min(1).max(100).required(),
  role: Joi.string().valid("user", "admin").default("user"),
});

function validateRegisterUser(req, res, next) {
  const { error } = registerUserSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res.status(ERROR_CODES.INVALID_INPUT.status).json({
      message: ERROR_CODES.INVALID_INPUT.message,
      details: error.details.map((error) => error.message),
    });
  }

  next();
}

export { validateRegisterUser };
