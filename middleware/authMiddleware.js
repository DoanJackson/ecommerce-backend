import { getEnv } from "../config/env.js";
import ERROR_CODES from "../constants/errorCodes.js";
import { sendErrorResponse } from "../utils/errorHandlers.js";
import { verifyToken } from "../utils/tokenUtils.js";

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function authenticateUser(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return sendErrorResponse(res, ERROR_CODES.UNAUTHORIZED);
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = verifyToken(token, getEnv("JWT_SECRET"));
    req.user = { id: decoded.id, roles: decoded.roles };
    next();
  } catch (error) {
    return sendErrorResponse(res, ERROR_CODES.INVALID_OR_EXPIRED_TOKEN);
  }
}

export { authenticateUser };
