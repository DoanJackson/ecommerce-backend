import { StatusCodes } from "http-status-codes";
import ERROR_CODES from "../constants/errorCodes.js";
import { OrdersMerchantUpdateDTO } from "../dtos/ordersMerchantDTO.js";
import {
  checkMerchantOrderOwnership,
  getMerchantOrdersService,
  updateOrderStatusService,
} from "../services/merchantOrdersService.js";
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

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
async function updateOrderStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const user_id = req.user.id;

    // check if order exists and is owned by the merchant
    const order = await checkMerchantOrderOwnership(id, user_id);
    if (!order.success) {
      return sendErrorResponse(res, order.error_codes);
    }

    // update order status
    const result = await updateOrderStatusService(id, status);
    if (!result.success) {
      return sendErrorResponse(res, result.error_codes);
    }

    // format the response data
    const formattedMerchantOrders = new OrdersMerchantUpdateDTO(result.data);
    return res
      .status(StatusCodes.OK)
      .json(
        ResponseWrapper.success(
          StatusCodes.OK,
          "Order status updated",
          formattedMerchantOrders
        )
      );
  } catch (error) {
    console.error("Error updating order status", error);
    return sendErrorResponse(res, ERROR_CODES.INTERNAL_SERVER_ERROR);
  }
}

export { getMerchantOrders, updateOrderStatus };
