/*
  Warnings:

  - You are about to drop the column `negativeScore` on the `TestResult` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `TestResult` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "PointType" AS ENUM ('EARNED', 'SPENT', 'BONUS', 'PENALTY', 'REFUND');

-- CreateEnum
CREATE TYPE "PointReason" AS ENUM ('CORRECT_ANSWER', 'TEST_COMPLETED', 'NO_SKIPPED_ANSWERS', 'ACCURACY_BONUS', 'DAILY_LOGIN', 'DAILY_GOAL_COMPLETED', 'NOTE_COMPLETED', 'TOPIC_COMPLETED', 'SUBJECT_COMPLETED', 'STUDY_STREAK', 'PROFILE_COMPLETED', 'CHALLENGE_COMPLETED', 'ADMIN_ADJUSTMENT');

-- AlterTable
ALTER TABLE "TestResult" DROP COLUMN "negativeScore",
DROP COLUMN "score";

-- CreateTable
CREATE TABLE "PointTransaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "type" "PointType" NOT NULL,
    "reason" "PointReason" NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PointTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PointTransaction_userId_createdAt_idx" ON "PointTransaction"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "PointTransaction_userId_reason_idx" ON "PointTransaction"("userId", "reason");

-- AddForeignKey
ALTER TABLE "PointTransaction" ADD CONSTRAINT "PointTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
