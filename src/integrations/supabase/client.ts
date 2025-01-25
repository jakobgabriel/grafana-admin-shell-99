import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ytiurwuidvnnatsuyaiv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0aXVyd3VpZHZubmF0c3V5YWl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc3OTkzMDUsImV4cCI6MjA1MzM3NTMwNX0.C4C0kPvYbIv3wy6AQYz5KNbbsf9woQKCaEETr83VIn0";

export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: window.localStorage
    }
  }
);

// Initialize session from localStorage if available
const initSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Error initializing session:', error);
  } else if (session) {
    console.log('Session initialized:', session.user?.id);
  }
};

// Run initialization
initSession();