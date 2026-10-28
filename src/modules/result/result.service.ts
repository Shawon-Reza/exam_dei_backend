import { prisma } from "../../lib/prisma"


const createResult = async (resultData: Record<string, unknown>, id: string) => {
    console.log("resultData", resultData, id)

    if (!resultData?.testId) {
        throw new Error("Test ID is required");
    }

    const timeNeedForNextCall = await prisma.testResult.findFirst({
        orderBy: {
            createdAt: "desc",
        },
    })

    const timeGap = timeNeedForNextCall ? (new Date().getTime() - new Date(timeNeedForNextCall.createdAt).getTime()) / 1000 : null;
    if (timeGap !== null && timeGap < 180) {
        throw new Error("You need to wait 2 minutes before submitting another result");
    }
    console.log("timeNeedForNextCall", timeNeedForNextCall)

    const result = await prisma.testResult.create({
        data: { ...resultData, userId: id }
    })
    return result;
}

export const resultService = {
    createResult,
}