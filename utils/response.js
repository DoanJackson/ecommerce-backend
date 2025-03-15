import { StatusCodes } from "http-status-codes";
import ERROR_CODES from "../constants/errorCodes.js";

function successResponse(data, message = "Success", status = StatusCodes.OK) {
  return {
    success: true,
    status,
    message,
    data,
  };
}

function errorResponse(error = ERROR_CODES.INTERNAL_SERVER_ERROR) {
  return {
    success: false,
    status: error.status,
    message: error.message,
  };
}

export { successResponse, errorResponse };
