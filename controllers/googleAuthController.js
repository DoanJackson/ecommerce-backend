/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
function goolgeLogin(req, res) {
  res.status(200).json({ message: "Google login controller" });
}

export { goolgeLogin };
