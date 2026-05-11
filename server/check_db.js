import 'dotenv/config';
import './config/env.js';
import { supabase } from './utils/supabase.js';

async function check() {
  const { data, error } = await supabase.from('profiles').select('*').limit(1);
  if (error) {
    console.error('Error fetching profiles:', error);
  } else {
    console.log('Profiles columns:', Object.keys(data[0] || {}));
  }
}

check();
