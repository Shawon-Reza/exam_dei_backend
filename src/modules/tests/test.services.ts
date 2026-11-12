/* eslint-disable @typescript-eslint/no-unused-vars */
import { Prisma, TestStatus, TestType } from "../../generated/prisma/client"
import { prisma } from "../../lib/prisma"
import { CreateTestInput } from "./tests.zod"




const getTest = async (query: Record<string, unknown>) => {
    const { topicId, subjectId, status, search } = query

    console.log("id", topicId, subjectId, status, search)

    const where: Prisma.TestWhereInput = {};

    if (topicId) {
        where.topicId = topicId as string;
    }

    if (!topicId && !subjectId) {
        where.AND = [
            {
                topicId: null,
                subjectId: null
            }
        ];
    }

    if (subjectId && !topicId) {
        where.subjectId = subjectId as string;
        where.topicId = null;
    }

    if (search) {
        where.OR = [
            {
                name: { contains: search as string, mode: 'insensitive' }
            },
            {
                slug: { contains: search as string, mode: 'insensitive' }
            },
            {
                description: { contains: search as string, mode: 'insensitive' }
            },
        ];
    }

    if (subjectId) {
        where.subjectId = subjectId as string;
    }

    if (status) {
        where.status = status as TestStatus;
    }


    const result = await prisma.test.findMany({
        where
        ,
        include: {
            _count: {
                select: {
                    testQuestions: true,
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
        data: {
            name: payload.name,
            slug: payload.slug,
            description: payload.description,
            duration: payload.duration,
            totalQuestions: payload.totalQuestions,
            isActive: payload.isActive,
            status: payload.status,
            type: payload.type as TestType | undefined,
            topicId: payload.topicId,
            subjectId: payload.subjectId
        }

    
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



const updateTest = async (payload: CreateTestInput, id: string) => {
    console.log("payload from updateTest", payload)

    const result = await prisma.test.update({
        where: {
            id: id
        },
        data: {
            name: payload.name,
            slug: payload.slug,
            description: payload.description,
            duration: payload.duration,
            totalQuestions: payload.totalQuestions,
            isActive: payload.isActive,
            status: payload.status,
            type: payload.type as TestType | undefined,
            topicId: payload.topicId,
            subjectId: payload.subjectId
        }
    })
    return result
}

export const testsService = {
    getTest,
    createTest,
    deleteTrestByID,
    updateTest
}
