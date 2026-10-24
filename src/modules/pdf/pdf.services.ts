/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "../../lib/prisma"

/* eslint-disable @typescript-eslint/no-unused-vars */
const getpdfs = async (query) => {


}
const addPdf = async (payload:any) => {
    const result = await prisma.pdf.create({
        data: payload
    })
    return result

}
const deletePdfById = async (id: string) => {

}

export const pdfService = {
    getpdfs,
    addPdf,
    deletePdfById,
}