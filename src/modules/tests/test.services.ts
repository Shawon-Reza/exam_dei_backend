/* eslint-disable @typescript-eslint/no-unused-vars */
import { Prisma, TestStatus } from "../../generated/prisma/client"
import { prisma } from "../../lib/prisma"
import { CreateTestInput } from "./tests.zod"




const getTest = async (query: Record<string, unknown>) => {
    const { topicId, subjectId, status } = query

    console.log("id", topicId, subjectId, status)

    const where: Prisma.TestWhereInput = {};

    if (topicId) {
        where.topicId = topicId as string;
    }

    if (subjectId) {
        where.subjectId = subjectId as string;
    }

    if (status) {
        where.status = status as TestStatus;
    }


    const result = await prisma.test.findMany({
        where,
        include: {
            _count: {
                select: {
                    testQuestions: true
                }
            }
        }
    })
    if (result.length === 0) {
        throw new Error("Test not found")
    }
    return result
}

const createTest = async (payload: CreateTestInput) => {

    console.log("payload from createTest", payload)

    const result = await prisma.test.create({
        data: payload
    })

    return result
}


const deleteTrestByID = async (id: string) => {
    console.log("id from deleteTrestByID", id)
    const result = await prisma.test.delete({
        where: {
            id: id
        }
    })
    return result
}

const assignQuestionToTest = async (payload: Record<string, unknown>) => {
    console.log("Assign Question to Test Service Triggered")
    // Implement the logic to assign a question to a test
}

const updateTest = async (payload: CreateTestInput, id: string) => {
    console.log("payload from updateTest", payload)

    const result = await prisma.test.update({
        where: {
            id: id
        },
        data: payload
    })
    return result
}

export const testsService = {
    getTest,
    createTest,
    deleteTrestByID,
    assignQuestionToTest,
    updateTest
}
