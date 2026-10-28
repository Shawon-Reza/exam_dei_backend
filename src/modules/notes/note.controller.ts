import { Request, Response } from "express"
import { catchAsyncError } from "../../Errors/catchAsyncError"
import { noteService } from "./node.service"


const getNote = catchAsyncError(async (req: Request, res: Response) => {
    const { topicID } = req.query

    const result = await noteService.getNote(topicID as string)
    res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Note fetched successfully",
        data: result

    })
})

const createNote = catchAsyncError(async (req: Request, res: Response) => {
    const payload = req.body

    const result = await noteService.createNote(payload)

    res.status(201).json({
        success: true,
        statusCode: 201,
        message: "Note created successfully",
        data: result
    })

})
const updateNoteById = catchAsyncError(async (req: Request, res: Response) => {
const result = await noteService.updateNoteById(req.body)
    res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Note updated successfully",
        data: result
    })

})


export const noteController = {
    getNote,
    createNote,
    updateNoteById,
}