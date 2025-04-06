/*
  # Initial Schema for Diabetes Management App

  1. New Tables
    - `user_profiles`
      - User type (newly diagnosed or experienced)
      - Diagnosis date
      - Treatment plan
    
    - `blood_sugar_readings`
      - Blood sugar level
      - Reading time
      - Reading type (before meal, after meal, bedtime)
      - Notes
    
    - `medicine_logs`
      - Medicine name
      - Dosage
      - Time taken
      - Notes
    
    - `food_diary`
      - Food name
      - Carbohydrates
      - Calories
      - Meal type
      - Time consumed
    
    - `doctors`
      - Name
      - Specialization
      - Location
      - Contact information
    
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- User Profiles
CREATE TABLE user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  user_type text NOT NULL CHECK (user_type IN ('newly_diagnosed', 'experienced')),
  diagnosis_date date,
  treatment_plan text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view and update their own profile"
  ON user_profiles
  FOR ALL
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Blood Sugar Readings
CREATE TABLE blood_sugar_readings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  blood_sugar_level decimal NOT NULL,
  reading_type text NOT NULL CHECK (reading_type IN ('before_meal', 'after_meal', 'bedtime', 'fasting')),
  reading_time timestamptz NOT NULL DEFAULT now(),
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE blood_sugar_readings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own blood sugar readings"
  ON blood_sugar_readings
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Medicine Logs
CREATE TABLE medicine_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  medicine_name text NOT NULL,
  dosage text NOT NULL,
  taken_at timestamptz NOT NULL DEFAULT now(),
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE medicine_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own medicine logs"
  ON medicine_logs
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Food Diary
CREATE TABLE food_diary (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  food_name text NOT NULL,
  carbohydrates decimal,
  calories decimal,
  meal_type text NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  consumed_at timestamptz NOT NULL DEFAULT now(),
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE food_diary ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own food diary"
  ON food_diary
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Doctors Directory
CREATE TABLE doctors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  specialization text NOT NULL,
  location text NOT NULL,
  contact_email text,
  contact_phone text,
  address text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to view doctors
CREATE POLICY "Users can view doctors"
  ON doctors
  FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for better query performance
CREATE INDEX idx_blood_sugar_readings_user_time 
  ON blood_sugar_readings(user_id, reading_time);

CREATE INDEX idx_medicine_logs_user_time 
  ON medicine_logs(user_id, taken_at);

CREATE INDEX idx_food_diary_user_time 
  ON food_diary(user_id, consumed_at);

CREATE INDEX idx_doctors_location 
  ON doctors(location);