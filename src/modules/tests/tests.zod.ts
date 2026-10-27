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
        .min(1, "Topic ID is required"),
});

export type CreateTestInput = z.infer<typeof createTestSchema>;