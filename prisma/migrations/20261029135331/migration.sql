-- CreateEnum
CREATE TYPE "TestCategory" AS ENUM ('SUBJECTIVE', 'JOB');

-- AlterTable
ALTER TABLE "Test" ADD COLUMN     "Category" "TestCategory" NOT NULL DEFAULT 'SUBJECTIVE';
