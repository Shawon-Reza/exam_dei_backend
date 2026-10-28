/*
  Warnings:

  - Added the required column `topicId` to the `TestResult` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TestResult" ADD COLUMN     "accuracy" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "topicId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "TestResult" ADD CONSTRAINT "TestResult_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
