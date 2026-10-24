import { Request, Response } from "express"
import { catchAsyncError } from "../../Errors/catchAsyncError"
import { topicService } from "./topics.service"

export const getAllTopics = catchAsyncError(async (req: Request, res: Response) => {
    const topics = await topicService.getAllTopics(req.query)

    res.status(200).json({
        success: true,
        statusCode: 200,
        message: "All topics fetched successfully",
        data: topics
    })
})

export const createTopic = catchAsyncError(async (req: Request, res: Response) => {


    const result = await topicService.createTopic(req.body, req.file as Express.Multer.File)
    res.status(201).json({
        success: true,
        statusCode: 201,
        message: "Topic created successfully",
        data: result
    })
})
export const updateTopicById = catchAsyncError(async (req: Request, res: Response) => {

    const { id } = req.params
    const result = await topicService.updateTopicById(id as string, req.body, req.file as Express.Multer.File)
    res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Topic updated successfully",
        data: result
    })

})

export const deleteTopicById = catchAsyncError(async (req: Request, res: Response) => {
    const { id } = req.params
    const result = await topicService.deleteTopicById(id as string)
    res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Topic deleted successfully",
        data: result
    })
})





export const topicController = {
    getAllTopics,
    createTopic,
    updateTopicById,
    deleteTopicById,
}