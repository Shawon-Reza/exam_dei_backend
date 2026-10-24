/*
  Warnings:

  - You are about to drop the `QuestionOption` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `options` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "QuestionOption" DROP CONSTRAINT "QuestionOption_questionId_fkey";

-- DropIndex
DROP INDEX "Question_createdAt_idx";

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "options" JSONB NOT NULL;

-- DropTable
DROP TABLE "QuestionOption";
