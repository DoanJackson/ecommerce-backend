import { StatusCodes } from "http-status-codes";
import ERROR_CODES from "../constants/errorCodes.js";
import {
  checkOrdersInputValid,
  createOrdersService,
} from "../services/ordersService.js";
import { sendErrorResponse } from "../utils/errorHandlers.js";
import ResponseWrapper from "../utils/response.js";

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 *
 */
async function createOrders(req, res) {
  try {
    const user_id = req.user.id;
    const { goods_id, quantity, city, district, address } = req.body;

    // check if the goods exists and quantity is enough
    const goods = await checkOrdersInputValid(goods_id, quantity);
    if (!goods.success) {
      return sendErrorResponse(res, goods.error_codes);
    }
    const inputData = {
      price: goods.data.price,
      quantity: quantity,
      goods_id: goods_id,
      user_id: user_id,
      city: city,
      district: district,
      address: address,
    };

    const orders = await createOrdersService(inputData);
    if (!orders.success) {
      return sendErrorResponse(res, orders.error_codes);
    }

    return res
      .status(StatusCodes.CREATED)
      .json(
        ResponseWrapper.success(StatusCodes.CREATED, "Orders created", null)
      );
  } catch (error) {
    console.error("Error creating orders", error);
    return sendErrorResponse(res, ERROR_CODES.INTERNAL_SERVER_ERROR);
  }
}

export { createOrders };
