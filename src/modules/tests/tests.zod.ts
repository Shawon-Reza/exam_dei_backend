import { z } from "zod";

export const createTestSchema = z.object({
    name: z
        .string()
        .min(1, "Test name is required"),

    slug: z
        .string()
        .min(1, "Slug is required"),

    description: z
        .string()
        .optional(),

    duration: z
        .number()
        .int()
        .positive()
        .optional(),

    totalQuestions: z
        .number()
        .int()
        .positive()
        .optional(),

    isActive: z
        .boolean()
        .optional(),

    topicId: z
        .string()
        .min(1, "Topic ID is required")
        .optional()
        ,

    subjectId: z
        .string()
        .min(1, "Subject ID is required").optional(),
    status: z
        .enum(["PRACTICE", "LIVE", "UPCOMING"], "Status must be one of 'PRACTICE', 'LIVE', or 'UPCOMING'")
        .optional()
    
});

// "subjectId":"cmvo4rpz20000y4catsbgb56i",
//   "status": "PRACTICE"

export type CreateTestInput = z.infer<typeof createTestSchema>;