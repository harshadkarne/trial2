/*
  # Create AmaVidya Database Schema

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `name` (text)
      - `username` (text, unique)
      - `email` (text)
      - `role` (text, check constraint for 'student' or 'teacher')
      - `grade` (text, nullable for students)
      - `subject` (text, nullable for teachers)
      - `avatar` (text, default 'boy1')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `student_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `total_xp` (integer, default 0)
      - `current_level` (integer, default 1)
      - `videos_watched` (integer, default 0)
      - `games_played` (integer, default 0)
      - `time_spent` (integer, default 0)
      - `current_streak` (integer, default 0)
      - `subjects` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `video_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `video_id` (text)
      - `watch_time` (integer)
      - `completed` (boolean, default false)
      - `completed_at` (timestamp, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `game_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `game_id` (text)
      - `score` (integer)
      - `time_spent` (integer)
      - `completed` (boolean, default false)
      - `completed_at` (timestamp, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for teachers to view student data
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  username text UNIQUE NOT NULL,
  email text,
  role text NOT NULL CHECK (role IN ('student', 'teacher')),
  grade text,
  subject text,
  avatar text DEFAULT 'boy1',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create student_progress table
CREATE TABLE IF NOT EXISTS student_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  total_xp integer DEFAULT 0,
  current_level integer DEFAULT 1,
  videos_watched integer DEFAULT 0,
  games_played integer DEFAULT 0,
  time_spent integer DEFAULT 0,
  current_streak integer DEFAULT 0,
  subjects jsonb DEFAULT '{"science": {"progress": 0, "xp": 0}, "mathematics": {"progress": 0, "xp": 0}, "technology": {"progress": 0, "xp": 0}, "engineering": {"progress": 0, "xp": 0}}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create video_progress table
CREATE TABLE IF NOT EXISTS video_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  video_id text NOT NULL,
  watch_time integer DEFAULT 0,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, video_id)
);

-- Create game_progress table
CREATE TABLE IF NOT EXISTS game_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  game_id text NOT NULL,
  score integer DEFAULT 0,
  time_spent integer DEFAULT 0,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, game_id)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_progress ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Teachers can read all student data"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'teacher'
    )
  );

-- Student progress policies
CREATE POLICY "Students can read own progress"
  ON student_progress
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Students can update own progress"
  ON student_progress
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Teachers can read all student progress"
  ON student_progress
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'teacher'
    )
  );

-- Video progress policies
CREATE POLICY "Students can manage own video progress"
  ON video_progress
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Teachers can read all video progress"
  ON video_progress
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'teacher'
    )
  );

-- Game progress policies
CREATE POLICY "Students can manage own game progress"
  ON game_progress
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Teachers can read all game progress"
  ON game_progress
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'teacher'
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_student_progress_user_id ON student_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_video_progress_user_id ON video_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_game_progress_user_id ON game_progress(user_id);