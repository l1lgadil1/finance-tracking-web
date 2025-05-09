/*
  Warnings:

  - You are about to drop the column `importId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the `ImportHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ImportMapping` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ImportHistory" DROP CONSTRAINT "ImportHistory_mappingId_fkey";

-- DropForeignKey
ALTER TABLE "ImportHistory" DROP CONSTRAINT "ImportHistory_userId_fkey";

-- DropForeignKey
ALTER TABLE "ImportMapping" DROP CONSTRAINT "ImportMapping_userId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_importId_fkey";

-- DropIndex
DROP INDEX "Transaction_importId_idx";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "importId";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "name" TEXT,
ADD COLUMN     "phone" TEXT;

-- DropTable
DROP TABLE "ImportHistory";

-- DropTable
DROP TABLE "ImportMapping";
