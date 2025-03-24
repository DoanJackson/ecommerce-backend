import { StatusCodes } from "http-status-codes";
import ERROR_CODES from "../constants/errorCodes.js";
import { createGoodsService } from "../services/merchantGoodsService.js";
import { sendErrorResponse } from "../utils/errorHandlers.js";
import ResponseWrapper from "../utils/response.js";

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
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

export { createGoods };
