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
        prisma.topic.findMany(
            {
                where,
                include: {
                    _count: {
                        select: {
                            pdfs: true,
                            questions: true,
                            tests: true
                        }
                    }
                }
            }

        ),

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



const createTopic = async (
    payload: any,
    file?: Express.Multer.File
) => {
    console.log("req.body", payload);
    console.log("req.file", file);

    const slug = payload.slug
        ? payload.slug
        : slugify(payload.name);

    const sortOrder = Number(payload.sortOrder);

    if (!Number.isInteger(sortOrder)) {
        throw new Error("sortOrder must be an integer");
    }

    const isActive =
        payload.isActive === "true" ||
        payload.isActive === true;

    const result = await prisma.topic.create({
        data: {
            slug,
            subjectId: payload.subjectId,
            name: payload.name,
            banglaName: payload.banglaName,
            searchName: payload.searchName,
            description: payload.description,
            sortOrder,
            isActive,
            icon: file?.path ?? null,
        },
    });

    return result;
};


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
                sortOrder: parseInt(payload.sortOrder),
                isActive: payload.isActive == "true" || payload.isActive === true ? true : false,
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

const getTopicDeepDetails = async (topicID: string) => {
    console.log("Trying to fetch deep details for topicID:", topicID);
    const result = await prisma.topic.findUnique({
        where: {
            id: topicID
        },
        include: {
            _count: {
                select: {
                    pdfs: true
                }
            }
        }
    })
    return result
}



export const topicService = {
    getAllTopics,
    createTopic,
    updateTopicById,
    deleteTopicById,
    getTopicDeepDetails
}
