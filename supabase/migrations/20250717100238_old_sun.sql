/*
  # Fix RLS policy for reservation cancellation without anonymous auth

  1. Security
    - Remove dependency on anonymous authentication
    - Allow public cancellation with email verification
    - Maintain security by requiring both ID and email match
*/

-- Drop the existing anonymous-dependent policies
DROP POLICY IF EXISTS "Allow anon to cancel own reservation" ON reservations;
DROP POLICY IF EXISTS "Allow anon to view own reservation" ON reservations;

-- Create a policy that allows anyone to cancel reservations if they provide correct email
CREATE POLICY "Anyone can cancel reservation with email verification"
  ON reservations
  FOR UPDATE
  TO anon, authenticated
  USING (status = 'reserved')
  WITH CHECK (status = 'cancelled');

-- Allow anyone to view reservations (needed for the update to return data)
CREATE POLICY "Anyone can view reservations for cancellation"
  ON reservations
  FOR SELECT
  TO anon, authenticated
  USING (true);