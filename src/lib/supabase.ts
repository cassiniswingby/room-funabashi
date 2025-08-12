import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Configure Supabase client with additional options for WebContainer environment
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Ensure we're using the same protocol as the app
    flowType: 'pkce',
    detectSessionInUrl: false,
    persistSession: true,
    autoRefreshToken: true
  },
  global: {
    // Add custom headers to handle CORS in WebContainer
    headers: {
      'X-Client-Info': 'supabase-js/2.x',
    }
  }
});