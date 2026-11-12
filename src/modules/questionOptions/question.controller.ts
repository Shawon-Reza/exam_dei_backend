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



const assign_question_to_test = catchAsyncError(async (req, res) => {

    const result = await questionService.assign_question_to_test(req.body)

    res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Question assigned to test successfully",
        data: result
    })
})



const test_questions = catchAsyncError(async (req, res) => {
    const result = await questionService.test_questions(req.query)
    res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Questions fetched successfully",
        data: result
    })
})

const questionDeleteById = catchAsyncError(async (req, res) => {
    const { id } = req.params;
    console.log("From controller questionDeleteById", id);
    const result = await questionService.questionDeleteById(id as string);
    res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Question deleted successfully",
        data: result
    })
})

const questionUpdateById = catchAsyncError(async (req, res) => {
    const { id } = req.params;
    const result = await questionService.questionUpdateById(id as string, req.body);
    res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Question updated successfully",
        data: result
    })
})

export const questionController = {
    getQuestions,
    test_questions,
    questionDeleteById,
    questionUpdateById,
    createQuestion,
    assign_question_to_test


}