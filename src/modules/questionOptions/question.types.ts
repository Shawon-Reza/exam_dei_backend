import { z } from "zod";

export type CreateQuestionInput = {
  subjectId: string;
  topicId?: string | null;

  questions: {
    question: string;
    banglaQuestion?: string | null;

    options: {
      id: string;
      text: string;
    }[];

    correctAnswer: string;
    explanation?: string | null;
    banglaExplanation?: string | null;

    isActive?: boolean;
  }[];
};



export const createQuestionsSchema = z.object({
  subjectId: z.string().min(1, "Subject ID is required"),

  topicId: z.string().min(1, "Topic ID is required").nullable().optional(),

  questions: z
    .array(
      z.object({
        question: z.string().trim().min(1, "Question is required"),

        banglaQuestion: z.string().trim().nullable().optional(),

        options: z
          .array(
            z.object({
              id: z.string().min(1, "Option ID is required"),
              text: z.string().trim().min(1, "Option text is required"),
            })
          )
          .min(2, "At least 2 options are required"),

        correctAnswer: z.string().min(1, "Correct answer is required"),

        explanation: z.string().nullable().optional(),

        banglaExplanation: z.string().nullable().optional(),

        isActive: z.boolean().default(true),
      })
    )
    .min(1, "At least one question is required"),
}).superRefine((data, ctx) => {
  data.questions.forEach((question, index) => {
    const optionIds = question.options.map((option) => option.id);

    if (new Set(optionIds).size !== optionIds.length) {
      ctx.addIssue({
        code: "custom",
        path: ["questions", index, "options"],
        message: "Option IDs must be unique",
      });
    }

    if (!optionIds.includes(question.correctAnswer)) {
      ctx.addIssue({
        code: "custom",
        path: ["questions", index, "correctAnswer"],
        message: "Correct answer must match an existing option ID",
      });
    }
  });
});

export type CreateQuestionsInput = z.infer<typeof createQuestionsSchema>;