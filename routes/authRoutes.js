import { Router } from "express";
import {
  login,
  logout,
  refreshToken,
  register,
} from "../controllers/authController.js";
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
router.delete("/logout", logout);
router.post("/refresh-token", refreshToken);
// Google OAuth
router.get("/google", googleAuth);
router.get("/google/callback", googleAuthCallback);

export default router;
