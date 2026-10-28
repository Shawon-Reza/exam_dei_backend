import { Router } from "express";
import { authRoutes } from "../auth/auth.routes";
import { subjectsRouter } from "../subjects/subjects.router";
import { topicRouter } from "../topics/topics.router";
import { questionRouter } from "../questionOptions/question.router";
import { pdfRouter } from "../pdf/pdf.route";
import { testsRouter } from "../tests/test.route";
import { noteRouter } from "../notes/notes.router";
import { resultRouter } from "../result/result.router";


export const indexRoute = Router();


indexRoute.use("/auth", authRoutes);
indexRoute.use("/subjects", subjectsRouter);
indexRoute.use("/topics", topicRouter);
indexRoute.use("/questions", questionRouter);
indexRoute.use("/pdfs", pdfRouter);
indexRoute.use("/tests", testsRouter);
indexRoute.use("/notes", noteRouter);
indexRoute.use("/results", resultRouter);