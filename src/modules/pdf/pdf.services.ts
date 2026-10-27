/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "../../lib/prisma"

/* eslint-disable @typescript-eslint/no-unused-vars */
const getpdfs = async (query: any) => {

    const { topicId } = query
    console.log(topicId)

    const topicExistance = await prisma.topic.findUnique({
        where: {
            id: topicId
        }
    })
    console.log(topicExistance)
    if (!topicExistance) {
        throw new Error("Topic not found!");
    }

    const [result, count] = await prisma.$transaction([
        prisma.pdf.findMany({
            where: {
                topicId
            }
        }),
        prisma.pdf.count({
            where: {
                topicId
            }
        })
    ])

    return {
        result,
        count
    }
}

const addPdf = async (payload: any) => {
    const result = await prisma.pdf.create({
        data: payload
    })
    return result

}
const deletePdfById = async (id: string) => {
    const result = await prisma.pdf.delete({
        where: {
            id
        }
    })
    return result
}

export const pdfService = {
    getpdfs,
    addPdf,
    deletePdfById,
}