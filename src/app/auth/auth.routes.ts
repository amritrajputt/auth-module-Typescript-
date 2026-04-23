import { AuthController } from "./auth.controller.js";
import type { Router } from "express";
import express from "express";
import { RegisterDto } from "./dto/register.dto.js";
import { validate } from "../common/middleware/validate.middleware.js";
import { LoginDto } from "./dto/login.dto.js";
import { VerifyEmailDto } from "./dto/verifyEmail.dto.js";
import { regenerateAccessTokenDto } from "./dto/regenerateAccessTokendto.js";

const auth = new AuthController();
export const router: Router = express.Router();

router.post('/register', validate(RegisterDto), auth.register);
router.post('/login', validate(LoginDto), auth.login);
router.post('/verify-email', validate(VerifyEmailDto), auth.verifyEmail);
router.post('/refresh-token', validate(regenerateAccessTokenDto), auth.refreshAccessToken);
export default router;