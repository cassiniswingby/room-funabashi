-- Drop existing constraint
ALTER TABLE reservations
DROP CONSTRAINT IF EXISTS valid_reservation_date;

-- Add new constraint with 3 months interval
ALTER TABLE reservations
ADD CONSTRAINT valid_reservation_date
CHECK (
  reservation_date >= CURRENT_DATE AND 
  reservation_date <= CURRENT_DATE + INTERVAL '3 months'
);