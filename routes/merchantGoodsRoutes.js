import { Router } from "express";
import ROLES from "../constants/role.js";
import { createGoods } from "../controllers/merchantGoodsController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { hasRole } from "../middleware/roleMiddleware.js";
import validate from "../middleware/validate.js";
import { goodsSchema } from "../validations/goodsValidation.js";

const router = Router();

router.post(
  "/",
  authenticateUser,
  hasRole(ROLES.MERCHANT),
  validate(goodsSchema),
  createGoods
);

export default router;
