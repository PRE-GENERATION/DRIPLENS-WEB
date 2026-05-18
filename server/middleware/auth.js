import { supabase } from '../utils/supabase.js';
import { unauthorized, forbidden } from '../utils/AppError.js';
import { env } from '../config/env.js';
import logger from '../utils/logger.js';
import fs from 'fs';
import path from 'path';

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const _isLocalAuth = env.SUPABASE_URL.includes('dummy');
const USERS_FILE = path.resolve(__dirname, '..', 'users.json');

const readUsers = () => {
  if (fs.existsSync(USERS_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
    } catch { return []; }
  }
  return [];
};

export const requireAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return next(unauthorized('Authentication token required'));

  try {
    // Always try local-token first — supports hybrid dev mode (local auth + real Supabase DB)
    if (token.startsWith('local-token-')) {
      const userId = token.replace('local-token-', '');
      const users = readUsers();
      const user = users.find(u => u.id === userId);
      
      if (!user) return next(unauthorized('Invalid local token'));
      
      req.user = {
        id:    user.id,
        email: user.email,
        role:  user.role
      };
      return next();
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return next(unauthorized('Invalid or expired token'));

    req.user = {
      id:    user.id,
      email: user.email,
      role:  user.user_metadata?.role
    };
    next();
  } catch (err) {
    logger.error('Auth middleware error', { error: err.message });
    next(err);
  }
};

export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(forbidden(`Access denied. Requires role: ${roles.join(' or ')}`));
  }
  next();
};

// Aliases for compatibility
export const protect = requireAuth;
export const restrictTo = requireRole;
