import { StatusCodes } from "http-status-codes";

const ERROR_CODES = {
  INVALID_INPUT: { status: StatusCodes.BAD_REQUEST, message: "INVALID_INPUT" },
  USER_EXISTS: { status: StatusCodes.CONFLICT, message: "USER_EXISTS" },
  INTERNAL_SERVER_ERROR: {
    status: StatusCodes.INTERNAL_SERVER_ERROR,
    message: "INTERNAL_SERVER_ERROR",
  },
  USER_NOT_FOUND: { status: StatusCodes.NOT_FOUND, message: "USER_NOT_FOUND" },
  UNAUTHORIZED: { status: StatusCodes.UNAUTHORIZED, message: "UNAUTHORIZED" },
  FORBIDDEN: { status: StatusCodes.FORBIDDEN, message: "FORBIDDEN" },
  INVALID_REFRESH_TOKEN: {
    status: StatusCodes.BAD_REQUEST,
    message: "INVALID_REFRESH_TOKEN",
  },
  INVALID_OR_EXPIRED_TOKEN: {
    status: StatusCodes.BAD_REQUEST,
    message: "INVALID_OR_EXPIRED_TOKEN",
  },
  GOODS_NOT_FOUND: {
    status: StatusCodes.NOT_FOUND,
    message: "GOODS_NOT_FOUND",
  },
  EXTERNAL_SERVICE_ERROR: {
    status: StatusCodes.BAD_GATEWAY,
    message: "EXTERNAL_SERVICE_ERROR",
  },
  // error when save image data in database
  SAVE_IMAGE_ERROR: {
    status: StatusCodes.INTERNAL_SERVER_ERROR,
    message: "SAVE_IMAGE_ERROR",
  },
  // error when delete image data in database
  DELETE_IMAGE_ERROR: {
    status: StatusCodes.INTERNAL_SERVER_ERROR,
    message: "DELETE_IMAGE_ERROR",
  },
  QUANTITY_NOT_ENOUGH: {
    status: StatusCodes.CONFLICT,
    message: "QUANTITY_NOT_ENOUGH",
  },
  ORDER_CREATE_FAILED: {
    status: StatusCodes.INTERNAL_SERVER_ERROR,
    message: "ORDER_CREATE_FAILED",
  },
  CANNOT_CREATE_ORDER: {
    status: StatusCodes.INTERNAL_SERVER_ERROR,
    message: "CANNOT_CREATE_ORDER",
  },
  MERCHANT_BUY_OWN_PRODUCT: {
    status: StatusCodes.FORBIDDEN,
    message: "MERCHANT_BUY_OWN_PRODUCT",
  },
  ORDER_NOT_FOUND: {
    status: StatusCodes.NOT_FOUND,
    message: "ORDER_NOT_FOUND",
  },
  RETRIEVE_ORDER_FAILED: {
    status: StatusCodes.INTERNAL_SERVER_ERROR,
    message: "RETRIEVE_ORDER_FAILED",
  },
  RETRIEVE_MERCHANT_ORDERS_FAILED: {
    status: StatusCodes.INTERNAL_SERVER_ERROR,
    message: "RETRIEVE_MERCHANT_ORDERS_FAILED",
  },
};

export default ERROR_CODES;
