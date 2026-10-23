import { Request, Response } from "express";
import { catchAsyncError } from "../../Errors/catchAsyncError";
import { subjectService } from "./subjects.service";

const getAllSubjects = catchAsyncError(async (Request: Request, res: Response) => {

    const result = await subjectService.getAllSubjects();

    res.status(200).json({
        status_code: 200,
        success: true,
        message: "Subjects retrieved successfully",
        data: result
    });
});

const createSubject = catchAsyncError(async (req: Request, res: Response) => {

    const result = await subjectService.createSubject(req.body,req.file);

    res.status(201).json({
        status_code: 201,
        success: true,
        message: "Subject created successfully",
        data: result
    });

});

const updateSubjectByID = catchAsyncError(async (req: Request, res: Response) => {
    const { id } = req.params;

        console.log("Updated subject:", req.body);

    const result = await subjectService.updateSubjectByID(id as string, req.body , req.file);

    res.status(200).json({
        status_code: 200,
        success: true,
        message: "Subject updated successfully",
        data: result
    });

});
const deleteSubjectByID = catchAsyncError(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await subjectService.deleteSubjectByID(id as string);

    res.status(200).json({
        status_code: 200,
        success: true,
        message: "Subject deleted successfully",
        data: result
    });

});

const subjectStatusbyID = catchAsyncError(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.query;
    const statueBoolean = status === "true" ? true : false;

    const result = await subjectService.subjectStatusbyID(id as string, statueBoolean);
    res.status(200).json({
        status_code: 200,
        success: true,
        message: "Subject status updated successfully",
        data: result
    });
});




export const subjectController = {
    getAllSubjects,
    createSubject,
    updateSubjectByID,
    deleteSubjectByID,
    subjectStatusbyID


}