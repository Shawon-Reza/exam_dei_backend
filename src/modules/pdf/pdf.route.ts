import { Router } from "express";
import { pdfcontroller } from "./pdf.controller";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { ROLE } from "../../generated/prisma/enums";

export const pdfRouter = Router();

pdfRouter.get("/", authMiddleware([]), pdfcontroller.getpdfs);
pdfRouter.post("/", authMiddleware([ROLE.ADMIN]), pdfcontroller.addPdf);

pdfRouter.delete("/:id", authMiddleware([ROLE.ADMIN]), pdfcontroller.deletePdfById);