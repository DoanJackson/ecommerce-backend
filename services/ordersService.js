import ERROR_CODES from "../constants/errorCodes.js";
import { Orders, sequelize } from "../models/index.js";
import { checkGoodsExists } from "./goodsService.js";

/**
 * @param {string} goods_id
 * @param {number} quantity
 * @returns {Promise<{success: boolean, data: any, error?: string}>}
 */
async function checkOrdersInputValid(goods_id, quantity) {
  try {
    const goods = await checkGoodsExists(goods_id);
    if (!goods.success) {
      return { success: false, error_codes: goods.error_codes };
    }
    // check if the quantity is enough (< quantity of goods)
    if (quantity > goods.data.quantity) {
      return { success: false, error_codes: ERROR_CODES.QUANTITY_NOT_ENOUGH };
    }
    return { success: true, data: goods.data };
  } catch (error) {
    console.error("Error creating orders", error);
    return { success: false, error_codes: ERROR_CODES.INTERNAL_SERVER_ERROR };
  }
}

/**
 * * @param {Object} input
 * @param {number} input.price
 * @param {number} input.quantity
 * @param {string} input.goods_id
 * @param {string} input.user_id
 * @param {string} input.city
 * @param {string} input.district
 * @param {string} input.address
 * @returns {Promise<{success: boolean, error_codes?: string}>}
 */
async function createOrdersService(input) {
  const { price, quantity, goods_id, user_id, city, district, address } = input;
  const t = await sequelize.transaction();
  try {
    const total_price = price * quantity;
    await Orders.create(
      {
        user_id: user_id,
        goods_id: goods_id,
        quantity: quantity,
        total_price: total_price,
        city: city,
        district: district,
        address: address,
      },
      { transaction: t }
    );
    await t.commit();
    return { success: true };
  } catch (error) {
    console.error("Error creating orders", error);
    await t.rollback();
    return { success: false, error_codes: ERROR_CODES.CANNOT_CREATE_ORDER };
  }
}
export { checkOrdersInputValid, createOrdersService };
