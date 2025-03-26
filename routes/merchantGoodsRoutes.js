import { Router } from "express";
import ROLES from "../constants/role.js";
import {
  createGoods,
  deleteGoods,
  getGoods,
  getGoodsDetail,
  getPresignedUrl,
  saveImage,
  updateGoods,
} from "../controllers/merchantGoodsController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { hasAnyRole, hasRole } from "../middleware/roleMiddleware.js";
import validate from "../middleware/validate.js";
import { validateUUID } from "../middleware/validateUUID.js";
import {
  goodsPresignedUrlSchema,
  goodsSaveImageSchema,
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

router.get("/", authenticateUser, hasRole(ROLES.MERCHANT), getGoods);

router.get(
  "/:id",
  authenticateUser,
  hasRole(ROLES.MERCHANT),
  validateUUID(["id"]),
  getGoodsDetail
);

router.patch(
  "/:id",
  authenticateUser,
  hasRole(ROLES.MERCHANT),
  validateUUID(["id"]),
  validate(goodsUpdateSchema),
  updateGoods
);

router.delete(
  "/:id",
  authenticateUser,
  hasRole(ROLES.MERCHANT),
  validateUUID(["id"]),
  deleteGoods
);

router.post(
  "/upload/presigned-url",
  authenticateUser,
  hasAnyRole([ROLES.CLIENT, ROLES.MERCHANT]),
  validate(goodsPresignedUrlSchema),
  getPresignedUrl
);

router.post(
  "/:goods_id/images",
  authenticateUser,
  hasRole(ROLES.MERCHANT),
  validateUUID(["goods_id"]),
  validate(goodsSaveImageSchema),
  saveImage
);

router.post("");

export default router;
