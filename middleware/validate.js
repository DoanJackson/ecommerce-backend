import Joi from "joi";
import ERROR_CODES from "../constants/errorCodes";

/**
 *
 * @param {Joi.ObjectSchema} schema
 * @returns {Function}
 */
function validate(schema) {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  return function (req, res, next) {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(ERROR_CODES.INVALID_INPUT.status).json({
        message: ERROR_CODES.INVALID_INPUT.message,
        details: error.details.map((error) => error.message),
      });
    }

    next();
  };
}

export default validate;
