/*
  Warnings:

  - Made the column `topicId` on table `Question` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Question" ALTER COLUMN "topicId" SET NOT NULL;
