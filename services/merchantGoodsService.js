import { Op } from "sequelize";
import { getEnv } from "../config/env.js";
import ERROR_CODES from "../constants/errorCodes.js";
import { GoodsMerchantDTO } from "../dtos/goodsMerchantDTO.js";
import { Goods, Images, sequelize, Types } from "../models/index.js";
import { generatePresignedUrl } from "../utils/cloudinaryUtils.js";
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
 * @param {string} input.user_id
 * @param {number} input.page
 * @param {number} input.limit
 * @param {number} input.offset
 * @param {string} input.search
 * @param {string} input.sortType
 * @returns {Promise<{success: boolean, data?: Object, error_codes?: string[]}>}
 */
async function getGoodsService(input) {
  try {
    const goods = await Goods.findAndCountAll({
      where: {
        user_id: input.user_id,
        name: {
          [Op.iLike]: `%${input.search}%`,
        },
      },
      include: [
        {
          model: Types,
          attributes: ["name"],
          through: { attributes: [] },
          as: "types",
        },
      ],
      limit: input.limit,
      offset: input.offset,
      order: input.sortType,
    });
    const formattedGoods = GoodsMerchantDTO.fromArray(goods.rows);
    return { success: true, data: formattedGoods };
  } catch (error) {
    console.error("Error getting goods", error);
    return { success: false, error_codes: ERROR_CODES.INTERNAL_SERVER_ERROR };
  }
}

/**
 * @param {Object} input
 * @param {string} input.id
 * @param {string} input.user_id
 * @returns {Promise<{success: boolean, data?: Object, error_codes?: string[]}>}
 */
async function getGoodsDetailService(input) {
  try {
    // Get goods detail
    const goods = await Goods.findOne({
      where: {
        id: input.id,
        user_id: input.user_id,
      },
      include: [
        {
          model: Types,
          attributes: ["name"],
          through: { attributes: [] },
          as: "types",
        },
      ],
    });
    // Check if goods exist
    if (!goods) {
      return { success: false, error_codes: ERROR_CODES.GOODS_NOT_FOUND };
    }
    // Format goods detail
    const formattedGoods = new GoodsMerchantDTO(goods);
    // Return goods detail
    return { success: true, data: formattedGoods };
  } catch (error) {
    console.error("Error getting goods detail", error);
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

/**
 * @param {Object} input
 * @param {string} input.id
 * @param {string} input.user_id
 * @returns {Promise<{success: boolean, error_codes?: string[]}>}
 */
async function deleteGoodsService(input) {
  const t = await sequelize.transaction();
  try {
    const goods = await Goods.findOne({
      where: {
        id: input.id,
        user_id: input.user_id,
      },
      transaction: t,
    });
    if (!goods) {
      return { success: false, error_codes: ERROR_CODES.GOODS_NOT_FOUND };
    }
    await goods.destroy({ transaction: t });
    await t.commit();
    return { success: true };
  } catch (error) {
    console.error("Error deleting goods", error);
    await t.rollback();
    return { success: false, error_codes: ERROR_CODES.INTERNAL_SERVER_ERROR };
  }
}

/**
 * @param {String} type
 * @param {String} id_product
 * @param {String} user_id
 * @param {Number} file_count
 * @returns {Promise<{success: Boolean, data?: Array<Object>, error_codes?: String}>}
 */
async function getPresignedUrlService(id_product, user_id, file_count) {
  try {
    // logic xu ly file_count de sau
    // generate presigned url
    const params = {
      timestamp: Math.round(new Date().getTime() / 1000),
      folder: `images/shops/${user_id}/products/${id_product}`,
      upload_preset: getEnv("CLOUDINARY_PRESET_GOODS"),
    };
    const signature = await generatePresignedUrl(params);
    if (!signature.success) {
      return { success: false, error_codes: signature.error_codes };
    }
    return {
      success: true,
      data: signature.data,
    };
  } catch (error) {
    console.error("Error in getPresignedUrlService: ", error);
    return { success: false, error_codes: ERROR_CODES.EXTERNAL_SERVICE_ERROR };
  }
}

/**
 * @param {string} goods_id
 * @param {string} user_id
 * @param {Array<Object>} images
 * @returns {Promise<{success: boolean, error_codes?: string[]}>}
 */
async function saveImageService(goods_id, images) {
  const t = await sequelize.transaction();
  try {
    // save image data to database
    await Images.bulkCreate(
      images.map((img) => ({
        public_id: img.public_id,
        secure_url: img.secure_url,
        goods_id: goods_id,
      })),
      { returning: true, transaction: t }
    );
    await t.commit();
    return { success: true };
  } catch (error) {
    await t.rollback();
    console.error("Error saving image data", error);
    return { success: false, error_codes: ERROR_CODES.INTERNAL_SERVER_ERROR };
  }
}

/**
 * @param {string} goods_id
 * @param {string} user_id
 * @returns {Promise<{success: boolean, error_codes?: string[]}>}
 */
async function checkGoodsOwnership(goods_id, user_id) {
  try {
    const result = await Goods.findOne({
      where: {
        id: goods_id,
      },
    });
    if (!result) {
      return { success: false, error_codes: ERROR_CODES.GOODS_NOT_FOUND };
    } else if (result.user_id !== user_id) {
      return { success: false, error_codes: ERROR_CODES.UNAUTHORIZED };
    }
    return { success: true };
  } catch (error) {
    console.error("Error checking goods ownership", error);
    return { success: false, error_codes: ERROR_CODES.INTERNAL_SERVER_ERROR };
  }
}

export {
  checkGoodsOwnership,
  createGoodsService,
  deleteGoodsService,
  getGoodsDetailService,
  getGoodsService,
  getPresignedUrlService,
  saveImageService,
  updateGoodsService,
};
