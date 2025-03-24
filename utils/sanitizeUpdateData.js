/**
 *
 * @param {Object} input
 * @param {Array} allowedFields
 * @returns {Object}
 */
function sanitizeUpdateData(input, allowedFields) {
  return Object.keys(input).reduce((acc, key) => {
    if (
      allowedFields.includes(key) &&
      input[key] !== undefined &&
      input[key] !== null
    ) {
      acc[key] = input[key];
    }
    return acc;
  }, {});
}

export { sanitizeUpdateData };
