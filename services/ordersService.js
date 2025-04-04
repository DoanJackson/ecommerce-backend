import { Op } from "sequelize";
import ERROR_CODES from "../constants/errorCodes.js";
import { OrdersDTO } from "../dtos/ordersDTO.js";
import { Goods, Orders, sequelize, Users } from "../models/index.js";
import { checkGoodsExists } from "./goodsService.js";

/**
 * @param {string} goods_id
 * @param {number} quantity
 * @returns {Promise<{success: boolean, data: any, error?: string}>}
 */
async function checkOrdersInputValid(goods_id, quantity, user_id) {
  try {
    const goods = await checkGoodsExists(goods_id);
    if (!goods.success) {
      return { success: false, error_codes: goods.error_codes };
    }
    // check if user is merchant and goods is not his
    if (goods.data.user_id === user_id) {
      return {
        success: false,
        error_codes: ERROR_CODES.MERCHANT_BUY_OWN_PRODUCT,
      };
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

/**
 * @param {string} orders_id
 * @returns {Promise<{success: boolean, data?: any, error_codes?: string}>}
 */
async function checkOrdersExists(orders_id) {
  try {
    const orders = await Orders.findOne({
      where: {
        id: orders_id,
      },
    });
    if (!orders) {
      return { success: false, error_codes: ERROR_CODES.ORDER_NOT_FOUND };
    }
    return { success: true, data: orders };
  } catch (error) {
    console.error("Error checking orders", error);
    return { success: false, error_codes: ERROR_CODES.INTERNAL_SERVER_ERROR };
  }
}

/**
 * @param {string} orders_id
 * @param {string} user_id
 * @returns {Promise<{success: boolean, error_codes?: string}>}
 */
async function deleteOrdersService(orders_id, user_id) {
  const t = await sequelize.transaction();
  try {
    await Orders.destroy({
      where: {
        id: orders_id,
        user_id: user_id,
      },
      transaction: t,
    });
    await t.commit();
    return { success: true };
  } catch (error) {
    console.error("Error deleting orders", error);
    await t.rollback();
    return { success: false, error_codes: ERROR_CODES.ORDER_NOT_FOUND };
  }
}

/**
 * @param {Object} input
 * @param {number} input.page
 * @param {number} input.limit
 * @param {string} input.search
 * @param {string} input.sortType
 * @param {string} input.user_id
 * @returns {Promise<{success: boolean, data?: any, error_codes?: string}>}
 */
async function getOrdersService(input) {
  try {
    const { page, limit, search, sortType, user_id } = input;
    const orders = await Orders.findAll({
      where: { user_id: user_id },
      include: [
        {
          model: Goods,
          as: "goods",
          attributes: ["id", "name"],
          include: [
            {
              model: Users,
              as: "merchant",
              attributes: ["id", "name_shop"],
            },
          ],
          where: {
            name: { [Op.iLike]: `%${search}%` },
          },
        },
      ],
      attributes: ["id", "quantity", "total_price", "status", "created_at"],
      order: sortType,
      limit: limit,
      offset: (page - 1) * limit,
    });
    const formattedOrders = OrdersDTO.fromArray(orders);
    return { success: true, data: formattedOrders };
  } catch (error) {
    console.error("Error getting orders", error);
    return { success: false, error_codes: ERROR_CODES.RETRIEVE_ORDER_FAILED };
  }
}

export {
  checkOrdersExists,
  checkOrdersInputValid,
  createOrdersService,
  deleteOrdersService,
  getOrdersService,
};
