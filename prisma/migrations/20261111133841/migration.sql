/*
  Warnings:

  - You are about to drop the column `mcqTestId` on the `TestResult` table. All the data in the column will be lost.
  - You are about to drop the column `testType` on the `TestResult` table. All the data in the column will be lost.
  - You are about to drop the column `topicId` on the `TestResult` table. All the data in the column will be lost.
  - You are about to drop the `MCQTest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Point` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TestQuestion` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[question]` on the table `Question` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[banglaQuestion]` on the table `Question` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[subjectId,question]` on the table `Question` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[topicId,question]` on the table `Question` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[testId,question]` on the table `Question` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "MCQTest" DROP CONSTRAINT "MCQTest_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "MCQTest" DROP CONSTRAINT "MCQTest_topicId_fkey";

-- DropForeignKey
ALTER TABLE "Point" DROP CONSTRAINT "Point_userId_fkey";

-- DropForeignKey
ALTER TABLE "TestQuestion" DROP CONSTRAINT "TestQuestion_questionId_fkey";

-- DropForeignKey
ALTER TABLE "TestQuestion" DROP CONSTRAINT "TestQuestion_testId_fkey";

-- DropForeignKey
ALTER TABLE "TestResult" DROP CONSTRAINT "TestResult_mcqTestId_fkey";

-- DropForeignKey
ALTER TABLE "TestResult" DROP CONSTRAINT "TestResult_topicId_fkey";

-- AlterTable
ALTER TABLE "Question" ALTER COLUMN "subjectId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "TestResult" DROP COLUMN "mcqTestId",
DROP COLUMN "testType",
DROP COLUMN "topicId";

-- DropTable
DROP TABLE "MCQTest";

-- DropTable
DROP TABLE "Point";

-- DropTable
DROP TABLE "TestQuestion";

-- DropEnum
DROP TYPE "MCQTestStatus";

-- DropEnum
DROP TYPE "PointSource";

-- DropEnum
DROP TYPE "TestType_legacy";

-- CreateIndex
CREATE UNIQUE INDEX "Question_question_key" ON "Question"("question");

-- CreateIndex
CREATE UNIQUE INDEX "Question_banglaQuestion_key" ON "Question"("banglaQuestion");

-- CreateIndex
CREATE UNIQUE INDEX "Question_subjectId_question_key" ON "Question"("subjectId", "question");

-- CreateIndex
CREATE UNIQUE INDEX "Question_topicId_question_key" ON "Question"("topicId", "question");

-- CreateIndex
CREATE UNIQUE INDEX "Question_testId_question_key" ON "Question"("testId", "question");
