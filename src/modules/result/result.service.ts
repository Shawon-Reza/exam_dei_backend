import { prisma } from "../../lib/prisma"


const createResult = async (resultData: Record<string, unknown>, id: string) => {
    console.log("resultData", resultData, id)
    const correctAnswers = Number(resultData.correctAnswers ?? 0);
    const skippedAnswers = Number(resultData.skippedAnswers ?? 0);
    const accuracy = Number(resultData.accuracy ?? 0);

    // Calculate reward points
    let points = correctAnswers;
    if (skippedAnswers === 0) {
        points += 5;
    }

    if (accuracy === 100) {
        points += 50;
    } else if (accuracy > 90) {
        points += 10;
    } else if (accuracy > 80) {
        points += 5;
    }

    console.log("points", points)

    if (!resultData?.topicId) {
        throw new Error("Topic ID is required");
    }

    const timeNeedForNextCall = await prisma.testResult.findFirst({
        orderBy: {
            createdAt: "desc",
        },
    })

    const timeGap = timeNeedForNextCall ? (new Date().getTime() - new Date(timeNeedForNextCall.createdAt).getTime()) / 1000 : null;
    if (timeGap !== null && timeGap < 10) {
        throw new Error("You need to wait 3 minutes before submitting another result");
    }
    console.log("timeNeedForNextCall", timeNeedForNextCall)



    const { result, point } = await prisma.$transaction(async (tx) => {
        const result = await tx.testResult.create({
            data: {
                ...resultData,
                userId: id,
                topicId: resultData.topicId as string,
            },
        });

        const point = await tx.point.create({
            data: {
                userId: id,
                points,
                description: `You earned ${points} points for your performance in the test ${result.id}.`,
                source: "TEST",
            },
            select: {
                points: true,
            }
        });

        return { result, point };
    });


    return { ...result, point };
}

export const resultService = {
    createResult,
}