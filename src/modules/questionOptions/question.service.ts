/* eslint-disable @typescript-eslint/no-explicit-any */

import { prisma } from "../../lib/prisma";
import { CreateQuestionsInput } from "./question.types";


const getQuestions = async (query: any) => {
    const {
        topicID,
        subjectID,
        numberOfQuestion,
        difficulty,
        search,
    } = query;

    const limit = Math.max(
        1,
        Math.min(parseInt(numberOfQuestion, 10) || 10, 100)
    );

    const minDifficulty =
        difficulty !== undefined && difficulty !== ""
            ? parseInt(difficulty, 10)
            : null;

    const subjectIdParam: string | null = subjectID || null;
    const topicIdParam: string | null = topicID || null;
    const searchParam: string | null = search || null;

    const questions = await prisma.$queryRaw`
        SELECT *
        FROM "Question"
        WHERE
            (
                CAST(${subjectIdParam} AS TEXT) IS NULL
                OR "subjectId" = CAST(${subjectIdParam} AS TEXT)
            )
            AND (
                CAST(${topicIdParam} AS TEXT) IS NULL
                OR "topicId" = CAST(${topicIdParam} AS TEXT)
            )
            AND (
                CAST(${searchParam} AS TEXT) IS NULL
                OR "question" ILIKE CONCAT(
                    '%',
                    CAST(${searchParam} AS TEXT),
                    '%'
                )
            )
            AND (
                CAST(${minDifficulty} AS INTEGER) IS NULL
                OR "difficulty" >= CAST(${minDifficulty} AS INTEGER)
            )
            AND "isActive" = TRUE
        ORDER BY RANDOM()
        LIMIT ${limit}
    `;

    return questions;
};


const createQuestion = async (payload: CreateQuestionsInput) => {
    const { subjectId, topicId, questions } = payload;

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
        ...item,
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




const updateQuestionById = async (id: string, payload: any) => {

    console.log("req.body", payload, id)

    const result = await prisma.question.update({
        where: {
            id
        },
        data: payload
    });


    return result;
}


const deleteQuestionById = async (id: string) => {
    const result = await prisma.question.delete({
        where: {
            id
        }
    });
    return result;
}

const assign_to_test = async (payload: any) => {
    const { testID, questionIds } = payload;

    if (!testID) {
        throw new Error("Test ID is required");
    }

    if (!Array.isArray(questionIds) || questionIds.length === 0) {
        throw new Error("Question IDs are required");
    }

    return prisma.$transaction(async (transaction) => {
        const test = await transaction.test.findUnique({
            where: {
                id: testID
            },
            select: {
                totalQuestions: true,
                testQuestions: {
                    select: {
                        questionId: true
                    }
                }
            }
        });

        if (!test) {
            throw new Error("Test not found");
        }

        const existingQuestionIds = new Set(
            test.testQuestions.map((testQuestion) => testQuestion.questionId)
        );
        const uniqueQuestionIds: string[] = [];
        const skippedQuestions: {
            questionId: string;
            reason: "duplicate" | "already_assigned" | "question_not_found" | "test_limit_reached";
        }[] = [];
        const receivedQuestionIds = new Set<string>();

        for (const questionId of questionIds) {
            if (typeof questionId !== "string" || questionId.length === 0) {
                skippedQuestions.push({
                    questionId: String(questionId),
                    reason: "question_not_found"
                });
            } else if (receivedQuestionIds.has(questionId)) {
                skippedQuestions.push({
                    questionId,
                    reason: "duplicate"
                });
            } else if (existingQuestionIds.has(questionId)) {
                skippedQuestions.push({
                    questionId,
                    reason: "already_assigned"
                });
            } else {
                receivedQuestionIds.add(questionId);
                uniqueQuestionIds.push(questionId);
            }
        }

        const questions = await transaction.question.findMany({
            where: {
                id: {
                    in: uniqueQuestionIds
                }
            },
            select: {
                id: true
            }
        });
        const questionIdsInDatabase = new Set(questions.map((question) => question.id));

        const availableQuestionIds = uniqueQuestionIds.filter((questionId) => {
            if (!questionIdsInDatabase.has(questionId)) {
                skippedQuestions.push({
                    questionId,
                    reason: "question_not_found"
                });
                return false;
            }
            return true;
        });

        const remainingCapacity = Math.max(
            0,
            test.totalQuestions - test.testQuestions.length
        );
        const questionIdsToAdd = availableQuestionIds.slice(0, remainingCapacity);

        for (const questionId of availableQuestionIds.slice(remainingCapacity)) {
            skippedQuestions.push({
                questionId,
                reason: "test_limit_reached"
            });
        }

        await transaction.testQuestion.createMany({
            data: questionIdsToAdd.map((questionId) => ({
                testId: testID,
                questionId
            }))
        });

        return {
            testId: testID,
            totalQuestions: test.totalQuestions,
            previouslyAssignedCount: test.testQuestions.length,
            addedCount: questionIdsToAdd.length,
            addedQuestionIds: questionIdsToAdd,
            skippedCount: skippedQuestions.length,
            skippedQuestions,
            remainingCapacity: remainingCapacity - questionIdsToAdd.length
        };
    });
}

const get_question_assign_to_test = async (query: any) => {
    const { testID } = query;

    const result = await prisma.testQuestion.findMany({
        where: {
            testId: testID
        },
        include: {
            question: true
        }
    });
    return result;
}

const delete_question_assign_to_test = async (query: any) => {
    const { testID, questionID } = query;
    console.log("From service delete_question_assign_to_test", testID, questionID);

    const result = await prisma.testQuestion.deleteMany({
        where: {
            testId: testID,
            questionId: questionID
        }
    });
    return result;
}

export const questionService = {
    getQuestions,
    createQuestion,
    updateQuestionById,
    deleteQuestionById,
    assign_to_test,
    get_question_assign_to_test,
    delete_question_assign_to_test

}