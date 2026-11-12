/* eslint-disable @typescript-eslint/no-explicit-any */

import { prisma } from "../../lib/prisma";
import { Prisma } from "../../generated/prisma/client";
import { CreateQuestionsInput } from "./question.types";

const getQuestions = async (query: any) => {
    const {
        topicID,
        subjectID,
        limit = 100,
        page = 1,
        search,
        testID,
    } = query;

    const take = Math.max(1, Number(limit) || 100);
    const currentPage = Math.max(1, Number(page) || 1);
    const skip = (currentPage - 1) * take;

    const where: Prisma.QuestionWhereInput = {
        isActive: true,
    };

    if (topicID) {
        where.topicId = topicID;
    }
    if (subjectID) {
        where.subjectId = subjectID;
    }
    if (testID) {
        where.testId = testID;
    }

    if (search?.trim()) {
        where.OR = [
            { question: { contains: search.trim(), mode: "insensitive" } },
            { banglaQuestion: { contains: search.trim(), mode: "insensitive" } },
            { explanation: { contains: search.trim(), mode: "insensitive" } },
            { banglaExplanation: { contains: search.trim(), mode: "insensitive" } },
        ];
    }

    const [questions, totalCount] = await Promise.all([
        prisma.question.findMany({
            where,
            take,
            skip,
            orderBy: {
                createdAt: "desc",
            },
        }),
        prisma.question.count({ where }),
    ]);

    return {
        questions,
        pagination: {
            totalCount,
            totalPages: Math.ceil(totalCount / take),
            currentPage,
            limit: take,
            hasNextPage: currentPage * take < totalCount,
            hasPreviousPage: currentPage > 1,
        },
    };
};


const createQuestion = async (payload: CreateQuestionsInput) => {
    const { subjectId, topicId, questions } = payload;

    console.log("From service createQuestion", payload);

    if (!topicId) {
        throw new Error("Topic ID is required");
    }
    if (!subjectId) {
        throw new Error("Subject ID is required");
    }
    if (!questions || questions.length === 0) {
        throw new Error("Questions are required");
    }

    const questionsWithSubjectTopic = questions.map((item) => ({
        question: item.question,
        banglaQuestion: item.banglaQuestion,
        options: item.options,
        correctAnswer: item.correctAnswer,
        explanation: item.explanation,
        banglaExplanation: item.banglaExplanation,
        isActive: item.isActive,
        subjectId,
        topicId,
    }));

    console.log(questionsWithSubjectTopic);

    const result = await prisma.question.createMany({
        data: questionsWithSubjectTopic,
        skipDuplicates: true,
    });
    return result;
}

type AssignQuestionToTestPayload = {
    testID: string;
    questions: {
        question: string;
        banglaQuestion?: string | null;
        options: Prisma.InputJsonValue;
        correctAnswer: string;
        explanation?: string | null;
        banglaExplanation?: string | null;
        isActive?: boolean;
    }[];
};

const assign_question_to_test = async (payload: AssignQuestionToTestPayload) => {
    console.log("From service assign_question_to_test", payload);

    const { testID, questions } = payload;

    if (!testID) {
        throw new Error("Test ID is required");
    }
    if (!questions || questions.length === 0) {
        throw new Error("Questions are required");
    }

    const test = await prisma.test.findUnique({
        where: { id: testID },
        select: { id: true },
    });

    if (!test) {
        throw new Error("Test not found");
    }

    return prisma.question.createMany({
        data: questions.map((item) => ({
            testId: testID,
            question: item.question,
            banglaQuestion: item.banglaQuestion,
            options: item.options,
            correctAnswer: item.correctAnswer,
            explanation: item.explanation,
            banglaExplanation: item.banglaExplanation,
            isActive: item.isActive ?? true,
        })),
        skipDuplicates: true,
    });
}

const test_questions = async (query: any) => {
    const { testId, limit: limitParam = 200, page: pageParam = 1, search } = query;

    if (!testId) {
        throw new Error("Test ID is required");
    }

    let where = {}

    if (testId) {
        where = { testId: testId }
    }
    if (search) {
        where = {
            ...where,
            OR: [
                { question: { contains: search, mode: 'insensitive' } },
                { banglaQuestion: { contains: search, mode: 'insensitive' } },
                { explanation: { contains: search, mode: 'insensitive' } },
                { banglaExplanation: { contains: search, mode: 'insensitive' } },
            ]
        }
    }

    const limit = Number.parseInt(String(limitParam), 10);
    const page = Number.parseInt(String(pageParam), 10);

    if (!Number.isInteger(limit) || limit < 1) {
        throw new Error("Limit must be a positive integer");
    }

    if (!Number.isInteger(page) || page < 1) {
        throw new Error("Page must be a positive integer");
    }

    const questions = await prisma.question.findMany({
        where,
        take: limit,
        skip: (page - 1) * limit,
    });
    const count = await prisma.question.count({
        where: { testId: testId },
    });
    const totalPage = Math.ceil(count / limit);

    if (questions.length === 0) {
        throw new Error("No questions found for the specified test ID");
    }
    return { questions, count, page, totalPage };
};

const questionDeleteById = async (id: string) => {
    return await prisma.question.delete({
        where: { id },
    });

};

const questionUpdateById = async (id: string, payload: any) => {
    return await prisma.question.update({
        where: { id },
        data: payload,
    });
};


export const questionService = {
    getQuestions,
    test_questions,
    questionDeleteById,
    questionUpdateById,
    createQuestion,
    assign_question_to_test


}