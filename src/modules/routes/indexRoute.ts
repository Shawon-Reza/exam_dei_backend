import { Router } from "express";
import { authRoutes } from "../auth/auth.routes";
import { subjectsRouter } from "../subjects/subjects.router";
import { topicRouter } from "../topics/topics.router";


export const indexRoute = Router();


indexRoute.use("/auth", authRoutes);
indexRoute.use("/subjects", subjectsRouter);
indexRoute.use("/topics", topicRouter);