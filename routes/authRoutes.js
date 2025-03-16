import { Router } from "express";
import { login, register } from "../controllers/authController.js";
import {
  googleAuth,
  googleAuthCallback,
} from "../controllers/googleAuthController.js";
import validate from "../middleware/validate.js";
import {
  loginUserSchema,
  registerUserSchema,
} from "../validations/userValidation.js";

const router = Router();

router.post("/register", validate(registerUserSchema), register);
router.post("/login", validate(loginUserSchema), login);
// Google OAuth
router.get("/google", googleAuth);
router.get("/google/callback", googleAuthCallback);

export default router;
