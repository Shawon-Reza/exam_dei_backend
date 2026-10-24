import { Router } from "express";
import { topicController } from "./topics.controller";
import { multerUploader } from "../../config/multer";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { ROLE } from "../../generated/prisma/enums";

export const topicRouter = Router();

topicRouter.get("/", authMiddleware([]),topicController.getAllTopics);

topicRouter.post("/", authMiddleware([ROLE.ADMIN]), multerUploader.single("icon"), topicController.createTopic);

topicRouter.put("/:id", authMiddleware([ROLE.ADMIN]), multerUploader.single("icon"), topicController.updateTopicById);

topicRouter.delete("/:id", authMiddleware([ROLE.ADMIN]), topicController.deleteTopicById);
