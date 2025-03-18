import { Router } from "express";
import { becomeMerchant } from "../controllers/userController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = Router();

router.patch("/role/merchant", authenticateUser, becomeMerchant);

export default router;
