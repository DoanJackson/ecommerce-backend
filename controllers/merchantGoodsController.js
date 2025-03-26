import { StatusCodes } from "http-status-codes";
import ERROR_CODES from "../constants/errorCodes.js";
import {
  checkGoodsOwnership,
  createGoodsService,
  deleteGoodsService,
  getGoodsDetailService,
  getGoodsService,
  getPresignedUrlService,
  saveImageService,
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

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
async function getPresignedUrl(req, res) {
  try {
    const { id_product, file_count } = req.body; // folder needs upload
    const { id } = req.user;
    // Check if user is the owner of the product
    const isOwner = await checkGoodsOwnership(id_product, id);
    if (!isOwner) return sendErrorResponse(res, isOwner.error_codes);
    // Call service
    const url = await getPresignedUrlService(id_product, id, file_count);
    if (!url.success) return sendErrorResponse(res, url.error_codes);
    return res
      .status(StatusCodes.OK)
      .json(
        ResponseWrapper.success(
          StatusCodes.OK,
          "Generated presigned URL",
          url.data
        )
      );
  } catch (error) {
    console.error("Error in generate presignedUrl: ", error);
    sendErrorResponse(res, ERROR_CODES.DELETE_IMAGE_ERROR);
  }
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
async function saveImage(req, res) {
  try {
    const { goods_id } = req.params;
    const { images } = req.body;
    const { id } = req.user;
    // Check if user is the owner of the product
    const isOwner = await checkGoodsOwnership(goods_id, id);
    if (!isOwner) return sendErrorResponse(res, isOwner.error_codes);

    // Call service
    const result = await saveImageService(goods_id, images);
    if (!result.success) {
      return sendErrorResponse(res, result.error_codes);
    }
    return res.status(StatusCodes.OK).json(ResponseWrapper.success());
  } catch (error) {
    console.error("Error saving image", error);
    sendErrorResponse(res, ERROR_CODES.SAVE_IMAGE_ERROR);
  }
}

export {
  createGoods,
  deleteGoods,
  getGoods,
  getGoodsDetail,
  getPresignedUrl,
  saveImage,
  updateGoods,
};
