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
};

export default ERROR_CODES;
