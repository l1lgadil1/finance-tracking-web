-- Get the ID of the first user to use as the system user for category types
DO $$
DECLARE
    system_user_id UUID;
BEGIN
    -- Get the ID of the first user
    SELECT id INTO system_user_id FROM "User" LIMIT 1;

    IF system_user_id IS NOT NULL THEN
        -- First, mark all non-system category types as deleted
        UPDATE "CategoryType" 
        SET "deletedAt" = NOW() 
        WHERE "isSystem" = false;

        -- Delete any duplicate system category types, keeping only one of each type
        -- For each system category type name, keep only the oldest one and delete the rest
        WITH ranked_types AS (
            SELECT 
                id,
                name,
                ROW_NUMBER() OVER(PARTITION BY name ORDER BY "createdAt") as rn
            FROM "CategoryType"
            WHERE "isSystem" = true
            AND "deletedAt" IS NULL
        )
        UPDATE "CategoryType"
        SET "deletedAt" = NOW()
        WHERE id IN (
            SELECT id FROM ranked_types WHERE rn > 1
        );

        -- Update all remaining system category types to belong to the system user
        UPDATE "CategoryType"
        SET "userId" = system_user_id
        WHERE "isSystem" = true
        AND "deletedAt" IS NULL;

        -- Create any missing system category types
        -- Income
        INSERT INTO "CategoryType" ("id", "name", "userId", "isSystem", "createdAt", "updatedAt")
        SELECT 
            gen_random_uuid(), 'Income', system_user_id, true, NOW(), NOW()
        WHERE NOT EXISTS (
            SELECT 1 FROM "CategoryType" 
            WHERE "name" = 'Income' 
            AND "isSystem" = true 
            AND "deletedAt" IS NULL
        );

        -- Expense
        INSERT INTO "CategoryType" ("id", "name", "userId", "isSystem", "createdAt", "updatedAt")
        SELECT 
            gen_random_uuid(), 'Expense', system_user_id, true, NOW(), NOW()
        WHERE NOT EXISTS (
            SELECT 1 FROM "CategoryType" 
            WHERE "name" = 'Expense' 
            AND "isSystem" = true 
            AND "deletedAt" IS NULL
        );

        -- Transfer
        INSERT INTO "CategoryType" ("id", "name", "userId", "isSystem", "createdAt", "updatedAt")
        SELECT 
            gen_random_uuid(), 'Transfer', system_user_id, true, NOW(), NOW()
        WHERE NOT EXISTS (
            SELECT 1 FROM "CategoryType" 
            WHERE "name" = 'Transfer' 
            AND "isSystem" = true 
            AND "deletedAt" IS NULL
        );

        -- Gave Debt
        INSERT INTO "CategoryType" ("id", "name", "userId", "isSystem", "createdAt", "updatedAt")
        SELECT 
            gen_random_uuid(), 'Gave Debt', system_user_id, true, NOW(), NOW()
        WHERE NOT EXISTS (
            SELECT 1 FROM "CategoryType" 
            WHERE "name" = 'Gave Debt' 
            AND "isSystem" = true 
            AND "deletedAt" IS NULL
        );

        -- Took Debt
        INSERT INTO "CategoryType" ("id", "name", "userId", "isSystem", "createdAt", "updatedAt")
        SELECT 
            gen_random_uuid(), 'Took Debt', system_user_id, true, NOW(), NOW()
        WHERE NOT EXISTS (
            SELECT 1 FROM "CategoryType" 
            WHERE "name" = 'Took Debt' 
            AND "isSystem" = true 
            AND "deletedAt" IS NULL
        );

        -- Repay Debt
        INSERT INTO "CategoryType" ("id", "name", "userId", "isSystem", "createdAt", "updatedAt")
        SELECT 
            gen_random_uuid(), 'Repay Debt', system_user_id, true, NOW(), NOW()
        WHERE NOT EXISTS (
            SELECT 1 FROM "CategoryType" 
            WHERE "name" = 'Repay Debt' 
            AND "isSystem" = true 
            AND "deletedAt" IS NULL
        );
    END IF;
END $$; 