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
  const { data, error } = await supabase
    .from('profiles')
    .update(fields)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};
