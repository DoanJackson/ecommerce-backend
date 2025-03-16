import Joi from "joi";

const registerUserSchema = Joi.object({
  username: Joi.string().min(1).max(100).required(),
  password: Joi.string().min(1).max(100).required(),
  role: Joi.string().valid("user", "admin").default("user"),
});

const loginUserSchema = Joi.object({
  username: Joi.string().min(1).max(100).required(),
  password: Joi.string().min(1).max(100).required(),
});

export { loginUserSchema, registerUserSchema };
