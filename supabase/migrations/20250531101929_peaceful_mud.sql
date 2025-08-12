-- Drop existing table if it exists
DROP TABLE IF EXISTS blocked_dates;

-- Recreate blocked_dates table with correct structure
CREATE TABLE blocked_dates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  start_time time,
  end_time time,
  reason text,
  created_at timestamptz DEFAULT now(),
  
  -- Add constraint to ensure both start_time and end_time are either both null or both set
  CONSTRAINT valid_time_range CHECK (
    (start_time IS NULL AND end_time IS NULL) OR
    (start_time IS NOT NULL AND end_time IS NOT NULL)
  )
);

-- Enable Row Level Security
ALTER TABLE blocked_dates ENABLE ROW LEVEL SECURITY;

-- Create index on date for better performance
CREATE INDEX idx_blocked_dates_date ON blocked_dates(date);

-- Add RLS Policies
CREATE POLICY "Anyone can view blocked dates" 
  ON blocked_dates 
  FOR SELECT 
  TO anon, authenticated 
  USING (true);

CREATE POLICY "Only authenticated users can create blocked dates" 
  ON blocked_dates 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can update blocked dates" 
  ON blocked_dates 
  FOR UPDATE 
  TO authenticated 
  USING (true);

CREATE POLICY "Only authenticated users can delete blocked dates" 
  ON blocked_dates 
  FOR DELETE 
  TO authenticated 
  USING (true);