import { OAuth2Client } from "google-auth-library";
import { StatusCodes } from "http-status-codes";
import { getEnv } from "../config/env.js";
import ERROR_CODES from "../constants/errorCodes.js";
import {
  getGoogleAuthUrl,
  handleGoogleCallback,
} from "../services/googleAuthService.js";
import { sendErrorResponse } from "../utils/errorHandlers.js";
import ResponseWrapper from "../utils/response.js";

const oAuth2Client = new OAuth2Client(
  getEnv("GOOGLE_CLIENT_ID"),
  getEnv("GOOGLE_CLIENT_SECRET"),
  getEnv("GOOGLE_REDIRECT_URI")
);

/**
 *
 * @param {import('express').Request} req - request
 * @param {import('express').Response} res - response
 *
 * @route GET /api/auth/google
 *
 */
function googleAuth(req, res) {
  const authUrl = getGoogleAuthUrl(oAuth2Client);
  res.redirect(authUrl);
}

/**
 * @param {import('express').Request} req - request
 * @param {import('express').Response} res - response
 *
 * @route GET /api/auth/google/callback
 * @async
 */
async function googleAuthCallback(req, res) {
  const { code } = req.query; // get code from query

  try {
    const { access_token, refresh_token } = await handleGoogleCallback(
      oAuth2Client,
      code
    );

    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    // send user info
    res.status(StatusCodes.OK).json(ResponseWrapper.success({ access_token }));
  } catch (error) {
    console.error("Google callback error:", error);
    return sendErrorResponse(res, ERROR_CODES.INTERNAL_SERVER_ERROR);
  }
}

export { googleAuth, googleAuthCallback };
