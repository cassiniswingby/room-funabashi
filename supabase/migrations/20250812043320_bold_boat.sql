/*
  # Add index for reservation_date cleanup

  1. Performance
    - Add index on `reservation_date` column for efficient cleanup queries
    - Improves performance of date-based filtering and deletion operations

  2. Security
    - Add explicit policy for service role to delete old reservations
    - Ensures cleanup function can bypass RLS with service role key
*/

-- Add index on reservation_date for efficient cleanup queries
CREATE INDEX IF NOT EXISTS idx_reservations_cleanup_date 
ON public.reservations (reservation_date) 
WHERE reservation_date < CURRENT_DATE;

-- Add explicit policy for service role to delete reservations
CREATE POLICY "Service role can delete old reservations"
  ON public.reservations
  FOR DELETE
  TO service_role
  USING (true);