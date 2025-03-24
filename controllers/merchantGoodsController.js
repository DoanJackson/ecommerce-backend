import { StatusCodes } from "http-status-codes";
import ERROR_CODES from "../constants/errorCodes.js";
import {
  createGoodsService,
  updateGoodsService,
} from "../services/merchantGoodsService.js";
import { sendErrorResponse } from "../utils/errorHandlers.js";
import ResponseWrapper from "../utils/response.js";

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

export { createGoods, updateGoods };
