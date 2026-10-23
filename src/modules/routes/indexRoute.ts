import { Router } from "express";
import { authRoutes } from "../auth/auth.routes";
import { subjectsRouter } from "../subjects/subjects.router";


export const indexRoute = Router();


indexRoute.use("/auth", authRoutes);
indexRoute.use("/subjects", subjectsRouter);