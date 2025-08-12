/*
  # Add status column to reservations table

  1. Changes
    - Add 'status' column to reservations table with type TEXT
    - Add check constraint to ensure valid status values
    - Set default value to 'pending'
    - Backfill existing rows with 'pending' status
*/

-- First create an enum type for reservation status
DO $$ BEGIN
  CREATE TYPE reservation_status AS ENUM ('pending', 'confirmed', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Add status column if it doesn't exist
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'reservations' AND column_name = 'status'
  ) THEN
    -- Add the column with a default value
    ALTER TABLE reservations 
    ADD COLUMN status TEXT NOT NULL DEFAULT 'pending';

    -- Add check constraint to ensure valid values
    ALTER TABLE reservations 
    ADD CONSTRAINT reservations_status_check 
    CHECK (status IN ('pending', 'confirmed', 'cancelled'));
  END IF;
END $$;