-- Drop type if it exists and recreate it
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'reservation_plan') THEN
        CREATE TYPE reservation_plan AS ENUM (
            'day',
            'night',
            'allnight',
            'oneday',
            'oneday_allnight',
            'custom'
        );
    END IF;
END $$;

-- Add new columns first with defaults
ALTER TABLE reservations 
  ADD COLUMN IF NOT EXISTS plan_type reservation_plan DEFAULT 'day',
  ADD COLUMN IF NOT EXISTS custom_start_time TIME,
  ADD COLUMN IF NOT EXISTS custom_end_time TIME,
  ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;

-- Set plan_type to non-null after adding default
ALTER TABLE reservations 
  ALTER COLUMN plan_type SET NOT NULL;

-- Update existing records to have sensible defaults
UPDATE reservations
SET plan_type = 'oneday_allnight'
WHERE plan_type = 'day';

-- Now safe to drop end_date if it exists
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reservations' AND column_name = 'end_date') THEN
        ALTER TABLE reservations DROP COLUMN end_date;
    END IF;
END $$;

-- Modify start_date if it exists
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reservations' AND column_name = 'start_date') THEN
        ALTER TABLE reservations 
            ALTER COLUMN start_date SET DATA TYPE date,
            ALTER COLUMN start_date SET NOT NULL;
        
        ALTER TABLE reservations 
            RENAME COLUMN start_date TO reservation_date;
    END IF;
END $$;

-- Add check constraint for valid reservation date if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.constraint_column_usage WHERE constraint_name = 'valid_reservation_date') THEN
        ALTER TABLE reservations
            ADD CONSTRAINT valid_reservation_date 
            CHECK (reservation_date >= CURRENT_DATE AND 
                   reservation_date <= CURRENT_DATE + INTERVAL '2 months');
    END IF;
END $$;

-- Add check constraint for custom time slots if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.constraint_column_usage WHERE constraint_name = 'valid_custom_times') THEN
        ALTER TABLE reservations
            ADD CONSTRAINT valid_custom_times
            CHECK (
                (plan_type = 'custom' AND custom_start_time IS NOT NULL AND custom_end_time IS NOT NULL) OR
                (plan_type != 'custom' AND custom_start_time IS NULL AND custom_end_time IS NULL)
            );
    END IF;
END $$;

-- Function to get plan time slots
CREATE OR REPLACE FUNCTION get_plan_times(plan reservation_plan)
RETURNS TABLE (start_time TIME, end_time TIME) AS $$
BEGIN
  RETURN QUERY
  SELECT
    CASE plan
      WHEN 'day' THEN '10:00'::TIME
      WHEN 'night' THEN '17:00'::TIME
      WHEN 'allnight' THEN '17:00'::TIME
      WHEN 'oneday' THEN '10:00'::TIME
      WHEN 'oneday_allnight' THEN '10:00'::TIME
    END AS start_time,
    CASE plan
      WHEN 'day' THEN '16:00'::TIME
      WHEN 'night' THEN '24:00'::TIME
      WHEN 'allnight' THEN '09:00'::TIME
      WHEN 'oneday' THEN '24:00'::TIME
      WHEN 'oneday_allnight' THEN '09:00'::TIME
    END AS end_time;
END;
$$ LANGUAGE plpgsql;

-- Function to check for time slot conflicts
CREATE OR REPLACE FUNCTION check_time_slot_conflict()
RETURNS TRIGGER AS $$
DECLARE
  conflicting_reservation_exists BOOLEAN;
  new_start_time TIME;
  new_end_time TIME;
  existing_start_time TIME;
  existing_end_time TIME;
BEGIN
  -- Get times for the new reservation
  IF NEW.plan_type = 'custom' THEN
    new_start_time := NEW.custom_start_time;
    new_end_time := NEW.custom_end_time;
  ELSE
    SELECT start_time, end_time 
    FROM get_plan_times(NEW.plan_type) 
    INTO new_start_time, new_end_time;
  END IF;

  -- Check for conflicts
  SELECT EXISTS (
    SELECT 1 
    FROM reservations r
    WHERE r.reservation_date = NEW.reservation_date
    AND r.id != NEW.id
    AND (
      CASE 
        WHEN r.plan_type = 'custom' THEN
          -- Get custom times for existing reservation
          r.custom_start_time < new_end_time AND r.custom_end_time > new_start_time
        ELSE
          -- Get plan times for existing reservation
          (SELECT start_time FROM get_plan_times(r.plan_type)) < new_end_time AND
          (SELECT end_time FROM get_plan_times(r.plan_type)) > new_start_time
      END
    )
  ) INTO conflicting_reservation_exists;

  IF conflicting_reservation_exists THEN
    RAISE EXCEPTION 'Time slot conflict detected';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for time slot conflict checking
DROP TRIGGER IF EXISTS check_time_slot_conflict_trigger ON reservations;
CREATE TRIGGER check_time_slot_conflict_trigger
  BEFORE INSERT OR UPDATE ON reservations
  FOR EACH ROW
  EXECUTE FUNCTION check_time_slot_conflict();

-- Update RLS policies
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can create reservations" ON reservations;
CREATE POLICY "Anyone can create reservations"
  ON reservations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can view reservations" ON reservations;
CREATE POLICY "Anyone can view reservations"
  ON reservations
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Only authenticated users can update reservations" ON reservations;
CREATE POLICY "Only authenticated users can update reservations"
  ON reservations
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Only authenticated users can delete reservations" ON reservations;
CREATE POLICY "Only authenticated users can delete reservations"
  ON reservations
  FOR DELETE
  TO authenticated
  USING (true);