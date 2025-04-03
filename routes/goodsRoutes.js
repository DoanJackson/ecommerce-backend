import { Router } from "express";
import { getDetailGoods, getGoods } from "../controllers/goodsController.js";
import { validateUUID } from "../middleware/validateUUID.js";

const router = Router();

router.get("/", getGoods);
router.get("/:id", validateUUID(["id"]), getDetailGoods);

export default router;
