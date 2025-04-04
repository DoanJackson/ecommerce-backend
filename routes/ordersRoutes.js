import { Router } from "express";
import ROLES from "../constants/role.js";
import { createOrders } from "../controllers/ordersController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { hasRole } from "../middleware/roleMiddleware.js";
import validate from "../middleware/validate.js";
import { createOrdersSchema } from "../validations/ordersValidation.js";

const router = Router();

router.post(
  "/",
  authenticateUser,
  hasRole(ROLES.CLIENT),
  validate(createOrdersSchema),
  createOrders
);

export default router;
