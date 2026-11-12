-- Keep the old enum for legacy TestResult.testType data and use a new enum
-- for the current Test.type field.
CREATE TYPE "TestType_new" AS ENUM ('TOPIC', 'SUBJECT', 'CATEGORY');
ALTER TABLE "Test"
ADD COLUMN IF NOT EXISTS "type" "TestType_new" NOT NULL DEFAULT 'TOPIC';
ALTER TYPE "TestType" RENAME TO "TestType_legacy";
ALTER TYPE "TestType_new" RENAME TO "TestType";

-- Keep the existing join table, but populate the new direct relation for compatibility.
ALTER TABLE "Question"
ADD COLUMN IF NOT EXISTS "testId" TEXT;

UPDATE "Question" AS question
SET "testId" = assignment."testId"
FROM (
    SELECT DISTINCT ON ("questionId")
        "questionId",
        "testId"
    FROM "TestQuestion"
    ORDER BY "questionId", "id"
) AS assignment
WHERE question."id" = assignment."questionId"
  AND question."testId" IS NULL;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'Question_testId_fkey'
    ) THEN
        ALTER TABLE "Question"
        ADD CONSTRAINT "Question_testId_fkey"
        FOREIGN KEY ("testId") REFERENCES "Test"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;
