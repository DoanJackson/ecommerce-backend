import { StatusCodes } from "http-status-codes";
import ERROR_CODES from "../constants/errorCodes.js";
import {
  createGoodsService,
  deleteGoodsService,
  getGoodsDetailService,
  getGoodsService,
  updateGoodsService,
} from "../services/merchantGoodsService.js";
import { sendErrorResponse } from "../utils/errorHandlers.js";
import ResponseWrapper from "../utils/response.js";
import { getSortType } from "../utils/sortUitls.js";

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
async function createGoods(req, res) {
  try {
    const user_id = req.user.id;
    const result = await createGoodsService({ ...req.body, user_id: user_id });
    if (result.success) {
      res.status(StatusCodes.OK).json(ResponseWrapper.success());
      return;
    }
    sendErrorResponse(res, result.error_codes);
  } catch (error) {
    console.error("Error creating goods", error);
    sendErrorResponse(res, ERROR_CODES.INTERNAL_SERVER_ERROR);
  }
}

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
async function getGoods(req, res) {
  try {
    // Get query params
    const { page = 1, limit = 10, search = "", sort = "" } = req.query;
    const user_id = req.user.id;
    const offset = (page - 1) * limit;
    let sortType = getSortType(["price", "number_sold", "created_at"], sort);

    // Call service
    const result = await getGoodsService({
      user_id,
      page,
      limit,
      offset,
      search,
      sortType,
    });

    // Send response
    if (result.success) {
      return res
        .status(StatusCodes.OK)
        .json(ResponseWrapper.success(StatusCodes.OK, "Success", result.data));
    }
    // Send error response
    sendErrorResponse(res, result.error_codes);
  } catch (error) {
    console.error("Error getting goods", error);
    sendErrorResponse(res, ERROR_CODES.INTERNAL_SERVER_ERROR);
  }
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
async function getGoodsDetail(req, res) {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    // Call service
    const result = await getGoodsDetailService({ id, user_id });
    // Send response
    if (result.success) {
      return res
        .status(StatusCodes.OK)
        .json(ResponseWrapper.success(StatusCodes.OK, "Success", result.data));
    }
    // Send error response
    sendErrorResponse(res, result.error_codes);
  } catch (error) {
    console.error("Error getting goods detail", error);
    sendErrorResponse(res, ERROR_CODES.INTERNAL_SERVER_ERROR);
  }
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
async function updateGoods(req, res) {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    const result = await updateGoodsService({ ...req.body, id, user_id });
    if (result.success) {
      res.status(StatusCodes.NO_CONTENT).send();
      return;
    }
    sendErrorResponse(res, result.error_codes);
  } catch (error) {
    console.error("Error updating goods", error);
    sendErrorResponse(res, ERROR_CODES.INTERNAL_SERVER_ERROR);
  }
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
async function deleteGoods(req, res) {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    const result = await deleteGoodsService({ id, user_id });
    if (result.success) {
      res.status(StatusCodes.NO_CONTENT).send();
      return;
    }
    sendErrorResponse(res, result.error_codes);
  } catch (error) {
    console.error("Error deleting goods", error);
    sendErrorResponse(res, ERROR_CODES.INTERNAL_SERVER_ERROR);
  }
}

export { createGoods, deleteGoods, getGoods, getGoodsDetail, updateGoods };
