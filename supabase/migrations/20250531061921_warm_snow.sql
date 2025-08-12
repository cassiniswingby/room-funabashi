-- Add new columns to reservations table with defaults
ALTER TABLE reservations
  ADD COLUMN IF NOT EXISTS guest_phone text DEFAULT '',
  ADD COLUMN IF NOT EXISTS num_adults integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS num_infants integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS num_preschoolers integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS num_children integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS num_dogs_small_outdoor integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS num_dogs_small_indoor integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS num_dogs_large_outdoor integer DEFAULT 0;

-- Update existing rows to have a default phone number
UPDATE reservations
SET guest_phone = ''
WHERE guest_phone IS NULL;

-- Now make guest_phone required
ALTER TABLE reservations
  ALTER COLUMN guest_phone SET NOT NULL;

-- Add check constraints for non-negative numbers
ALTER TABLE reservations
  ADD CONSTRAINT valid_num_adults CHECK (num_adults >= 0),
  ADD CONSTRAINT valid_num_infants CHECK (num_infants >= 0),
  ADD CONSTRAINT valid_num_preschoolers CHECK (num_preschoolers >= 0),
  ADD CONSTRAINT valid_num_children CHECK (num_children >= 0),
  ADD CONSTRAINT valid_num_dogs_small_outdoor CHECK (num_dogs_small_outdoor >= 0),
  ADD CONSTRAINT valid_num_dogs_small_indoor CHECK (num_dogs_small_indoor >= 0),
  ADD CONSTRAINT valid_num_dogs_large_outdoor CHECK (num_dogs_large_outdoor >= 0);

-- Update has_pets trigger
CREATE OR REPLACE FUNCTION update_has_pets()
RETURNS TRIGGER AS $$
BEGIN
  NEW.has_pets := (
    COALESCE(NEW.num_dogs_small_outdoor, 0) > 0 OR 
    COALESCE(NEW.num_dogs_small_indoor, 0) > 0 OR 
    COALESCE(NEW.num_dogs_large_outdoor, 0) > 0
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_has_pets_trigger ON reservations;
CREATE TRIGGER update_has_pets_trigger
  BEFORE INSERT OR UPDATE ON reservations
  FOR EACH ROW
  EXECUTE FUNCTION update_has_pets();