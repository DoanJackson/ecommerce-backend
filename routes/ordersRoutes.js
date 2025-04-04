import { Router } from "express";
import ROLES from "../constants/role.js";
import {
  createOrders,
  deleteOrders,
  getOrders,
} from "../controllers/ordersController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { hasRole } from "../middleware/roleMiddleware.js";
import validate from "../middleware/validate.js";
import { validateUUID } from "../middleware/validateUUID.js";
import { createOrdersSchema } from "../validations/ordersValidation.js";

const router = Router();

router.post(
  "/",
  authenticateUser,
  hasRole(ROLES.CLIENT),
  validate(createOrdersSchema),
  createOrders
);

router.delete(
  "/:id",
  authenticateUser,
  hasRole(ROLES.CLIENT),
  validateUUID(["id"]),
  deleteOrders
);

router.get("/", authenticateUser, hasRole(ROLES.CLIENT), getOrders);

export default router;
