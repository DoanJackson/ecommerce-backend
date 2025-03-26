import ERROR_CODES from "../constants/errorCodes.js";
import { sendErrorResponse } from "../utils/errorHandlers.js";

/**
 * @param {String} roleName
 * @returns {Function}
 */
function hasRole(roleName) {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').Next Function} next
   * @returns {void}
   */
  return (req, res, next) => {
    const { roles } = req.user;
    if (!roles.includes(roleName)) {
      return sendErrorResponse(res, ERROR_CODES.FORBIDDEN);
    }
    next();
  };
}

/**
 * @param {String} roleName
 * @returns {Function}
 */
function notHasRole(roleName) {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').Next Function} next
   * @returns {void}
   */
  return (req, res, next) => {
    const { roles } = req.user;
    if (roles.includes(roleName)) {
      return sendErrorResponse(res, ERROR_CODES.FORBIDDEN);
    }
    next();
  };
}

/**
 * @param {Array<String>} listRoles
 * @returns {Function}
 */
function hasAnyRole(listRoles) {
  /**
   * @param {import('express').Request}
   * @param {import('express').Response}
   * @param {import('express').Next Function}
   * @returns {void}
   */
  return (req, res, next) => {
    const { roles } = req.user;
    if (!roles.some((role) => listRoles.includes(role))) {
      return sendErrorResponse(res, ERROR_CODES.FORBIDDEN);
    }
    next();
  };
}

export { hasAnyRole, hasRole, notHasRole };
