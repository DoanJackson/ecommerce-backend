import ERROR_CODES from "../constants/errorCodes.js";
import { Goods, sequelize, Types } from "../models/index.js";
import { sanitizeUpdateData } from "../utils/sanitizeUpdateData.js";

/**
 * @param {Object} input
 * @param {string} input.name
 * @param {number} input.quantity
 * @param {number} input.price
 * @param {string} input.description
 * @param {Array} input.types
 * @param {string} input.user_id
 * @returns {Promise<{success: boolean, error_codes?: string[]}>}
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

/**
 * @param {Object} input
 * @param {string} input.id
 * @param {string} input.user_id
 * @param {number} input.quantity
 * @param {number} input.price
 * @param {string} input.description
 * @returns {Promise<{success: boolean, error_codes?: string[]}>}
 */
async function updateGoodsService(input) {
  const t = await sequelize.transaction();
  try {
    const goods = await Goods.findOne({
      where: {
        id: input.id,
        user_id: input.user_id,
      },
    });

    // Check if goods exist
    if (!goods) {
      return { success: false, error_codes: ERROR_CODES.GOODS_NOT_FOUND };
    }

    const inputUpdate = {
      quantity: input.quantity,
      price: input.price,
      description: input.description,
    };
    // sanitize input
    const sanitizeData = sanitizeUpdateData(inputUpdate, [
      "quantity",
      "price",
      "description",
    ]);
    // Check if there is nothing to update
    if (Object.keys(sanitizeData).length === 0) {
      return { success: true };
    }
    // Update goods
    await goods.update(sanitizeData, { transaction: t });
    await t.commit();
    return { success: true };
  } catch (error) {
    console.error("Error updating goods", error);
    await t.rollback();
    return { success: false, error_codes: ERROR_CODES.INTERNAL_SERVER_ERROR };
  }
}

export { createGoodsService, updateGoodsService };
