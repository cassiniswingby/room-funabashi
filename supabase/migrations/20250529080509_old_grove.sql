-- Ensure reservation_date is of type date
ALTER TABLE reservations
  ALTER COLUMN reservation_date TYPE date USING reservation_date::date;

-- Ensure blocked_dates.date is of type date
ALTER TABLE blocked_dates
  ALTER COLUMN date TYPE date USING date::date;