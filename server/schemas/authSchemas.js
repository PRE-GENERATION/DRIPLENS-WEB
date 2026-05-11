import { z } from 'zod';

export const registerSchema = z.object({
  username:         z.string().min(3).max(30).regex(/^[a-zA-Z0-9_.]+$/, 'Alphanumeric, underscores, and dots only'),
  email:            z.string().email(),
  password:         z.string().min(8).max(72),
  role:             z.enum(['creator', 'brand']),
  brand_name:       z.string().optional(),
  instagram_handle: z.string().optional(),
  website:          z.string().optional(),
  contact_person:   z.string().optional(),
  phone_number:     z.string().optional(),
});

export const loginSchema = z.object({
  email:    z.string().min(1, 'Email or username is required'),
  password: z.string().min(1, 'Password is required')
});
