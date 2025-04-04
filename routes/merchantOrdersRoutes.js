import { Router } from "express";
import ROLES from "../constants/role.js";
import {
  getMerchantOrders,
  updateOrderStatus,
} from "../controllers/merchantOrdersController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { hasRole } from "../middleware/roleMiddleware.js";
import validate from "../middleware/validate.js";
import { validateUUID } from "../middleware/validateUUID.js";
import { updateOrdersSchema } from "../validations/ordersValidation.js";

const router = Router();

router.get("/", authenticateUser, hasRole(ROLES.MERCHANT), getMerchantOrders);
router.patch(
  "/:id",
  authenticateUser,
  hasRole(ROLES.MERCHANT),
  validateUUID(["id"]),
  validate(updateOrdersSchema),
  updateOrderStatus
);

export default router;
