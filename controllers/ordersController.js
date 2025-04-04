import { StatusCodes } from "http-status-codes";
import ERROR_CODES from "../constants/errorCodes.js";
import {
  checkOrdersExists,
  checkOrdersInputValid,
  createOrdersService,
  deleteOrdersService,
  getOrdersService,
} from "../services/ordersService.js";
import { sendErrorResponse } from "../utils/errorHandlers.js";
import ResponseWrapper from "../utils/response.js";
import { getSortType } from "../utils/sortUitls.js";

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

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function deleteOrders(req, res) {
  try {
    // check if the orders exists
    const orders_id = req.params.id;
    const user_id = req.user.id;
    const orders = await checkOrdersExists(orders_id);
    if (!orders.success) {
      return sendErrorResponse(res, orders.error_codes);
    }
    // check if the user is the owner of the orders
    if (orders.data.user_id !== user_id) {
      return sendErrorResponse(res, ERROR_CODES.FORBIDDEN);
    }
    // delete the orders
    const result = await deleteOrdersService(orders_id, user_id);
    if (!result.success) {
      return sendErrorResponse(res, result.error_codes);
    }
    return res
      .status(StatusCodes.OK)
      .json(ResponseWrapper.success(StatusCodes.OK, "Orders delted", null));
  } catch (error) {
    console.error("Error deleting orders", error);
    return sendErrorResponse(res, ERROR_CODES.INTERNAL_SERVER_ERROR);
  }
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
async function getOrders(req, res) {
  try {
    const { page = 1, limit = 10, search = "", sort = "" } = req.query;
    const sortType = getSortType(["created_at"], sort);

    const result = await getOrdersService({
      page,
      limit,
      search,
      sortType,
      user_id: req.user.id,
    });
    if (!result.success) {
      return sendErrorResponse(res, result.error_codes);
    }
    return res
      .status(StatusCodes.OK)
      .json(ResponseWrapper.success(StatusCodes.OK, "Success", result.data));
  } catch (error) {
    console.error("Error getting orders", error);
    return sendErrorResponse(res, ERROR_CODES.INTERNAL_SERVER_ERROR);
  }
}

export { createOrders, deleteOrders, getOrders };
