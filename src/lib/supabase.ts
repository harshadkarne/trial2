import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface User {
  id: string;
  name: string;
  username: string;
  email?: string;
  role: 'student' | 'teacher';
  grade?: string;
  subject?: string;
  avatar: string;
  created_at: string;
  updated_at: string;
}

export interface StudentProgress {
  id: string;
  user_id: string;
  total_xp: number;
  current_level: number;
  videos_watched: number;
  games_played: number;
  time_spent: number;
  current_streak: number;
  subjects: {
    science: { progress: number; xp: number };
    mathematics: { progress: number; xp: number };
    technology: { progress: number; xp: number };
    engineering: { progress: number; xp: number };
  };
  created_at: string;
  updated_at: string;
}

export interface VideoProgress {
  id: string;
  user_id: string;
  video_id: string;
  watch_time: number;
  completed: boolean;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface GameProgress {
  id: string;
  user_id: string;
  game_id: string;
  score: number;
  time_spent: number;
  completed: boolean;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

// Auth functions
export const signUp = async (userData: {
  name: string;
  username: string;
  email?: string;
  password: string;
  role: 'student' | 'teacher';
  grade?: string;
  subject?: string;
}) => {
  const { data, error } = await supabase.auth.signUp({
    email: userData.email || `${userData.username}@amavidya.local`,
    password: userData.password,
    options: {
      data: {
        name: userData.name,
        username: userData.username,
        role: userData.role,
        grade: userData.grade,
        subject: userData.subject,
        avatar: 'boy1'
      }
    }
  });

  if (error) throw error;

  // Create user profile
  if (data.user) {
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: data.user.id,
        name: userData.name,
        username: userData.username,
        email: userData.email,
        role: userData.role,
        grade: userData.grade,
        subject: userData.subject,
        avatar: 'boy1'
      });

    if (profileError) throw profileError;

    // Create initial progress for students
    if (userData.role === 'student') {
      const { error: progressError } = await supabase
        .from('student_progress')
        .insert({
          user_id: data.user.id,
          total_xp: 0,
          current_level: 1,
          videos_watched: 0,
          games_played: 0,
          time_spent: 0,
          current_streak: 0,
          subjects: {
            science: { progress: 0, xp: 0 },
            mathematics: { progress: 0, xp: 0 },
            technology: { progress: 0, xp: 0 },
            engineering: { progress: 0, xp: 0 }
          }
        });

      if (progressError) throw progressError;
    }
  }

  return data;
};

export const signIn = async (username: string, password: string) => {
  // First get user by username
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('email')
    .eq('username', username)
    .single();

  if (userError) throw new Error('User not found');

  const { data, error } = await supabase.auth.signInWithPassword({
    email: userData.email || `${username}@amavidya.local`,
    password: password
  });

  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// User functions
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) throw error;
  return profile;
};

export const updateUserAvatar = async (userId: string, avatar: string) => {
  const { error } = await supabase
    .from('users')
    .update({ avatar, updated_at: new Date().toISOString() })
    .eq('id', userId);

  if (error) throw error;
};

// Progress functions
export const getStudentProgress = async (userId: string) => {
  const { data, error } = await supabase
    .from('student_progress')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data;
};

export const updateStudentProgress = async (userId: string, progress: Partial<StudentProgress>) => {
  const { error } = await supabase
    .from('student_progress')
    .update({ ...progress, updated_at: new Date().toISOString() })
    .eq('user_id', userId);

  if (error) throw error;
};

export const recordVideoProgress = async (userId: string, videoId: string, watchTime: number, completed: boolean) => {
  const { error } = await supabase
    .from('video_progress')
    .upsert({
      user_id: userId,
      video_id: videoId,
      watch_time: watchTime,
      completed,
      completed_at: completed ? new Date().toISOString() : null,
      updated_at: new Date().toISOString()
    });

  if (error) throw error;
};

export const recordGameProgress = async (userId: string, gameId: string, score: number, timeSpent: number) => {
  const { error } = await supabase
    .from('game_progress')
    .upsert({
      user_id: userId,
      game_id: gameId,
      score,
      time_spent: timeSpent,
      completed: true,
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

  if (error) throw error;
};

// Teacher functions
export const getAllStudents = async () => {
  const { data, error } = await supabase
    .from('users')
    .select(`
      *,
      student_progress (*)
    `)
    .eq('role', 'student');

  if (error) throw error;
  return data;
};

export const getStudentVideoProgress = async (userId: string) => {
  const { data, error } = await supabase
    .from('video_progress')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;
  return data;
};

export const getStudentGameProgress = async (userId: string) => {
  const { data, error } = await supabase
    .from('game_progress')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;
  return data;
};