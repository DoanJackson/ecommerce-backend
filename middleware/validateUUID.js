import validator from "validator";
import ERROR_CODES from "../constants/errorCodes.js";
import { sendErrorResponse } from "../utils/errorHandlers.js";

/**
 *
 * @param {Array} arrayParams
 */
function validateUUID(arrayParams) {
  /**
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  return function (req, res, next) {
    const hasInvalidUUID = arrayParams.some(
      (param) => !validator.isUUID(req.params[param])
    );
    if (hasInvalidUUID) {
      return sendErrorResponse(res, ERROR_CODES.INVALID_INPUT);
    }
    next();
  };
}

export { validateUUID };
