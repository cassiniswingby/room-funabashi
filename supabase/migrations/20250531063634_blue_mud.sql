-- Add time columns to blocked_dates table
ALTER TABLE blocked_dates
  ADD COLUMN IF NOT EXISTS start_time time,
  ADD COLUMN IF NOT EXISTS end_time time;

-- Add check constraint to ensure both times are provided if one is
ALTER TABLE blocked_dates
  ADD CONSTRAINT valid_block_times
  CHECK (
    (start_time IS NULL AND end_time IS NULL) OR
    (start_time IS NOT NULL AND end_time IS NOT NULL)
  );

-- Update the time slot conflict checking function to consider blocked times
CREATE OR REPLACE FUNCTION check_time_slot_conflict()
RETURNS TRIGGER AS $$
DECLARE
  conflicting_reservation_exists BOOLEAN;
  conflicting_block_exists BOOLEAN;
  new_start_time TIME;
  new_end_time TIME;
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

  -- Check for conflicts with other reservations
  SELECT EXISTS (
    SELECT 1 
    FROM reservations r
    WHERE r.reservation_date = NEW.reservation_date
    AND r.id != NEW.id
    AND r.status != 'cancelled'
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

  -- Check for conflicts with blocked times
  SELECT EXISTS (
    SELECT 1 
    FROM blocked_dates b
    WHERE b.date = NEW.reservation_date
    AND (
      -- If block has no times, entire day is blocked
      (b.start_time IS NULL AND b.end_time IS NULL) OR
      -- Otherwise check time overlap
      (b.start_time < new_end_time AND b.end_time > new_start_time)
    )
  ) INTO conflicting_block_exists;

  IF conflicting_reservation_exists THEN
    RAISE EXCEPTION 'Time slot conflict detected with another reservation';
  END IF;

  IF conflicting_block_exists THEN
    RAISE EXCEPTION 'Time slot conflict detected with blocked period';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;