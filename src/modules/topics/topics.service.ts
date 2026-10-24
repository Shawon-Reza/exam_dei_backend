/* eslint-disable @typescript-eslint/no-explicit-any */
import { cloudinaryDeleteByUrl } from "../../config/multer"
import { slugify } from "../../config/slugify"
import { Prisma } from "../../generated/prisma/client"
import { prisma } from "../../lib/prisma"



const getAllTopics = async (query: any) => {

    const { search, subjectId } = query

    console.log("search", search)

    const where: Prisma.TopicWhereInput = {};

    const tsubjectexistance = await prisma.subject.findUnique({
        where: {
            id: subjectId
        }
    })

    if (!tsubjectexistance) {
        throw new Error("Subject not found")
    }

    if (subjectId) {
        where.subjectId = subjectId
    }


    if (search) {
        where.OR = [
            {
                name: {
                    contains: search,
                    mode: "insensitive"
                }
            },
            {
                slug: {
                    contains: search,
                    mode: "insensitive"
                }
            },
            {
                description: {
                    contains: search,
                    mode: "insensitive"
                }
            },
            {
                searchName: {
                    contains: search,
                    mode: "insensitive"
                }
            }

        ]
    }


    const [resut, totalCount] = await prisma.$transaction([
        prisma.topic.findMany({
            where,
        }),
        prisma.topic.count(
            {
                where
            }
        )

    ])

    return {
        data: resut,
        totalCount: totalCount
    }
}

const createTopic = async (payload: any, file: Express.Multer.File) => {
    console.log("req.body", payload)
    console.log("req.file", file)

    const slug = payload.slug ? payload.slug : slugify(payload.name)


    const result = await prisma.topic.create({
        data: {
            slug: slug,
            subjectId: payload.subjectId,
            name: payload.name,
            banglaName: payload.banglaName,
            searchName: payload.searchName,
            description: payload.description,
            sortOrder: payload.sortOrder,
            isActive: payload.isActive,
            icon: file?.path
        }
    })
    return result
}

const updateTopicById = async (id: string, payload: any, file: Express.Multer.File) => {

    try {
        console.log("req.body", payload)
        console.log("req.file", file)
        const slug = payload.slug ? payload.slug : slugify(payload.name)

        const result = await prisma.topic.update({
            where: {
                id
            },
            data: {
                slug: slug,
                subjectId: payload.subjectId,
                name: payload.name,
                banglaName: payload.banglaName,
                searchName: payload.searchName,
                description: payload.description,
                sortOrder: payload.sortOrder,
                isActive: payload.isActive,
                icon: file?.path
            }
        })
        return result
    } catch (error) {
        await cloudinaryDeleteByUrl(file?.path as string)
        throw error
    }
}
const deleteTopicById = async (id: string) => {
    const result = await prisma.topic.delete({
        where: {
            id
        }
    })
    return result
}





export const topicService = {
    getAllTopics,
    createTopic,
    updateTopicById,
    deleteTopicById,
}
