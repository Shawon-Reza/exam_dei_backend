import { Router } from "express";
import { topicController } from "./topics.controller";
import { multerUploader } from "../../config/multer";

export const topicRouter = Router();

topicRouter.get("/", topicController.getAllTopics);

topicRouter.post("/", multerUploader.single("icon"), topicController.createTopic);

topicRouter.put("/:id", multerUploader.single("icon"), topicController.updateTopicById);

topicRouter.delete("/:id", topicController.deleteTopicById);
