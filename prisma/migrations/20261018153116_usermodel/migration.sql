/*
  Warnings:

  - Made the column `needPasswordChange` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `role` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userStatus` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "user" ALTER COLUMN "needPasswordChange" SET NOT NULL,
ALTER COLUMN "needPasswordChange" SET DEFAULT false,
ALTER COLUMN "role" SET NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'USER',
ALTER COLUMN "userStatus" SET NOT NULL,
ALTER COLUMN "userStatus" SET DEFAULT 'ACTIVE';
