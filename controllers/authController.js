import { StatusCodes } from "http-status-codes";
import ERROR_CODES from "../constants/errorCodes.js";
import { loginService, registerService } from "../services/authService.js";
import { sendErrorResponse } from "../utils/errorHandlers.js";
import ResponseWrapper from "../utils/response.js";

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function register(req, res) {
  try {
    const { username, password, role } = req.body;
    const { accessToken, refreshToken } = await registerService(
      username,
      password,
      role
    );

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    return res
      .status(StatusCodes.CREATED)
      .json(ResponseWrapper.success({ accessToken }));
  } catch (error) {
    console.error(error);
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
    const { accessToken, refreshToken } = await loginService(
      username,
      password
    );

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    // Send the response
    res.status(StatusCodes.OK).json(ResponseWrapper.success({ accessToken }));
  } catch (error) {
    console.error(error);
    switch (error.message) {
      case "USER_NOT_FOUND":
        return sendErrorResponse(res, ERROR_CODES.USER_NOT_FOUND);
      case "UNAUTHORIZED":
        return sendErrorResponse(res, ERROR_CODES.UNAUTHORIZED);
      default:
        return sendErrorResponse(res, ERROR_CODES.INTERNAL_SERVER_ERROR);
    }
  }
}

export { login, register };
