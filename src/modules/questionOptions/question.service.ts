/* eslint-disable @typescript-eslint/no-explicit-any */

import { prisma } from "../../lib/prisma";
import { CreateQuestionsInput } from "./question.types";


const getQuestions = async (query: any) => {
    const { topicID, subjectID, numberOfQuestion, difficulty } = query;

    const questions = await prisma.$queryRaw`
    SELECT *
    FROM "Question"
    WHERE
      (${subjectID ?? null}::text IS NULL OR "subjectId" = ${subjectID})
      AND (${topicID ?? null}::text IS NULL OR "topicId" = ${topicID})
      AND (
        ${difficulty ? parseInt(difficulty) : null}::int IS NULL
        OR "difficulty" >= ${difficulty ? parseInt(difficulty) : null}
      )
      AND "isActive" = true
    ORDER BY RANDOM()
    LIMIT ${numberOfQuestion ? parseInt(numberOfQuestion) : 10}
  `;

    return questions;
};


const createQuestion = async (payload: CreateQuestionsInput) => {
    const { subjectId, topicId, questions } = payload;


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

    export const questionService = {
        getQuestions,
        createQuestion,
        updateQuestionById,
        deleteQuestionById

    }