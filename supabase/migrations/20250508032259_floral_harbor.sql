/*
  # Initial schema for Room Funabashi booking system

  1. New Tables
    - `reservations`
      - `id` (uuid, primary key)
      - `start_date` (date)
      - `end_date` (date)
      - `guest_name` (text)
      - `guest_email` (text)
      - `num_guests` (integer)
      - `has_pets` (boolean)
      - `created_at` (timestamptz)
      - `status` (text, enum of pending/confirmed/cancelled)
      - `notes` (text, nullable)
    - `blocked_dates`
      - `id` (uuid, primary key)
      - `date` (date)
      - `reason` (text, nullable)
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on both tables
    - Add policies for authentication
    - Anonymous users can view and create reservations
    - Only authenticated admin users can update and delete reservations or blocked dates
*/

-- Create reservations table
CREATE TABLE IF NOT EXISTS reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  start_date date NOT NULL,
  end_date date NOT NULL,
  guest_name text NOT NULL,
  guest_email text NOT NULL,
  num_guests integer NOT NULL DEFAULT 1,
  has_pets boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  notes text
);

-- Create blocked_dates table
CREATE TABLE IF NOT EXISTS blocked_dates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL UNIQUE,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_dates ENABLE ROW LEVEL SECURITY;

-- Add RLS Policies for reservations
-- Anyone can view reservations (needed for availability checks)
CREATE POLICY "Anyone can view reservations" 
  ON reservations 
  FOR SELECT 
  TO anon, authenticated 
  USING (true);

-- Anyone can create new reservations
CREATE POLICY "Anyone can create reservations" 
  ON reservations 
  FOR INSERT 
  TO anon, authenticated 
  WITH CHECK (true);

-- Only authenticated users can update or delete reservations
CREATE POLICY "Only authenticated users can update reservations" 
  ON reservations 
  FOR UPDATE 
  TO authenticated 
  USING (true);

CREATE POLICY "Only authenticated users can delete reservations" 
  ON reservations 
  FOR DELETE 
  TO authenticated 
  USING (true);

-- Add RLS Policies for blocked_dates
-- Anyone can view blocked dates (needed for availability checks)
CREATE POLICY "Anyone can view blocked dates" 
  ON blocked_dates 
  FOR SELECT 
  TO anon, authenticated 
  USING (true);

-- Only authenticated users can manage blocked dates
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

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_reservations_dates 
  ON reservations (start_date, end_date);

CREATE INDEX IF NOT EXISTS idx_blocked_dates_date 
  ON blocked_dates (date);