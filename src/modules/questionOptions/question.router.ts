import { Router } from "express";
import { questionController } from "./question.controller";
import { zodValidationFN } from "../../middlewares/zodValidation";
import { createQuestionsSchema } from "./question.types";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { ROLE } from "../../generated/prisma/enums";

export const questionRouter = Router();

questionRouter.get("/", authMiddleware([]), questionController.getQuestions);

questionRouter.post("/",authMiddleware([ROLE.ADMIN]), zodValidationFN(createQuestionsSchema), questionController.createQuestion);



questionRouter.put("/:id",authMiddleware([ROLE.ADMIN]), questionController.updateQuestionById);

questionRouter.delete("/:id",authMiddleware([ROLE.ADMIN]), questionController.deleteQuestionById);