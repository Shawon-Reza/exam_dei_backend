import { Router } from "express";
import { noteController } from './note.controller';

export const noteRouter = Router();



noteRouter.get("/", noteController.getNote);
noteRouter.post("/", noteController.createNote);
noteRouter.patch("/", noteController.updateNoteById);

