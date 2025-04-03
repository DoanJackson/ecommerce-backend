import { Op } from "sequelize";
import ERROR_CODES from "../constants/errorCodes.js";
import { GoodsDetailDTO } from "../dtos/goodsDetailDTO.js";
import { GoodsDTO } from "../dtos/goodsDTO.js";
import { Goods, Types, Users } from "../models/index.js";

/**
 * @param {Object} input
 * @param {number} input.page
 * @param {number} input.limit
 * @param {string} input.search
 * @param {Array[][]} input.sortType
 * @returns {Promise<{success: boolean, data: any[]}>}
 */
async function getGoodsService(input) {
  try {
    const goods = await Goods.findAndCountAll({
      where: { name: { [Op.iLike]: `%${input.search}%` } },
      include: [
        {
          model: Types,
          attributes: ["name"],
          through: { attributes: [] },
          as: "types",
        },
        {
          model: Users,
          attributes: ["id", "name", "name_shop"],
          as: "merchant",
        },
      ],
      limit: input.limit,
      offset: input.offset,
    });

    const formattedGoods = GoodsDTO.fromArray(goods.rows);
    return { success: true, data: formattedGoods };
  } catch (error) {
    console.error("Error getting goods", error);
    return { success: false, error_codes: ERROR_CODES.INTERNAL_SERVER_ERROR };
  }
}

/**
 * @param {string} id
 * @returns {Promise<{success: boolean, data: any}>}
 * @description Get detail goods by id
 */
async function getDetailGoodsService(id) {
  try {
    const result = await Goods.findOne({
      where: { id: id },
      include: [
        {
          model: Types,
          attributes: ["name"],
          through: { attributes: [] },
          as: "types",
        },
        {
          model: Users,
          attributes: ["id", "name", "name_shop"],
          as: "merchant",
        },
      ],
    });
    if (!result) {
      return { success: false, error_codes: ERROR_CODES.GOODS_NOT_FOUND };
    }
    const formattedGoods = new GoodsDetailDTO(result);
    return { success: true, data: formattedGoods };
  } catch (error) {
    console.error("Error getting goods", error);
    return { success: false, error_codes: ERROR_CODES.INTERNAL_SERVER_ERROR };
  }
}

export { getDetailGoodsService, getGoodsService };
