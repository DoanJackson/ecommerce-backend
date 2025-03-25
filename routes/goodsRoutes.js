import { Router } from "express";
import { getGoods } from "../controllers/goodsController.js";

const router = Router();

router.get("/", getGoods);

export default router;
