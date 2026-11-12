import { prisma } from "../../lib/prisma";

type SubmittedAnswer = {
    questionId: string;
    selectedAnswer: string | null;
};

const createResult = async (
    resultData: Record<string, unknown>,
    userId: string,
) => {

    const testId = typeof resultData.testId === "string" ? resultData.testId : "";
    const answers = resultData.answers;

    if (!testId) {
        throw new Error("Test ID is required");
    }
    if (!userId) {
        throw new Error("Unauthorized: User ID is required");
    }
    if (!Array.isArray(answers)) {
        throw new Error("Answers must be an array");
    }

    const test = await prisma.test.findUnique({
        where: {
            id: testId,
        },
        include: {
            testQuestions: true,
        },
    });
    if (!test) {
        throw new Error("Test not found");
    }

    const questionsById = new Map(
        test.testQuestions.map((question) => [question.id, question]),
    );
    const submittedQuestionIds = new Set<string>();

    for (const answer of answers as SubmittedAnswer[]) {
        if (
            !answer ||
            typeof answer.questionId !== "string" ||
            (answer.selectedAnswer !== null &&
                typeof answer.selectedAnswer !== "string")
        ) {
            throw new Error(
                "Each answer must contain a questionId and a string or null selectedAnswer",
            );
        }
        if (!questionsById.has(answer.questionId)) {
            throw new Error(`Question ${answer.questionId} is not part of this test`);
        }
        if (submittedQuestionIds.has(answer.questionId)) {
            throw new Error(`Question ${answer.questionId} was submitted more than once`);
        }
        submittedQuestionIds.add(answer.questionId);
    }

    let correctAnswers = 0;
    let incorrectAnswers = 0;
    let skippedAnswers = test.testQuestions.length - answers.length;

    for (const answer of answers as SubmittedAnswer[]) {
        if (answer.selectedAnswer === null) {
            skippedAnswers += 1;
            continue;
        }

        const question = questionsById.get(answer.questionId);
        if (
            question &&
            question.correctAnswer.toLowerCase() === answer.selectedAnswer.toLowerCase()
        ) {
            correctAnswers += 1;
        } else {
            incorrectAnswers += 1;
        }
    }

    const totalQuestions = test.testQuestions.length;
    const accuracy =
        totalQuestions === 0 ? 0 : (correctAnswers / totalQuestions) * 100;

    const result = await prisma.testResult.create({
        data: {
            testId,
            userId,
            totalQuestions,
            correctAnswers,
            incorrectAnswers,
            skippedAnswers,
            accuracy,
        },
    });

    return {
        resultId: result.id,
        testId,
        totalQuestions,
        correctAnswers,
        incorrectAnswers,
        skippedAnswers,
        accuracy,
    };
}

export const resultService = {
    createResult,
}