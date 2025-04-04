import { Op } from "sequelize";
import ERROR_CODES from "../constants/errorCodes.js";
import { OrdersMerchantDTO } from "../dtos/ordersMerchantDTO.js";
import { Goods, Orders } from "../models/index.js";

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

export { getMerchantOrdersService };
