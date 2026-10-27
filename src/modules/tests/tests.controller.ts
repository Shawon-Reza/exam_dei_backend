/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express"
import { catchAsyncError } from "../../Errors/catchAsyncError"
import { testsService } from "./test.services"


const getTest = catchAsyncError(async (req: Request, res: Response) => {
    console.log("Get Test Controller Triggered")
    const { topicId } = req.query

    const result = await testsService.getTest(topicId as string)

    return res.status(200).json({
        status: 200,
        success: true,
        message: "Test fetched successfully",
        data: result
    })
})
const createTest = catchAsyncError(async (req: Request, res: Response) => {

    const result = await testsService.createTest(req.body)
    res.status(200).json({
        status: 200,
        success: true,
        message: "Test created successfully",
        data: result
    })

})

const deleteTrestByID = catchAsyncError(async (req: Request, res: Response) => {
    const { id } = req.params

    const result = await testsService.deleteTrestByID(id as any)
    res.status(200).json({
        status: 200,
        success: true,
        message: "Test deleted successfully",
        data: result
    })
})

const assignQuestionToTest = catchAsyncError(async (req: Request, res: Response) => {
    console.log("Assign Question to Test Controller Triggered")
    const result = await testsService.assignQuestionToTest(req.body)

    res.status(200).json({
        status: 200,
        success: true,
        message: "Question assigned to test successfully",
        data: result
    })
})

const updateTest = catchAsyncError(async (req: Request, res: Response) => {
    const result = await testsService.updateTest(req.body, req.params.id as string)
    res.status(200).json({
        status: 200,
        success: true,
        message: "Test updated successfully",
        data: result
    })

})

export const testsController = {
    getTest,
    createTest,
    deleteTrestByID,
    assignQuestionToTest,
    updateTest
}