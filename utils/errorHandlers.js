import ResponseWrapper from "./response";

/**
 * @param {import('express').Response} res
 * @param {Object} error_code
 * @returns {import('express').Response}
 */
function sendErrorResponse(res, error_code) {
  return res.status(error_code.status).json(ResponseWrapper.error(error_code));
}

export { sendErrorResponse };
