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

// ─── VERIFICATION OTP ─────────────────────────────────────────────────────────

export const sendVerificationOtp = async (email) => {
  if (isLocalAuth) {
    console.log('MOCK Send Verification OTP for email:', email);
    return { success: true };
  }

  // 1. Generate 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expires_at = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 mins expiry

  console.log(`[Verification OTP] Generated code: ${code} for email: ${email}`);

  // 2. Upsert to verification_otps table
  const { error } = await supabase.from('verification_otps').upsert({
    email,
    code,
    expires_at
  }, { onConflict: 'email' });

  if (error) {
    console.error('Error saving OTP to DB:', error);
    throw new AppError('Failed to generate verification code.', 500, 'DB_ERROR');
  }

  // 3. Send email via Resend API
  const resendApiKey = process.env.RESEND_API_KEY || env.RESEND_API_KEY;
  if (!resendApiKey) {
    console.warn('RESEND_API_KEY is not configured.');
    throw new AppError('Email service is not configured on the server.', 500, 'CONFIG_ERROR');
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Driplens <onboarding@resend.dev>',
        to: [email],
        subject: 'Driplens Verification Code',
        html: `
          <div style="font-family: sans-serif; padding: 24px; max-width: 600px; margin: 0 auto; border: 2px solid #000; background-color: #ffffff;">
            <h2 style="text-transform: uppercase; letter-spacing: -1px; font-weight: 900; font-size: 24px; margin-bottom: 16px; color: #000;">Driplens Verification</h2>
            <p style="font-size: 14px; color: #666; margin-bottom: 24px;">Please use the following 6-digit code to verify your brand account:</p>
            <div style="font-size: 32px; font-weight: 900; letter-spacing: 4px; padding: 16px; background-color: #f5f5f5; border: 2px solid #000; text-align: center; margin-bottom: 24px; color: #0044ff;">
              ${code}
            </div>
            <p style="font-size: 11px; color: #999;">This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
          </div>
        `
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('Resend API error response:', errText);
      throw new Error(errText);
    }
  } catch (err) {
    console.error('Error sending email via Resend:', err);
    throw new AppError('Failed to send verification email: ' + err.message, 500, 'EMAIL_ERROR');
  }

  return { success: true };
};

export const verifyVerificationOtp = async (email, code, userId) => {
  if (isLocalAuth) {
    console.log('MOCK Verify Verification OTP for email:', email, 'code:', code);
    return { success: true };
  }

  // 1. Fetch OTP from DB
  const { data, error } = await supabase
    .from('verification_otps')
    .select('code, expires_at')
    .eq('email', email)
    .single();

  if (error || !data) {
    throw new AppError('No verification code found for this email. Please request a new one.', 400, 'VERIFY_ERROR');
  }

  // 2. Validate expiry
  if (new Date(data.expires_at) < new Date()) {
    throw new AppError('Verification code has expired. Please request a new one.', 400, 'EXPIRED_ERROR');
  }

  // 3. Validate code
  if (data.code !== code) {
    throw new AppError('Invalid verification code.', 400, 'INVALID_ERROR');
  }

  // 4. Update user profile to is_verified: true
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ is_verified: true })
    .eq('id', userId);

  if (profileError) {
    console.error('Error updating profile verification:', profileError);
    throw new AppError('Failed to update verification status.', 500, 'DB_ERROR');
  }

  // 5. Delete the OTP code so it cannot be reused
  await supabase.from('verification_otps').delete().eq('email', email);

  return { success: true };
};
