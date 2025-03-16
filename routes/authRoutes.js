import { Router } from "express";
import { login, register } from "../controllers/authController.js";
import { goolgeLogin } from "../controllers/googleAuthController.js";
import validate from "../middleware/validate.js";
import {
  loginUserSchema,
  registerUserSchema,
} from "../validations/userValidation.js";

const router = Router();

router.post("/register", validate(registerUserSchema), register);
router.post("/login", validate(loginUserSchema), login);
router.post("/google", goolgeLogin);

export default router;
