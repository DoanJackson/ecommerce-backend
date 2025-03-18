import { Sequelize } from "sequelize";
import ERROR_CODES from "../constants/errorCodes.js";
import ROLES from "../constants/role.js";
import { sequelize, Users } from "../models/index.js";
import { generateAccessToken } from "../utils/tokenUtils.js";

/**
 * @param {Object} user
 * @param {number} user.id
 * @param {string[]} user.roles
 * @returns {Promise<{success: boolean, accessToken: string, error_codes?: ERROR_CODES}>}
 */
async function becomeMerchantService(user) {
  const t = await sequelize.transaction();
  try {
    const userCheck = await Users.findByPk(user.id);
    // Check if user exists
    if (!userCheck) {
      return { success: false, error_codes: ERROR_CODES.USER_NOT_FOUND };
    }
    if (userCheck.roles.includes(ROLES.MERCHANT)) {
      // generate access token
      const accessToken = generateAccessToken(userCheck);
      return { success: true, accessToken: accessToken };
    }

    await Users.update(
      {
        roles: Sequelize.fn(
          "array_append",
          Sequelize.col("roles"),
          ROLES.MERCHANT
        ),
      },
      { where: { id: user.id }, transaction: t }
    );

    await t.commit();
    // generate access token
    const accessToken = generateAccessToken(userCheck);
    return { success: true, accessToken: accessToken };
  } catch (error) {
    t.rollback();
    return { success: false, error_codes: ERROR_CODES.INTERNAL_SERVER_ERROR };
  }
}

export { becomeMerchantService };
