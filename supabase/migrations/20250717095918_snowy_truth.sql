/*
  # Remove pending status references

  1. Update RLS policies to only use 'reserved' and 'cancelled'
  2. Remove any references to 'pending' status
  3. Ensure enum consistency with reservation_status type
*/

-- Drop existing policies that might reference 'pending'
DROP POLICY IF EXISTS "Allow anon to cancel own reservation" ON reservations;
DROP POLICY IF EXISTS "Allow anon to view own reservation" ON reservations;
DROP POLICY IF EXISTS "Allow authenticated users full access" ON reservations;

-- Recreate policies without 'pending' references
CREATE POLICY "Allow anon to cancel own reservation"
  ON reservations
  FOR UPDATE
  TO anon
  USING (guest_email = current_setting('request.jwt.claims', true)::json->>'email' AND status = 'reserved')
  WITH CHECK (status = 'cancelled');

CREATE POLICY "Allow anon to view own reservation"
  ON reservations
  FOR SELECT
  TO anon
  USING (guest_email = current_setting('request.jwt.claims', true)::json->>'email');

CREATE POLICY "Allow authenticated users full access"
  ON reservations
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);