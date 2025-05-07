-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "importId" TEXT;

-- CreateTable
CREATE TABLE "ImportHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "importDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL,
    "totalRows" INTEGER NOT NULL DEFAULT 0,
    "importedRows" INTEGER NOT NULL DEFAULT 0,
    "errorRows" INTEGER NOT NULL DEFAULT 0,
    "mappingId" TEXT,

    CONSTRAINT "ImportHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImportMapping" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "mapping" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ImportMapping_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ImportHistory_userId_idx" ON "ImportHistory"("userId");

-- CreateIndex
CREATE INDEX "ImportMapping_userId_idx" ON "ImportMapping"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ImportMapping_userId_name_key" ON "ImportMapping"("userId", "name");

-- CreateIndex
CREATE INDEX "Transaction_importId_idx" ON "Transaction"("importId");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_importId_fkey" FOREIGN KEY ("importId") REFERENCES "ImportHistory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImportHistory" ADD CONSTRAINT "ImportHistory_mappingId_fkey" FOREIGN KEY ("mappingId") REFERENCES "ImportMapping"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImportHistory" ADD CONSTRAINT "ImportHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImportMapping" ADD CONSTRAINT "ImportMapping_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
