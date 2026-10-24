/*
  Warnings:

  - Added the required column `subjectId` to the `Pdf` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pdf" ADD COLUMN     "banglaName" TEXT,
ADD COLUMN     "subjectId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Pdf_name_idx" ON "Pdf"("name");

-- AddForeignKey
ALTER TABLE "Pdf" ADD CONSTRAINT "Pdf_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
