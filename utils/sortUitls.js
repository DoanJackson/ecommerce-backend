/**
 * @param {string[]} listAttribute
 * @param {string} sortType
 * @returns {string[][]}
 */
function getSortType(listAttribute, sortType) {
  const part = sortType.split("_");
  if (part.length < 2) return [[listAttribute[0], "ASC"]];
  const field = part.slice(0, -1).join("_");
  const order = part[part.length - 1].toUpperCase();

  if (order !== "ASC" && order !== "DESC") return [[listAttribute[0], "ASC"]];
  if (!listAttribute.includes(field)) return [[listAttribute[0], "ASC"]];
  return [[field, order]];
}

export { getSortType };
