import { Router } from "express";
import { subjectController } from "./subjects.controller";
import { multerUploader } from "../../config/multer";

export const subjectsRouter = Router();

subjectsRouter.get("/", subjectController.getAllSubjects);

subjectsRouter.post("/",multerUploader.single("file"), subjectController.createSubject);

subjectsRouter.put("/:id",multerUploader.single("file") ,subjectController.updateSubjectByID);

subjectsRouter.delete("/:id", subjectController.deleteSubjectByID);
subjectsRouter.patch("/:id", subjectController.subjectStatusbyID);
