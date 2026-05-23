import 'dotenv/config';
import './config/env.js';
import { supabase } from './utils/supabase.js';

async function check() {
  const { data, error } = await supabase.from('verification_otps').select('*').limit(1);
  if (error) {
    console.error('Error fetching verification_otps:', error);
  } else {
    console.log('verification_otps table exists! Row:', data);
  }
}

check();
