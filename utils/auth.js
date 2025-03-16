import bcrypt from "bcrypt";

/**
 *
 * @param {String} password
 * @param {String} hashedPassword
 * @returns {Boolean}
 */
function isValidPassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword, (err, result) => {
    if (err) {
      return false;
    }
    return result;
  });
}

export { isValidPassword };
