import { createClient } from '@supabase/supabase-js';

// Get credentials from env or local storage
const getSavedConfig = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const localUrl = localStorage.getItem('trip_supabase_url');
  const localKey = localStorage.getItem('trip_supabase_key');

  return {
    url: localUrl || envUrl || '',
    key: localKey || envKey || ''
  };
};

const config = getSavedConfig();
export const isSupabaseConnected = Boolean(config.url && config.key && !config.url.includes('YOUR_'));

export const supabase = isSupabaseConnected
  ? createClient(config.url, config.key)
  : null;

// Helper to save user-defined Supabase config
export const saveSupabaseConfig = (url, key) => {
  if (url) localStorage.setItem('trip_supabase_url', url.trim());
  if (key) localStorage.setItem('trip_supabase_key', key.trim());
  window.location.reload();
};

export const clearSupabaseConfig = () => {
  localStorage.removeItem('trip_supabase_url');
  localStorage.removeItem('trip_supabase_key');
  window.location.reload();
};

// User Profile & Auth Helper
export const getCurrentUser = async () => {
  if (isSupabaseConnected && supabase) {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      return {
        id: session.user.id,
        email: session.user.email,
        name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
        avatar: session.user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.email}`,
        isSupabase: true
      };
    }
  }

  // Local storage demo fallback user
  const demoUser = localStorage.getItem('trip_demo_user');
  if (demoUser) {
    try {
      return JSON.parse(demoUser);
    } catch {
      // fallback
    }
  }
  return null;
};

// Sign in with Google (Supabase Auth)
export const signInWithGoogle = async () => {
  if (isSupabaseConnected && supabase) {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) throw error;
  } else {
    // Demo Mode Google Auth Simulation
    const mockGoogleUser = {
      id: 'demo-user-' + Math.floor(Math.random() * 10000),
      email: 'member20@gmail.com',
      name: 'Thành viên Đoàn 20',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      isSupabase: false
    };
    localStorage.setItem('trip_demo_user', JSON.stringify(mockGoogleUser));
    return mockGoogleUser;
  }
};

// Custom Name sign in for Demo
export const signInDemoUser = (name, email) => {
  const user = {
    id: 'demo-' + Date.now(),
    email: email || `${name.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
    name: name || 'Thành viên 20',
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
    isSupabase: false
  };
  localStorage.setItem('trip_demo_user', JSON.stringify(user));
  return user;
};

export const signOutUser = async () => {
  if (isSupabaseConnected && supabase) {
    await supabase.auth.signOut();
  }
  localStorage.removeItem('trip_demo_user');
  window.location.reload();
};
