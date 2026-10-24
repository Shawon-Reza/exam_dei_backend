import { catchAsyncError } from "../../Errors/catchAsyncError"
import { pdfService } from "./pdf.services";

const getpdfs = catchAsyncError(async (req, res) => {

    const result = await pdfService.getpdfs(req.query)
    res.status(200).json({
        success: true,
        statusCode: 200,
        message: "PDFs fetched successfully",
        data: result

    });
})
const addPdf = catchAsyncError(async (req, res) => {
    const result = await pdfService.addPdf(req.body)
    res.status(201).json({
        success: true,
        statusCode: 201,
        message: "PDF added successfully",
        data: result
    });
});
const deletePdfById = catchAsyncError(async (req, res) => {
    const { id } = req.params
    const result = await pdfService.deletePdfById(id as string)
    res.status(200).json({
        success: true,
        statusCode: 200,
        message: "PDF deleted successfully",
        data: result
    })
});


export const pdfcontroller = {
    getpdfs,
    addPdf,
    deletePdfById,
}