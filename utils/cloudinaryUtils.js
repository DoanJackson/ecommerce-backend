import cloudinary from "../config/cloudinary.js";
import ERROR_CODES from "../constants/errorCodes.js";

/**
 * @param {Object} params
 * @param {Number} params.timestamp
 * @param {String} params.folder
 * @param {String} params.preset
 * @returns {Promise<{success: Boolean, data?: Object, error_codes?: string[]}>}
 */
async function generatePresignedUrl(params) {
  try {
    const signature = cloudinary.utils.api_sign_request(
      params,
      cloudinary.config().api_secret
    );
    return {
      success: true,
      data: {
        url: `https://api.cloudinary.com/v1_1/${
          cloudinary.config().cloud_name
        }/image/upload`,
        signature,
        timestamp: params.timestamp,
        api_key: cloudinary.config().api_key,
        folder: params.folder,
        upload_preset: params.upload_preset,
      },
    };
  } catch (error) {
    console.error("Error in generate presigned url: ", error);
    return { success: false, error_codes: ERROR_CODES.EXTERNAL_SERVICE_ERROR };
  }
}

export { generatePresignedUrl };
