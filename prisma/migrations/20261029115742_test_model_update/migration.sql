/*
  Warnings:

  - Added the required column `subjectId` to the `Test` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TestStatus" AS ENUM ('PRACTICE', 'UPCOMING', 'LIVE');

-- AlterTable
ALTER TABLE "Test" ADD COLUMN     "status" "TestStatus" NOT NULL DEFAULT 'PRACTICE',
ADD COLUMN     "subjectId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Test" ADD CONSTRAINT "Test_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
