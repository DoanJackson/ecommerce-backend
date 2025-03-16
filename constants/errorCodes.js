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
};

export default ERROR_CODES;
