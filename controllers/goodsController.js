import { StatusCodes } from "http-status-codes";
import { getGoodsService } from "../services/goodsService.js";
import { sendErrorResponse } from "../utils/errorHandlers.js";
import ResponseWrapper from "../utils/response.js";
import { getSortType } from "../utils/sortUitls.js";

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

export { getGoods };
