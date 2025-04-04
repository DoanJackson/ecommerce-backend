import { Router } from "express";
import ROLES from "../constants/role.js";
import { getMerchantOrders } from "../controllers/merchantOrdersController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { hasRole } from "../middleware/roleMiddleware.js";

const router = Router();

router.get("/", authenticateUser, hasRole(ROLES.MERCHANT), getMerchantOrders);

export default router;
