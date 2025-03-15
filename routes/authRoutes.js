import { Router } from "express";
import { register } from "../controllers/authController.js";
import { validateRegisterUser } from "../validations/userValidation.js";

const router = Router();

router.post("/register", validateRegisterUser, register);

export default router;
