/*
  Warnings:

  - You are about to drop the column `customerId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_customerId_fkey";

-- DropIndex
DROP INDEX "User_customerId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "customerId";
