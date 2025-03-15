import { StatusCodes } from "http-status-codes";

const ERROR_CODES = {
  INVALID_INPUT: { status: StatusCodes.BAD_REQUEST, message: "INVALID_INPUT" },
  USER_EXISTS: { status: StatusCodes.CONFLICT, message: "USER_EXISTS" },
  INTERNAL_SERVER_ERROR: {
    status: StatusCodes.INTERNAL_SERVER_ERROR,
    message: "INTERNAL_SERVER_ERROR",
  },
};

export default ERROR_CODES;
