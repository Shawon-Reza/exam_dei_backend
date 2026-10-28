/*
  Warnings:

  - You are about to drop the column `marks` on the `TestQuestion` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TestQuestion" DROP COLUMN "marks";

-- CreateTable
CREATE TABLE "Note" (
    "id" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "topicName" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "textContent" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
