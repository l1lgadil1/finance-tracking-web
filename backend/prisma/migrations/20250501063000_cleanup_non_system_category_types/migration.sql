-- Mark all non-system category types as deleted
UPDATE "CategoryType" 
SET "deletedAt" = NOW() 
WHERE "isSystem" = false;

-- Ensure all system types have the correct names
UPDATE "CategoryType"
SET "name" = 'Income'
WHERE "name" = 'Income' AND "isSystem" = true;

UPDATE "CategoryType"
SET "name" = 'Expense'
WHERE "name" = 'Expense' AND "isSystem" = true;

UPDATE "CategoryType"
SET "name" = 'Transfer'
WHERE "name" = 'Transfer' AND "isSystem" = true;

UPDATE "CategoryType"
SET "name" = 'Gave Debt'
WHERE "name" = 'Gave Debt' AND "isSystem" = true;

UPDATE "CategoryType"
SET "name" = 'Took Debt'
WHERE "name" = 'Took Debt' AND "isSystem" = true;

UPDATE "CategoryType"
SET "name" = 'Repay Debt'
WHERE "name" = 'Repay Debt' AND "isSystem" = true; 