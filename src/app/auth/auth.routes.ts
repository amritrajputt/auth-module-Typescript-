import { AuthController } from "./auth.controller.js";
import type { Router } from "express";
import express from "express";
import { RegisterDto } from "./dto/register.dto.js";
import { validate } from "../common/middleware/validate.middleware.js";
import { LoginDto } from "./dto/login.dto.js";

const auth = new AuthController();
export const router: Router = express.Router();

router.post('/register', validate(RegisterDto), auth.register);
router.post('/login', validate(LoginDto), auth.login);

export default router;