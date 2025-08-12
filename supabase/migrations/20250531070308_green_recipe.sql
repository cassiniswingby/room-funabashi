/*
  # Add custom time columns to reservations table

  1. Changes
    - Add `custom_start_time` and `custom_end_time` columns to `reservations` table
      - Both columns are nullable time fields for custom reservation plans
      - Used when plan_type is 'custom' to specify exact start and end times

  2. Notes
    - Both columns are nullable since they are only used for custom plans
    - Using `time without time zone` to match the format used in blocked_dates table
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'reservations' AND column_name = 'custom_start_time'
  ) THEN
    ALTER TABLE reservations 
    ADD COLUMN custom_start_time time without time zone,
    ADD COLUMN custom_end_time time without time zone;
  END IF;
END $$;