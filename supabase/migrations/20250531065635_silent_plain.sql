-- Remove unused columns from reservations table
ALTER TABLE reservations
  DROP COLUMN IF EXISTS status,
  DROP COLUMN IF EXISTS custom_start_time,
  DROP COLUMN IF EXISTS custom_end_time,
  DROP COLUMN IF EXISTS is_approved,
  DROP COLUMN IF EXISTS has_pets;

-- Drop the update_has_pets trigger and function since has_pets column is removed
DROP TRIGGER IF EXISTS update_has_pets_trigger ON reservations;
DROP FUNCTION IF EXISTS update_has_pets();