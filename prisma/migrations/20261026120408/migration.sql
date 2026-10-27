/*
  Warnings:

  - You are about to drop the column `totalMarks` on the `Test` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Test" DROP COLUMN "totalMarks",
ADD COLUMN     "totalQuestions" INTEGER NOT NULL DEFAULT 20;
