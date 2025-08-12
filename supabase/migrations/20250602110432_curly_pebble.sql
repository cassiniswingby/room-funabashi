-- Drop existing constraint if it exists
ALTER TABLE reservations
DROP CONSTRAINT IF EXISTS valid_reservation_date;

-- Create function for date validation
CREATE OR REPLACE FUNCTION validate_reservation_date()
RETURNS TRIGGER AS $$
BEGIN
  -- Only validate on INSERT or when reservation_date is being updated
  IF (TG_OP = 'INSERT') OR (TG_OP = 'UPDATE' AND OLD.reservation_date IS DISTINCT FROM NEW.reservation_date) THEN
    IF NEW.reservation_date < CURRENT_DATE OR 
       NEW.reservation_date > CURRENT_DATE + INTERVAL '3 months' THEN
      RAISE EXCEPTION 'Reservation date must be between today and 3 months from today';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if it exists
DROP TRIGGER IF EXISTS validate_reservation_date_trigger ON reservations;

-- Create trigger
CREATE TRIGGER validate_reservation_date_trigger
  BEFORE INSERT OR UPDATE ON reservations
  FOR EACH ROW
  EXECUTE FUNCTION validate_reservation_date();