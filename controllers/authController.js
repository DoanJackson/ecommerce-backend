import { StatusCodes } from "http-status-codes";
import ERROR_CODES from "../constants/errorCodes.js";
import Users from "../models/User.js";
import { errorResponse, successResponse } from "../utils/response.js";
import sequelize from "../config/database.js";
import Client from "../models/Client.js";

async function register(req, res) {
  const t = await sequelize.transaction();

  try {
    const { username, password, role } = req.body;

    // Create a user
    const user = await Users.create(
      {
        username,
        password,
        role,
      },
      { transaction: t }
    );

    // Create a client
    await Client.create(
      {
        id: user.id,
      },
      { transaction: t }
    );

    // Commit the transaction
    await t.commit();
    // Send the response
    res.json(
      successResponse(
        user.toJSON(),
        "User created successfully",
        StatusCodes.OK
      )
    );
  } catch (error) {
    // Rollback the transaction
    await t.rollback();
    // Send the error response
    const error_code = ERROR_CODES.USER_EXISTS;
    res.status(error_code.status).json(errorResponse(error_code));
  }
}
export { register };
