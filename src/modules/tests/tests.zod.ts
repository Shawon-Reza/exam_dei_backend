import { z } from "zod";

export const createTestSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Test name is required"),

    slug: z
        .string()
        .trim()
        .min(1, "Slug is required"),

    description: z
        .string()
        .optional()
        .nullable(),

    duration: z
        .number()
        .int()
        .positive("Duration must be greater than 0")
        .optional(),

    totalQuestions: z
        .number()
        .int()
        .positive("Total questions must be greater than 0")
        .optional(),

    isActive: z
        .boolean()
        .optional(),

    status: z
        .enum(["PRACTICE", "LIVE", "UPCOMING"])
        .optional(),

    type: z
        .enum(["TOPIC", "SUBJECT", "GENERAL"])
        .optional(),

    topicId: z
        .string()
        .min(1, "Topic ID cannot be empty")
        .nullable()
        .optional(),

    subjectId: z
        .string()
        .min(1, "Subject ID cannot be empty")
        .nullable()
        .optional(),
});

export type CreateTestInput = z.infer<typeof createTestSchema>;