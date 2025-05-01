-- Update existing category types to be system types
UPDATE "CategoryType" 
SET "isSystem" = true 
WHERE "name" IN ('Income', 'Expense', 'Transfer', 'Gave Debt', 'Took Debt', 'Repay Debt');

-- Ensure all users have the required system category types
-- This is a more complex operation and would require a stored procedure or script
-- For now, we'll rely on the UserService create method for new users
-- Existing users may need manual data migration if they're missing system types 