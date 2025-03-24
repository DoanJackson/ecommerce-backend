import { Router } from "express";
import ROLES from "../constants/role.js";
import {
  createGoods,
  updateGoods,
} from "../controllers/merchantGoodsController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { hasRole } from "../middleware/roleMiddleware.js";
import validate from "../middleware/validate.js";
import { validateUUID } from "../middleware/validateUUID.js";
import {
  goodsSchema,
  goodsUpdateSchema,
} from "../validations/goodsValidation.js";

const router = Router();

router.post(
  "/",
  authenticateUser,
  hasRole(ROLES.MERCHANT),
  validate(goodsSchema),
  createGoods
);

router.patch(
  "/:id",
  authenticateUser,
  hasRole(ROLES.MERCHANT),
  validateUUID(["id"]),
  validate(goodsUpdateSchema),
  updateGoods
);

export default router;
