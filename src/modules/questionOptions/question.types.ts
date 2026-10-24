import { z } from "zod";

export type CreateQuestionInput = {
    question: string;
    type?: "MCQ";
    difficulty: number;
    explanation?: string | null;
    isActive?: boolean;
    subjectId: string;
    topicId?: string | null;
    options: {
        text: string;
        isCorrect: boolean;
    }[];
};



export const createQuestionsSchema = z.object({
  subjectId: z.string().min(1, "Subject ID is required"),

  topicId: z.string().min(1, "Topic ID is required").nullable().optional(),

  questions: z
    .array(
      z.object({
        question: z.string().trim().min(1, "Question is required"),

        type: z.enum(["MCQ"]).default("MCQ"),

        difficulty: z.number().int().min(1).max(5).default(3),

        explanation: z.string().nullable().optional(),

        isActive: z.boolean().default(true),

        options: z
          .array(
            z.object({
              text: z.string().trim().min(1, "Option text is required"),
              isCorrect: z.boolean(),
            })
          )
          .min(2, "At least 2 options are required")
          .refine(
            (options) =>
              options.filter((option) => option.isCorrect).length === 1,
            {
              message: "Exactly one option must be correct",
            }
          ),
      })
    )
    .min(1, "At least one question is required"),
});

export type CreateQuestionsInput = z.infer<typeof createQuestionsSchema>;