/* eslint-disable @typescript-eslint/no-unused-vars */
import { catchAsyncError } from "../../Errors/catchAsyncError"
import { questionService } from "./question.service"


const getQuestions = catchAsyncError(async (req, res) => {

    const result = await questionService.getQuestions(req.query)
    res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Questions fetched successfully",
        data: result
    })
})

const createQuestion = catchAsyncError(async (req, res) => {

    const result = await questionService.createQuestion(req.body)
    res.status(201).json({
        success: true,
        statusCode: 201,
        message: "Question created successfully",
        data: result
    })
})

const updateQuestionById = catchAsyncError(async (req, res) => {
    const { id } = req.params
    const result = await questionService.updateQuestionById(id as string, req.body)
    res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Question updated successfully",
        data: result
    })
})
const deleteQuestionById = catchAsyncError(async (req, res) => {
    const { id } = req.params
    const result = await questionService.deleteQuestionById(id as string)
    res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Question deleted successfully",
        data: result
    })
})

export const questionController = {
    getQuestions,
    createQuestion,
    updateQuestionById,
    deleteQuestionById

}