import { Router } from "express";
import { testsController } from "./tests.controller";
import { createTestSchema } from "./tests.zod";
import { zodValidationFN } from "../../middlewares/zodValidation";

export const testsRouter= Router()


testsRouter.get("/",testsController.getTest)

testsRouter.post("/", zodValidationFN(createTestSchema),testsController.createTest)
testsRouter.patch("/:id", zodValidationFN(createTestSchema),testsController.updateTest)

testsRouter.delete("/:id",testsController.deleteTrestByID)

testsRouter.post("/question_assign",testsController.assignQuestionToTest)
