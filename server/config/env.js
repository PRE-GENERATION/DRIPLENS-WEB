import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

const localEnvPath = path.join(process.cwd(), '.env');
const serverEnvPath = path.join(process.cwd(), 'server', '.env');

if (fs.existsSync(localEnvPath)) {
  dotenv.config({ path: localEnvPath });
} else if (fs.existsSync(serverEnvPath)) {
  dotenv.config({ path: serverEnvPath });
} else {
  dotenv.config();
}

import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  // FIX: was 5001 — must match server/.env.example PORT=5000
  PORT: z.string().default('5000'),
  CLIENT_URL: z.string().optional().default('*'),
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(10),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  SB_PUBLISHABLE_KEY: z.string().optional(),
  SB_SECRET_KEY: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

export let envError = null;
export let env = {};

if (!parsed.success) {
  envError = parsed.error.format();
  console.error('❌ Invalid environment variables:\n', envError);
  
  if (process.env.VERCEL) {
    // On Vercel, let the function start so it can respond with a informative JSON error instead of crashing the deployment.
    // Populate defaults so client doesn't crash on undefined properties of env
    env = {
      NODE_ENV: 'production',
      PORT: '5000',
      CLIENT_URL: '*',
      SUPABASE_URL: 'https://placeholder.supabase.co',
      SUPABASE_SERVICE_ROLE_KEY: 'placeholder-key',
      LOG_LEVEL: 'error'
    };
  } else {
    process.exit(1);
  }
} else {
  env = parsed.data;
}
