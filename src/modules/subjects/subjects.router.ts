import { Router } from "express";
import { subjectController } from "./subjects.controller";
import { multerUploader } from "../../config/multer";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { ROLE } from "../../generated/prisma/enums";

export const subjectsRouter = Router();

subjectsRouter.get("/", authMiddleware([]), subjectController.getAllSubjects);

subjectsRouter.post("/", authMiddleware([ROLE.ADMIN]), multerUploader.single("file"), subjectController.createSubject);

subjectsRouter.put("/:id", authMiddleware([ROLE.ADMIN]), multerUploader.single("file"), subjectController.updateSubjectByID);

subjectsRouter.delete("/:id", authMiddleware([ROLE.ADMIN]), subjectController.deleteSubjectByID);
subjectsRouter.patch("/:id", authMiddleware([ROLE.ADMIN]), subjectController.subjectStatusbyID);
