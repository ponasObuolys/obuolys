-- Change articles.category from text to text[] to support multiple categories
-- This migration safely converts existing single category values to arrays

-- Step 1: Add a temporary column for the array
ALTER TABLE articles ADD COLUMN IF NOT EXISTS categories_temp text[];

-- Step 2: Copy existing category values to the array (convert single value to array)
UPDATE articles 
SET categories_temp = ARRAY[category]
WHERE category IS NOT NULL AND category != '';

-- Step 3: For empty/null categories, set to empty array
UPDATE articles 
SET categories_temp = ARRAY[]::text[]
WHERE category IS NULL OR category = '';

-- Step 4: Drop the old category column
ALTER TABLE articles DROP COLUMN category;

-- Step 5: Rename the temporary column to category
ALTER TABLE articles RENAME COLUMN categories_temp TO category;

-- Step 6: Add a check constraint to ensure category is not null
ALTER TABLE articles ALTER COLUMN category SET NOT NULL;

-- Step 7: Set default value to empty array
ALTER TABLE articles ALTER COLUMN category SET DEFAULT ARRAY[]::text[];

-- Add comment
COMMENT ON COLUMN articles.category IS 'Array of categories for the article. Supports multiple categories per article.';
