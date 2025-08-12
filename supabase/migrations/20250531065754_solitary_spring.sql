/*
  # Add reservation status column

  1. Changes
    - Add `status` column to `reservations` table with default value 'confirmed'
    - Add check constraint to ensure status is one of: 'confirmed', 'cancelled', 'pending'
    - Update existing rows to have 'confirmed' status
  
  2. Security
    - No changes to RLS policies needed as existing policies cover the new column
*/

ALTER TABLE reservations 
ADD COLUMN status text NOT NULL DEFAULT 'confirmed'
CHECK (status IN ('confirmed', 'cancelled', 'pending'));