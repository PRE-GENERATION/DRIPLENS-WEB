import { supabase } from '../utils/supabase.js';
import { notFound } from '../utils/AppError.js';

const FOLLOWER_TIERS = {
  Nano:  [0, 10000],
  Micro: [10000, 50000],
  Mid:   [50000, 500000],
  Macro: [500000, 1000000],
  Mega:  [1000000, 1000000000],
};

export const listCreators = async ({ 
  category, location, search, minBudget, maxBudget, 
  followerTier, platforms, isAvailable, minRating, tags, 
  page = 1, limit = 50 
}) => {
  const from = (page - 1) * limit;
  const to   = from + limit - 1;

  let query = supabase
    .from('profiles')
    .select('id, username, bio, location, category, avatar_url, min_budget, max_budget, follower_count, platforms, is_available, rating, tags', { count: 'exact' })
    .eq('role', 'creator');

  if (category && category.trim()) {
    const cats = category.split(',').filter(Boolean);
    if (cats.length > 0) {
      const orQuery = cats.map(c => `category.ilike.%${c}%`).join(',');
      query = query.or(orQuery);
    }
  }
  
  if (location && location.trim()) query = query.ilike('location', `%${location}%`);
  
  if (search && search.trim()) {
    // Multi-field search using OR
    query = query.or(`username.ilike.%${search}%,bio.ilike.%${search}%,location.ilike.%${search}%,category.ilike.%${search}%`);
  }

  // Only apply budget filters if they are not the defaults
  if (minBudget !== undefined && minBudget > 0) query = query.gte('max_budget', minBudget);
  if (maxBudget !== undefined && maxBudget < 10000) query = query.lte('min_budget', maxBudget);
  
  if (followerTier && followerTier !== 'Any') {
    const range = FOLLOWER_TIERS[followerTier];
    if (range) {
      query = query.gte('follower_count', range[0]).lte('follower_count', range[1]);
    }
  }

  if (platforms && platforms.trim()) {
    const pList = platforms.split(',').filter(Boolean);
    if (pList.length > 0) {
      query = query.contains('platforms', pList);
    }
  }

  // Only filter by availability if explicitly requested (true)
  // If false, it means "don't care", so we don't filter.
  if (isAvailable === true) {
    query = query.eq('is_available', true);
  }

  if (minRating !== undefined && minRating > 0) {
    query = query.gte('rating', minRating);
  }
  
  if (tags && tags.trim()) {
    const tagList = tags.split(',').filter(Boolean);
    if (tagList.length > 0) {
      query = query.overlaps('tags', tagList);
    }
  }

  const { data, error, count } = await query
    .order('rating', { ascending: false })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw error;

  return {
    creators:   data || [],
    pagination: { page, limit, total: count, totalPages: Math.ceil(count / limit) }
  };
};

export const getCreator = async (id) => {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      id, username, bio, location, category, avatar_url, banner_url,
      min_budget, max_budget, follower_count, platforms,
      is_available, rating, tags,
      instagram, twitter, website, created_at,
      portfolio_projects (
        id, title, description, category, created_at,
        items:portfolio_items(id, title, media_url, media_type, created_at)
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Database error in getCreator:', error.message, error.details);
    throw notFound('Creator not found');
  }
  if (!data) throw notFound('Creator not found');
  return data;
};

export const updateProfile = async (userId, fields) => {
  // Sanitize: ensure array fields are always arrays, never strings
  const arrayFields = ['platforms', 'tags', 'qualifications', 'past_work'];
  const sanitized = { ...fields };

  for (const key of arrayFields) {
    if (sanitized[key] !== undefined) {
      if (typeof sanitized[key] === 'string') {
        // Convert comma-separated string to array, filter empty
        sanitized[key] = sanitized[key].split(',').map(s => s.trim()).filter(Boolean);
      } else if (!Array.isArray(sanitized[key])) {
        sanitized[key] = [];
      }
    }
  }

  // Ensure numeric fields are numbers
  const numericFields = ['follower_count', 'min_budget', 'max_budget', 'rating'];
  for (const key of numericFields) {
    if (sanitized[key] !== undefined && sanitized[key] !== null) {
      sanitized[key] = Number(sanitized[key]) || 0;
    }
  }

  // Ensure boolean fields are booleans
  const boolFields = ['is_available', 'onboarding_complete'];
  for (const key of boolFields) {
    if (sanitized[key] !== undefined) {
      sanitized[key] = Boolean(sanitized[key]);
    }
  }

  // Serialize platform_urls as JSON string for JSONB column
  if (sanitized.platform_urls !== undefined && sanitized.platform_urls !== null) {
    if (typeof sanitized.platform_urls === 'object' && !Array.isArray(sanitized.platform_urls)) {
      sanitized.platform_urls = JSON.stringify(sanitized.platform_urls);
    }
  }

  // preferred_work_type: ensure it's a non-null string
  if (sanitized.preferred_work_type !== undefined) {
    if (Array.isArray(sanitized.preferred_work_type)) {
      sanitized.preferred_work_type = sanitized.preferred_work_type[0] || '';
    }
    sanitized.preferred_work_type = String(sanitized.preferred_work_type || '');
  }

  // Add updated_at timestamp
  sanitized.updated_at = new Date().toISOString();

  // Remove undefined values
  Object.keys(sanitized).forEach(k => sanitized[k] === undefined && delete sanitized[k]);

  const { data, error } = await supabase
    .from('profiles')
    .update(sanitized)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('updateProfile DB error:', error.message, error.details, error.hint);
    throw error;
  }
  return data;
};
