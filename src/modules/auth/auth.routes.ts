import { Router } from "express";
import { authControllers } from "./auth.controllers";
import { zodValidationFN } from "../middlewares/zodValidation";
import { loginSchema, registerSchema } from "./authSchema";

export const authRoutes = Router();



authRoutes.post("/login", zodValidationFN(loginSchema), authControllers.emailLogin);
authRoutes.post("/register", zodValidationFN(registerSchema), authControllers.emailRegister);

authRoutes.get("/google-login", authControllers.googleLogin);
authRoutes.post("/google-login", authControllers.googleLoginPost);

authRoutes.get("/google-login/success", authControllers.googleLoginSuccess);
authRoutes.post("/logout", authControllers.logout);
authRoutes.post("/otp-verification", authControllers.emailOTPVerification);
