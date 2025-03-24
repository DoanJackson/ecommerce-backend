import ERROR_CODES from "../constants/errorCodes.js";
import { Goods, sequelize, Types } from "../models/index.js";

/**
 * @param {Object} input
 * @param {string} input.name
 * @param {number} input.quantity
 * @param {number} input.price
 * @param {string} input.description
 * @param {Array} input.types
 * @param {string} input.user_id
 */
async function createGoodsService(input) {
  const t = await sequelize.transaction();
  try {
    const newGoods = await Goods.create(
      {
        user_id: input.user_id,
        name: input.name,
        quantity: input.quantity,
        price: input.price,
        description: input.description,
      },
      { transaction: t }
    );

    if (input.types && input.types.length > 0) {
      const validTypes = await Types.findAll({
        where: {
          id: input.types,
        },
        transaction: t,
      });
      await newGoods.addTypes(validTypes, { transaction: t });
    }

    await t.commit();
    return { success: true };
  } catch (error) {
    // throw error;
    console.error("Error creating goods", error);
    await t.rollback();
    return { success: false, error_codes: ERROR_CODES.INTERNAL_SERVER_ERROR };
  }
}

export { createGoodsService };
