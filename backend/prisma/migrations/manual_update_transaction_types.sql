-- First, create a temporary type that includes both old and new values
CREATE TYPE "TransactionType_new" AS ENUM ('income', 'expense', 'transfer', 'debt_give', 'debt_take', 'debt_repay');

-- Add the new type to the table as a nullable column
ALTER TABLE "Transaction" ADD COLUMN "type_new" "TransactionType_new";

-- Update the new column based on the old type
UPDATE "Transaction"
SET "type_new" = CASE
    WHEN "type" = 'debt' AND "amount" < 0 THEN 'debt_give'::"TransactionType_new"
    WHEN "type" = 'debt' AND "amount" >= 0 THEN 'debt_take'::"TransactionType_new"
    ELSE "type"::"TransactionType_new"
END;

-- Drop the old type column
ALTER TABLE "Transaction" DROP COLUMN "type";

-- Rename the new column to the original name
ALTER TABLE "Transaction" RENAME COLUMN "type_new" TO "type";

-- Make the column required
ALTER TABLE "Transaction" ALTER COLUMN "type" SET NOT NULL;

-- Drop the old enum type
DROP TYPE "TransactionType";

-- Rename the new enum type to the original name
ALTER TYPE "TransactionType_new" RENAME TO "TransactionType"; 