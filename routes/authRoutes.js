import { Router } from "express";
import { login, register } from "../controllers/authController.js";
import validate from "../middleware/validate.js";
import {
  loginUserSchema,
  registerUserSchema,
} from "../validations/userValidation.js";

const router = Router();

router.post("/register", validate(registerUserSchema), register);
router.post("/login", validate(loginUserSchema), login);
// router.post("auth/google", googleLogin);

export default router;
