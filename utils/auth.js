import bcrypt from "bcrypt";

/**
 *
 * @param {String} password
 * @param {String} hashedPassword
 * @returns {Boolean}
 */
async function isValidPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

export { isValidPassword };
