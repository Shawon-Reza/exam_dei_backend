/*
  Warnings:

  - You are about to drop the column `difficulty` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Question` table. All the data in the column will be lost.
  - Added the required column `correctAnswer` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mcqTestId` to the `TestResult` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MCQTestStatus" AS ENUM ('DRAFT', 'UPCOMING', 'LIVE', 'COMPLETED');

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_topicId_fkey";

-- DropIndex
DROP INDEX "Question_difficulty_isActive_idx";

-- DropIndex
DROP INDEX "Question_question_key";

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "difficulty",
DROP COLUMN "type",
ADD COLUMN     "banglaExplanation" TEXT,
ADD COLUMN     "banglaQuestion" TEXT,
ADD COLUMN     "correctAnswer" TEXT NOT NULL,
ALTER COLUMN "topicId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "TestResult" ADD COLUMN     "mcqTestId" TEXT NOT NULL;

-- DropEnum
DROP TYPE "QuestionType";

-- CreateTable
CREATE TABLE "MCQTest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "banglaName" TEXT,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "duration" INTEGER NOT NULL DEFAULT 30,
    "totalQuestions" INTEGER NOT NULL DEFAULT 20,
    "totalMarks" DOUBLE PRECISION NOT NULL DEFAULT 20,
    "passMarks" DOUBLE PRECISION,
    "negativeMarking" BOOLEAN NOT NULL DEFAULT false,
    "negativeMark" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "questions" JSONB NOT NULL,
    "status" "MCQTestStatus" NOT NULL DEFAULT 'DRAFT',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "startAt" TIMESTAMP(3),
    "endAt" TIMESTAMP(3),
    "subjectId" TEXT,
    "topicId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MCQTest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MCQTest_slug_key" ON "MCQTest"("slug");

-- CreateIndex
CREATE INDEX "MCQTest_subjectId_status_idx" ON "MCQTest"("subjectId", "status");

-- CreateIndex
CREATE INDEX "MCQTest_topicId_status_idx" ON "MCQTest"("topicId", "status");

-- CreateIndex
CREATE INDEX "MCQTest_status_isActive_idx" ON "MCQTest"("status", "isActive");

-- AddForeignKey
ALTER TABLE "MCQTest" ADD CONSTRAINT "MCQTest_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MCQTest" ADD CONSTRAINT "MCQTest_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestResult" ADD CONSTRAINT "TestResult_mcqTestId_fkey" FOREIGN KEY ("mcqTestId") REFERENCES "MCQTest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
