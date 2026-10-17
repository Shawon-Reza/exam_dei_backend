import { Router } from "express";
import { authRoutes } from "../auth/auth.routes";


export const indexRoute = Router();



indexRoute.use("/auth", authRoutes);