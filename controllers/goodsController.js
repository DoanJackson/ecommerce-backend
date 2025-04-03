import { StatusCodes } from "http-status-codes";
import ERROR_CODES from "../constants/errorCodes.js";
import {
  getDetailGoodsService,
  getGoodsService,
} from "../services/goodsService.js";
import { sendErrorResponse } from "../utils/errorHandlers.js";
import ResponseWrapper from "../utils/response.js";
import { getSortType } from "../utils/sortUitls.js";

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
async function getGoods(req, res) {
  try {
    const { page = 1, limit = 10, search = "", sort = "" } = req.query;
    const sortType = getSortType(["price", "number_sold", "created_at"], sort);

    const result = await getGoodsService({ page, limit, search, sortType });
    if (result.success) {
      return res
        .status(StatusCodes.OK)
        .json(ResponseWrapper.success(StatusCodes.OK, "Success", result.data));
    }
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
async function getDetailGoods(req, res) {
  try {
    const { id } = req.params;
    const result = await getDetailGoodsService(id);
    if (!result.success) {
      return sendErrorResponse(res, result.error_codes);
    }
    return res
      .status(StatusCodes.OK)
      .json(ResponseWrapper.success(StatusCodes.OK, null, result.data));
  } catch (error) {
    console.error("Error getting goods", error);
    sendErrorResponse(res, ERROR_CODES.INTERNAL_SERVER_ERROR);
  }
}

export { getDetailGoods, getGoods };
