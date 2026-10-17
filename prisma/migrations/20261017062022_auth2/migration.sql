-- AlterTable
ALTER TABLE "user" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "needPasswordChange" BOOLEAN,
ADD COLUMN     "role" TEXT,
ADD COLUMN     "userStatus" TEXT;
