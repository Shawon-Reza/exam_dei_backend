import { Router } from "express";
import { questionController } from "./question.controller";
import { zodValidationFN } from "../../middlewares/zodValidation";
import { createQuestionsSchema } from "./question.types";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { ROLE } from "../../generated/prisma/enums";

export const questionRouter = Router();

questionRouter.get("/", questionController.getQuestions);
questionRouter.get("/test_questions", questionController.test_questions);

questionRouter.post("/", authMiddleware([ROLE.ADMIN]), zodValidationFN(createQuestionsSchema), questionController.createQuestion);

questionRouter.post("/assign_question_to_test", questionController.assign_question_to_test);

questionRouter.delete("/:id", questionController.questionDeleteById);
questionRouter.put("/:id", questionController.questionUpdateById);



