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

export const uploadPortfolio = async (userId, file, { title, description, category, project_id }) => {
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
      created_at: new Date().toISOString(),
      project_id: project_id || null
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
      project_id: project_id || null,
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

    // Group items by project_id in dummy mode
    const projectsMap = {};
    items.forEach(item => {
      const pid = item.project_id || 'no-project';
      if (!projectsMap[pid]) {
        projectsMap[pid] = {
          id: pid,
          title: item.title, // fallback
          category: item.category,
          creator_id: item.creator_id,
          created_at: item.created_at,
          items: []
        };
      }
      projectsMap[pid].items.push(item);
    });

    let projects = Object.values(projectsMap);

    if (creator_id) {
      projects = projects.filter(p => p.creator_id === creator_id);
    }
    
    projects.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    const total = projects.length;
    const paginatedProjects = projects.slice(from, to + 1);

    return {
      items: paginatedProjects,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: total,
        totalPages: Math.ceil(total / limitNum)
      }
    };
  }

  let query = supabase
    .from('portfolio_projects')
    .select('*, author:profiles(username, avatar_url, display_name), items:portfolio_items(*)', { count: 'exact' });

  if (creator_id) {
    query = query.eq('creator_id', creator_id);
  }

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw error;

  return {
    items: data || [],
    pagination: { 
      page: pageNum, 
      limit: limitNum, 
      total: count, 
      totalPages: Math.ceil(count / limitNum) 
    },
  };
};

// ── Portfolio Projects ──────────────────────────────────────────────────

export const createPortfolioProject = async (userId, { title, description, category }) => {
  const { data, error } = await supabase
    .from('portfolio_projects')
    .insert({
      creator_id: userId,
      title,
      description: description || null,
      category,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const listPortfolioProjects = async (userId) => {
  const { data, error } = await supabase
    .from('portfolio_projects')
    .select('*, items:portfolio_items(*)')
    .eq('creator_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const getPortfolioProject = async (projectId, userId) => {
  const { data: project, error: projErr } = await supabase
    .from('portfolio_projects')
    .select('*, items:portfolio_items(*)')
    .eq('id', projectId)
    .single();

  if (projErr) throw new AppError('Project not found', 404, 'PROJECT_NOT_FOUND');
  
  // Optional: check ownership if you want strict privacy
  // if (project.creator_id !== userId) throw new AppError('Unauthorized', 403, 'FORBIDDEN');

  return project;
};

export const updatePortfolioProject = async (projectId, userId, updates) => {
  const { data, error } = await supabase
    .from('portfolio_projects')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', projectId)
    .eq('creator_id', userId) // Ensure ownership
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') throw new AppError('Project not found or unauthorized', 404, 'PROJECT_NOT_FOUND');
    throw error;
  }

  // If category was updated, sync it to all portfolio items in this project
  if (updates.category) {
    const { error: syncError } = await supabase
      .from('portfolio_items')
      .update({ category: updates.category })
      .eq('project_id', projectId);
    
    if (syncError) {
      console.error('Failed to sync category to portfolio items:', syncError);
      // We don't throw here to avoid failing the whole project update, 
      // as the project itself is already updated.
    }
  }
  
  return data;
};

export const deletePortfolioItem = async (itemId, userId) => {
  const { data: item, error: fetchError } = await supabase
    .from('portfolio_items')
    .select('*')
    .eq('id', itemId)
    .eq('creator_id', userId)
    .single();

  if (fetchError || !item) {
    throw new AppError('Item not found or unauthorized', 404, 'ITEM_NOT_FOUND');
  }

  const { error: dbError } = await supabase
    .from('portfolio_items')
    .delete()
    .eq('id', itemId);

  if (dbError) throw dbError;

  if (item.storage_path) {
    await supabase.storage.from('DripLens upload').remove([item.storage_path]);
  }

  return { success: true };
};

export const deletePortfolioProject = async (projectId, userId) => {
  const { data: project, error: projErr } = await supabase
    .from('portfolio_projects')
    .select('id')
    .eq('id', projectId)
    .eq('creator_id', userId)
    .single();

  if (projErr || !project) {
    throw new AppError('Project not found or unauthorized', 404, 'PROJECT_NOT_FOUND');
  }

  const { data: items } = await supabase
    .from('portfolio_items')
    .select('storage_path')
    .eq('project_id', projectId);

  const { error: delErr } = await supabase
    .from('portfolio_projects')
    .delete()
    .eq('id', projectId);

  if (delErr) throw delErr;

  if (items && items.length > 0) {
    const paths = items.map(i => i.storage_path).filter(Boolean);
    if (paths.length > 0) {
      await supabase.storage.from('DripLens upload').remove(paths);
    }
  }

  return { success: true };
};