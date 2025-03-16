import { StatusCodes } from "http-status-codes";
import ERROR_CODES from "../constants/errorCodes.js";
import { loginService, registerService } from "../services/authService.js";
import { sendErrorResponse } from "../utils/errorHandlers.js";

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function register(req, res) {
  try {
    const { username, password, role } = req.body;
    const result = await registerService(username, password, role);

    return res.status(StatusCodes.CREATED).json({ ...result });
  } catch (error) {
    return sendErrorResponse(res, ERROR_CODES.USER_EXISTS);
  }
}

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function login(req, res) {
  try {
    const { username, password } = req.body;
    const result = await loginService(username, password);
    if (!result.success) return sendErrorResponse(res, result.error_codes);
    // Send the response
    res.status(StatusCodes.OK).json({ ...result });
  } catch (error) {
    return sendErrorResponse(res, ERROR_CODES.INTERNAL_SERVER_ERROR);
  }
}

export { login, register };
