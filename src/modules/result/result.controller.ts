import { Request, Response } from "express";
import { catchAsyncError } from "../../Errors/catchAsyncError";
import { resultService } from "./result.service";


const createResult = catchAsyncError(async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await resultService.createResult(payload,req.user?.userId as string);

    res.status(200).json({
        success: true,
        message: "Result created successfully",
        data: result
    })
})

export const resultController = {
    createResult,
}