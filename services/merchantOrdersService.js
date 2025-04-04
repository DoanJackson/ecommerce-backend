import { Op } from "sequelize";
import ERROR_CODES from "../constants/errorCodes.js";
import { OrdersMerchantDTO } from "../dtos/ordersMerchantDTO.js";
import { Goods, Orders, sequelize } from "../models/index.js";

/**
 * @param {Object} input
 * @param {number} input.page
 * @param {number} input.limit
 * @param {string} input.search
 * @param {string} input.sortType
 * @param {string} input.user_id
 * @returns {Promise<{success: boolean, data?: any, error_codes?: string}>}
 */
async function getMerchantOrdersService(input) {
  try {
    const { page, limit, search, sortType, user_id } = input;
    const merchantOrders = await Orders.findAll({
      include: [
        {
          model: Goods,
          as: "goods",
          attributes: ["id", "user_id", "name"],
          where: {
            user_id: user_id,
            name: { [Op.iLike]: `%${search}%` },
          },
        },
      ],
      attributes: [
        "id",
        "user_id",
        "quantity",
        "total_price",
        "status",
        "created_at",
      ],
      order: sortType,
      limit: limit,
      offset: (page - 1) * limit,
    });
    const formattedMerchantOrders = OrdersMerchantDTO.fromArray(merchantOrders);
    return { success: true, data: formattedMerchantOrders };
  } catch (error) {
    console.error("Error getting merchant orders", error);
    return {
      success: false,
      error_codes: ERROR_CODES.RETRIEVE_MERCHANT_ORDERS_FAILED,
    };
  }
}

/**
 * @param {string} order_id
 * @param {string} user_id
 * @returns {Promise<{success: boolean, data?: any, error_codes?: string}>}
 */
async function checkMerchantOrderOwnership(order_id, user_id) {
  try {
    const orders = await Orders.findOne({
      where: {
        id: order_id,
      },
      include: [{ model: Goods, as: "goods", attributes: ["user_id"] }],
    });
    if (!orders) {
      return { success: false, error_codes: ERROR_CODES.ORDER_NOT_FOUND };
    }
    if (orders.goods.user_id !== user_id) {
      return { success: false, error_codes: ERROR_CODES.FORBIDDEN };
    }
    return { success: true, data: orders };
  } catch (error) {
    console.error("Error checking merchant order ownership", error);
    return {
      success: false,
      error_codes: ERROR_CODES.INTERNAL_SERVER_ERROR,
    };
  }
}

/**
 * @param {string} order_id
 * @param {string} status
 * @returns {Promise<{success: boolean, data?: any, error_codes?: string}>}
 */
async function updateOrderStatusService(order_id, status) {
  const t = await sequelize.transaction();
  try {
    const orders = await Orders.update(
      { status: status },
      { where: { id: order_id }, transaction: t, returning: true }
    );

    if (!orders[0]) {
      await t.rollback();
      return { success: false, error_codes: ERROR_CODES.ORDER_NOT_FOUND };
    }
    await t.commit();
    return { success: true, data: orders[1][0].dataValues };
  } catch (error) {
    await t.rollback();
    console.error("Error updating order status", error);
    return {
      success: false,
      error_codes: ERROR_CODES.UPDATE_ORDER_STATUS_FAILED,
    };
  }
}

export {
  checkMerchantOrderOwnership,
  getMerchantOrdersService,
  updateOrderStatusService,
};
