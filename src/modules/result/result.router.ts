import { Router } from "express";
import { resultController } from "./result.controller";
import { authMiddleware } from "../../middlewares/authMiddleware";


export const resultRouter = Router()

resultRouter.post('/', authMiddleware([]),resultController.createResult)




