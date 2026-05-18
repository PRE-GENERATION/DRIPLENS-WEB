import { supabase } from '../utils/supabase.js';
import { conflict, unauthorized, AppError } from '../utils/AppError.js';
import { env } from '../config/env.js';
import fs from 'fs';
import path from 'path';

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Local File-Based Auth (Fallback when no real Supabase) ---
const USERS_FILE = path.resolve(__dirname, '..', 'users.json');
const isLocalAuth = env.SUPABASE_URL.includes('dummy');

const readUsers = () => {
  if (fs.existsSync(USERS_FILE)) {
    try { return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8')); }
    catch { return []; }
  }
  return [];
};

const writeUsers = (users) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
};

// ─── REGISTER ────────────────────────────────────────────────────────────────

export const register = async ({ username, email, password, role, brand_name, instagram_handle, website, contact_person, phone_number }) => {

  // Local fallback
  if (isLocalAuth) {
    const users = readUsers();
    if (users.find(u => u.email === email)) throw conflict('Email already in use');
    const newUser = { id: Date.now().toString(), username, email, password, role, onboarding_complete: false };
    users.push(newUser);
    writeUsers(users);
    return {
      access_token: 'local-token-' + newUser.id,
      user: { id: newUser.id, username, email, role, onboarding_complete: false }
    };
  }

  // Create user in Supabase Auth
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    user_metadata: { username, role, brand_name, instagram_handle, website, contact_person, phone_number, onboarding_complete: false },
    email_confirm: true
  });

  if (error) {
    if (error.message.includes('already registered')) throw conflict('Email already in use');
    throw new AppError(error.message, 500, 'SUPABASE_ERROR');
  }

  // Write to profiles table
  const { error: profileError } = await supabase.from('profiles').upsert({
    id:               data.user.id,
    username,
    role,
    brand_name:       brand_name || null,
    instagram_handle: instagram_handle || null,
    website:          website || null,
    contact_person:   contact_person || null,
    phone_number:     phone_number || null,
    onboarding_complete: false,
  }, { onConflict: 'id' });

  if (profileError) throw new AppError('Profile insert failed: ' + profileError.message, 500, 'DB_ERROR');

  // Sign in immediately to get session tokens
  const { data: sessionData, error: sessionError } = await supabase.auth.signInWithPassword({ email, password });
  if (sessionError) throw new AppError(sessionError.message, 500, 'SESSION_ERROR');

  return {
    access_token:  sessionData.session.access_token,
    refresh_token: sessionData.session.refresh_token,
    user: {
      id:                  sessionData.user.id,
      email:               sessionData.user.email,
      username:            sessionData.user.user_metadata?.username || username,
      role:                sessionData.user.user_metadata?.role || role,
      onboarding_complete: sessionData.user.user_metadata?.onboarding_complete || false,
    }
  };
};

// ─── LOGIN ────────────────────────────────────────────────────────────────────

export const login = async ({ email: identifier, password }) => {

  // Local fallback
  if (isLocalAuth) {
    const users = readUsers();
    const user = users.find(u =>
      (u.email === identifier || u.username === identifier) && u.password === password
    );
    if (!user) throw unauthorized('Invalid email or password');
    return {
      access_token: 'local-token-' + user.id,
      user: { id: user.id, username: user.username, email: user.email, role: user.role, onboarding_complete: user.onboarding_complete || false }
    };
  }

  // Support username login — look up email first
  let loginEmail = identifier;
  if (!identifier.includes('@')) {
    const { data: profile } = await supabase.from('profiles').select('id').eq('username', identifier).single();
    if (profile) {
      const { data: userRec } = await supabase.auth.admin.getUserById(profile.id);
      if (userRec?.user) loginEmail = userRec.user.email;
    }
  }

  console.log('LOGIN ATTEMPT:', loginEmail);
  const { data, error } = await supabase.auth.signInWithPassword({ email: loginEmail, password });
  console.log('SUPABASE LOGIN ERROR:', error);
  console.log('SUPABASE LOGIN DATA:', data?.user?.id);
  if (error) throw unauthorized('Invalid email or password');

  // Also fetch profile to get onboarding_complete (more reliable than user_metadata)
  const { data: profile } = await supabase
    .from('profiles')
    .select('onboarding_complete, username, role')
    .eq('id', data.user.id)
    .single();

  return {
    access_token:  data.session.access_token,
    refresh_token: data.session.refresh_token,
    user: {
      id:                  data.user.id,
      email:               data.user.email,
      username:            profile?.username || data.user.user_metadata?.username,
      role:                profile?.role || data.user.user_metadata?.role,
      onboarding_complete: profile?.onboarding_complete ?? data.user.user_metadata?.onboarding_complete ?? false,
    }
  };
};

// ─── REFRESH TOKEN ────────────────────────────────────────────────────────────

export const refreshToken = async (refresh_token) => {
  if (isLocalAuth) {
    return { access_token: 'local-token-refreshed', expires_in: 3600 };
  }
  const { data, error } = await supabase.auth.refreshSession({ refresh_token });
  if (error) throw unauthorized('Invalid refresh token');
  return {
    access_token:  data.session.access_token,
    refresh_token: data.session.refresh_token,
    expires_in:    data.session.expires_in
  };
};
