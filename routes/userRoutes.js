import { Router } from "express";
import ROLES from "../constants/role.js";
import { becomeMerchant } from "../controllers/userController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { hasRole, notHasRole } from "../middleware/roleMiddleware.js";

const router = Router();

router.patch(
  "/role/merchant",
  authenticateUser,
  hasRole(ROLES.CLIENT),
  notHasRole(ROLES.MERCHANT),
  becomeMerchant
);

export default router;
