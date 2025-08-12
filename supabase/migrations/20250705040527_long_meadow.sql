/*
  # Add total_price column to reservations table

  1. New Columns
    - `total_price` (integer, nullable)
      - Stores the total price in yen (tax included)
      - Integer type to avoid floating point precision issues
      - Nullable to allow existing records without breaking

  2. Security
    - No changes to RLS policies needed
    - Column is accessible through existing policies

  3. Notes
    - Using integer to store price in yen to avoid decimal precision issues
    - Existing reservations will have NULL total_price initially
*/

ALTER TABLE reservations 
ADD COLUMN total_price integer;

-- Add comment to document the column purpose
COMMENT ON COLUMN reservations.total_price IS 'Total price in yen (tax included)';

-- Add check constraint to ensure non-negative prices
ALTER TABLE reservations
ADD CONSTRAINT valid_total_price CHECK (total_price >= 0);