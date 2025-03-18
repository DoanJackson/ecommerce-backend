import { StatusCodes } from "http-status-codes";
import { becomeMerchantService } from "../services/userService.js";
import { sendErrorResponse } from "../utils/errorHandlers.js";
import ResponseWrapper from "../utils/response.js";

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
async function becomeMerchant(req, res) {
  const user = req.user;
  const { success, accessToken, error_codes } = await becomeMerchantService(
    user
  );
  if (!success) {
    return sendErrorResponse(res, error_codes);
  }
  return res
    .status(StatusCodes.OK)
    .json(ResponseWrapper.success({ accessToken }));
}

export { becomeMerchant };
