import { StatusCodes } from "http-status-codes";
import ERROR_CODES from "../constants/errorCodes.js";
import { getMerchantOrdersService } from "../services/merchantOrdersService.js";
import { sendErrorResponse } from "../utils/errorHandlers.js";
import ResponseWrapper from "../utils/response.js";
import { getSortType } from "../utils/sortUitls.js";

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
async function getMerchantOrders(req, res) {
  try {
    // Get the user ID of merchant
    const user_id = req.user.id;
    const { page = 1, limit = 10, search = "", sort = "" } = req.query;
    const sortType = getSortType(["created_at"], sort);

    const input = {
      page,
      limit,
      search,
      sortType,
      user_id,
    };
    // get all orders of the merchant
    const result = await getMerchantOrdersService(input);
    if (!result.success) {
      return sendErrorResponse(res, result.error_codes);
    }
    return res
      .status(StatusCodes.OK)
      .json(
        ResponseWrapper.success(
          StatusCodes.OK,
          "Merchant orders retrieved",
          result.data
        )
      );
  } catch (error) {
    console.error("Error getting merchant orders", error);
    return sendErrorResponse(res, ERROR_CODES.INTERNAL_SERVER_ERROR);
  }
}

export { getMerchantOrders };
