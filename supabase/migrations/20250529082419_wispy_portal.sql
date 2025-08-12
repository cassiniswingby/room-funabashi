-- Create enum for reservation plan types if it doesn't exist
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

-- Create reservations table
CREATE TABLE IF NOT EXISTS reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_date date NOT NULL,
  guest_name text NOT NULL,
  guest_email text NOT NULL,
  num_guests integer NOT NULL DEFAULT 1,
  has_pets boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  notes text,
  plan_type reservation_plan NOT NULL DEFAULT 'day',
  custom_start_time time,
  custom_end_time time,
  is_approved boolean DEFAULT false,
  CONSTRAINT valid_reservation_date CHECK (
    reservation_date >= CURRENT_DATE AND 
    reservation_date <= CURRENT_DATE + INTERVAL '2 months'
  ),
  CONSTRAINT valid_custom_times CHECK (
    (plan_type = 'custom' AND custom_start_time IS NOT NULL AND custom_end_time IS NOT NULL) OR
    (plan_type != 'custom' AND custom_start_time IS NULL AND custom_end_time IS NULL)
  )
);

-- Create blocked_dates table
CREATE TABLE IF NOT EXISTS blocked_dates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL UNIQUE,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_dates ENABLE ROW LEVEL SECURITY;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_reservations_date 
  ON reservations (reservation_date);

CREATE INDEX IF NOT EXISTS idx_blocked_dates_date 
  ON blocked_dates (date);

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

-- Create trigger for time slot conflict checking if it doesn't exist
DROP TRIGGER IF EXISTS check_time_slot_conflict_trigger ON reservations;
CREATE TRIGGER check_time_slot_conflict_trigger
  BEFORE INSERT OR UPDATE ON reservations
  FOR EACH ROW
  EXECUTE FUNCTION check_time_slot_conflict();

-- Drop existing policies before creating new ones
DROP POLICY IF EXISTS "Anyone can view reservations" ON reservations;
DROP POLICY IF EXISTS "Anyone can create reservations" ON reservations;
DROP POLICY IF EXISTS "Only authenticated users can update reservations" ON reservations;
DROP POLICY IF EXISTS "Only authenticated users can delete reservations" ON reservations;
DROP POLICY IF EXISTS "Anyone can view blocked dates" ON blocked_dates;
DROP POLICY IF EXISTS "Only authenticated users can create blocked dates" ON blocked_dates;
DROP POLICY IF EXISTS "Only authenticated users can update blocked dates" ON blocked_dates;
DROP POLICY IF EXISTS "Only authenticated users can delete blocked dates" ON blocked_dates;

-- Add RLS Policies for reservations
CREATE POLICY "Anyone can view reservations" 
  ON reservations 
  FOR SELECT 
  TO anon, authenticated 
  USING (true);

CREATE POLICY "Anyone can create reservations" 
  ON reservations 
  FOR INSERT 
  TO anon, authenticated 
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can update reservations" 
  ON reservations 
  FOR UPDATE 
  TO authenticated 
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can delete reservations" 
  ON reservations 
  FOR DELETE 
  TO authenticated 
  USING (true);

-- Add RLS Policies for blocked_dates
CREATE POLICY "Anyone can view blocked dates" 
  ON blocked_dates 
  FOR SELECT 
  TO anon, authenticated 
  USING (true);

CREATE POLICY "Only authenticated users can create blocked dates" 
  ON blocked_dates 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can update blocked dates" 
  ON blocked_dates 
  FOR UPDATE 
  TO authenticated 
  USING (true);

CREATE POLICY "Only authenticated users can delete blocked dates" 
  ON blocked_dates 
  FOR DELETE 
  TO authenticated 
  USING (true);