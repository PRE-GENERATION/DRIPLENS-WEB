import { z } from 'zod';

// Valid creative categories — must stay in sync with:
//   • OnboardingPage.jsx  CATEGORIES array
//   • UploadPage.jsx      category <select> options
//   • EditProfilePage.jsx CATEGORIES array
//   • portfolio_items.category column (max 50 chars)
export const ALLOWED_CATEGORIES = [
  'Cinematography', 'Photography', '3D Motion', 'Design',
  'Illustration', 'Animation', 'Graphic Design', 'VFX'
];

export const uploadMetaSchema = z.object({
  title:       z.string().min(1).max(100),
  description: z.string().max(500).nullable().optional(),
  category:    z.enum(ALLOWED_CATEGORIES),
  project_id:  z.string().uuid().optional()
});

export const createPortfolioProjectSchema = z.object({
  title:       z.string().min(1).max(100),
  description: z.string().max(2000).nullable().optional(),
  category:    z.enum(ALLOWED_CATEGORIES)
});

export const updatePortfolioProjectSchema = z.object({
  title:       z.string().min(1).max(100).optional(),
  description: z.string().max(2000).nullable().optional(),
  category:    z.enum(ALLOWED_CATEGORIES).optional()
});

export const ALLOWED_MIME_TYPES = [
  'image/jpeg', 'image/png', 'image/webp', 'image/gif',
  'video/mp4', 'video/quicktime', 'video/webm',
  'application/pdf', 'application/msword', 
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

export const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB
