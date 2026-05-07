import { supabase } from '../utils/supabase.js';
import { AppError } from '../utils/AppError.js';
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE } from '../schemas/uploadSchemas.js';
import { v4 as uuidv4 } from 'uuid';
import { env } from '../config/env.js';
import fs from 'fs';
import path from 'path';

export const validateFile = (file) => {
  if (!file) throw new AppError('No file uploaded', 400, 'NO_FILE');
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    throw new AppError(
      `File type not allowed. Allowed: ${ALLOWED_MIME_TYPES.join(', ')}`,
      415,
      'INVALID_FILE_TYPE'
    );
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new AppError('File too large. Maximum size is 50MB', 413, 'FILE_TOO_LARGE');
  }
};

export const uploadPortfolio = async (userId, file, { title, description, category }) => {
  validateFile(file);

  const ext = file.originalname.split('.').pop().toLowerCase();
  const safeName = `${userId}_${uuidv4()}.${ext}`;   // UUID prevents path guessing
  const filePath = `portfolio/${safeName}`;

  if (env.SUPABASE_URL.includes('dummy')) {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    
    fs.writeFileSync(path.join(uploadDir, safeName), file.buffer);
    const publicUrl = `http://localhost:${env.PORT || 5001}/uploads/${safeName}`;

    const dbPath = path.join(process.cwd(), 'portfolio.json');
    let items = [];
    if (fs.existsSync(dbPath)) items = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

    const newItem = {
      id: uuidv4(),
      creator_id: userId,
      title,
      description: description || null,
      category,
      media_url: publicUrl,
      media_type: file.mimetype.startsWith('video') ? 'video' : 'image',
      created_at: new Date().toISOString()
    };
    
    items.push(newItem);
    fs.writeFileSync(dbPath, JSON.stringify(items, null, 2));
    
    return newItem;
  }

  const { error: uploadError } = await supabase.storage
    .from('DripLens upload')
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      cacheControl: '31536000',
      upsert: false,
    });

  // FIX: wrap raw Supabase storage error in AppError so errorHandler formats it
  //      consistently instead of leaking the raw Supabase error object to the client
  if (uploadError) {
    throw new AppError(
      uploadError.message || 'Storage upload failed',
      500,
      'STORAGE_UPLOAD_FAILED'
    );
  }

  const { data: { publicUrl } } = supabase.storage
    .from('DripLens upload')
    .getPublicUrl(filePath);

  const { data, error: dbError } = await supabase
    .from('portfolio_items')
    .insert({
      creator_id: userId,
      title,
      description: description || null,
      category,
      media_url: publicUrl,
      media_type: file.mimetype.startsWith('video') ? 'video' : 'image',
      storage_path: filePath,
    })
    .select()
    .single();

  if (dbError) {
    // Attempt cleanup — don't leave orphaned storage objects on DB failure
    await supabase.storage.from('DripLens upload').remove([filePath]);
    throw new AppError(dbError.message || 'Database insert failed', 500, 'DB_INSERT_FAILED');
  }

  return data;
};

export const uploadProfileImage = async (userId, file, type) => {
  validateFile(file);

  const ext = file.originalname.split('.').pop().toLowerCase();
  const safeName = `${userId}_${type}_${uuidv4()}.${ext}`;
  const filePath = `images/${safeName}`;

  if (env.SUPABASE_URL.includes('dummy')) {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    fs.writeFileSync(path.join(uploadDir, safeName), file.buffer);
    const publicUrl = `http://localhost:${env.PORT || 5001}/uploads/${safeName}`;
    return { publicUrl, storagePath: filePath };
  }

  const { error: uploadError } = await supabase.storage
    .from('DripLens')
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      cacheControl: '3600',
      upsert: true,
    });

  // FIX: same AppError wrapping as above
  if (uploadError) {
    throw new AppError(
      uploadError.message || 'Profile image upload failed',
      500,
      'STORAGE_UPLOAD_FAILED'
    );
  }

  const { data: { publicUrl } } = supabase.storage
    .from('DripLens')
    .getPublicUrl(filePath);

  return { publicUrl, storagePath: filePath };
};

/**
 * Upload a deliverable file for a project to Supabase Storage.
 * Path: deliverables/{projectId}/{userId}_{uuid}.{ext}
 * Returns { publicUrl, storagePath }.
 */
export const uploadDeliverable = async (userId, projectId, file) => {
  validateFile(file);

  const ext      = file.originalname.split('.').pop().toLowerCase();
  const safeName = `${userId}_${uuidv4()}.${ext}`;
  const filePath = `deliverables/${projectId}/${safeName}`;

  if (env.SUPABASE_URL.includes('dummy')) {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'deliverables', projectId);
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    fs.writeFileSync(path.join(uploadDir, safeName), file.buffer);
    const publicUrl = `http://localhost:${env.PORT || 5001}/uploads/deliverables/${projectId}/${safeName}`;
    return { publicUrl, storagePath: filePath };
  }

  const { error: uploadError } = await supabase.storage
    .from('DripLens upload')
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    throw new AppError(uploadError.message || 'Deliverable upload failed', 500, 'STORAGE_UPLOAD_FAILED');
  }

  const { data: { publicUrl } } = supabase.storage
    .from('DripLens upload')
    .getPublicUrl(filePath);

  return { publicUrl, storagePath: filePath };
};

export const listPortfolio = async ({ page = 1, limit = 10, creator_id }) => {
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;
  const from = (pageNum - 1) * limitNum;
  const to = from + limitNum - 1;

  if (env.SUPABASE_URL.includes('dummy')) {
    const dbPath = path.join(process.cwd(), 'portfolio.json');
    let items = [];
    if (fs.existsSync(dbPath)) items = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

    if (creator_id) {
      items = items.filter(i => i.creator_id === creator_id);
    }
    
    // Sort descending by created_at
    items.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    const total = items.length;
    const paginatedItems = items.slice(from, to + 1);

    return {
      items: paginatedItems,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: total,
        totalPages: Math.ceil(total / limitNum)
      }
    };
  }

  let query = supabase
    .from('portfolio_items')
    .select('*, author:profiles(username, avatar_url)', { count: 'exact' });

  if (creator_id) {
    query = query.eq('creator_id', creator_id);
  }

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw error;

  return {
    items: data,
    pagination: { 
      page: pageNum, 
      limit: limitNum, 
      total: count, 
      totalPages: Math.ceil(count / limitNum) 
    },
  };
};