/*
  Warnings:

  - You are about to drop the column `Category` on the `Test` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Test" DROP COLUMN "Category";

-- DropEnum
DROP TYPE "TestCategory";
