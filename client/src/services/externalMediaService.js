const API_BASE = import.meta.env.PROD ? '' : (import.meta.env.VITE_API_URL || 'http://localhost:5001');
const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY;
const PIXABAY_API_KEY = import.meta.env.VITE_PIXABAY_API_KEY;

const PEXELS_BASE_URL = 'https://api.pexels.com/v1';
const PIXABAY_BASE_URL = 'https://pixabay.com/api';

/**
 * Normalizes Pexels photo/video data
 */
const normalizePexels = (item, type) => {
  if (type === 'photo') {
    return {
      id: `pexels-photo-${item.id}`,
      title: `Photo by ${item.photographer}`,
      author: { username: item.photographer },
      mediaUrl: item.src.large2x || item.src.large,
      mediaType: 'image',
      category: 'Photography',
      source: 'Pexels',
      originalUrl: item.url
    };
  } else {
    // Pexels video
    const bestFile = item.video_files.find(f => f.quality === 'hd') || item.video_files[0];
    return {
      id: `pexels-video-${item.id}`,
      title: `Video by ${item.user.name}`,
      author: { username: item.user.name },
      mediaUrl: bestFile.link,
      mediaType: 'video',
      category: 'Cinematography',
      source: 'Pexels',
      originalUrl: item.url
    };
  }
};

/**
 * Normalizes Pixabay photo/video data
 */
const normalizePixabay = (item, type) => {
  if (type === 'photo') {
    return {
      id: `pixabay-photo-${item.id}`,
      title: `Photo by ${item.user}`,
      author: { username: item.user },
      mediaUrl: item.largeImageURL,
      mediaType: 'image',
      category: 'Photography',
      source: 'Pixabay',
      originalUrl: item.pageURL
    };
  } else {
    // Pixabay video
    return {
      id: `pixabay-video-${item.id}`,
      title: `Video by ${item.user}`,
      author: { username: item.user },
      mediaUrl: item.videos.medium.url,
      mediaType: 'video',
      category: 'Cinematography',
      source: 'Pixabay',
      originalUrl: item.pageURL
    };
  }
};

export const fetchPexelsContent = async (query = 'creative', page = 1, perPage = 10) => {
  if (!PEXELS_API_KEY || PEXELS_API_KEY === 'YOUR_PEXELS_API_KEY') return [];
  
  try {
    const [photosRes, videosRes] = await Promise.all([
      fetch(`${PEXELS_BASE_URL}/search?query=${query}&page=${page}&per_page=${perPage}`, {
        headers: { Authorization: PEXELS_API_KEY }
      }),
      fetch(`${PEXELS_BASE_URL}/videos/search?query=${query}&page=${page}&per_page=${perPage}`, {
        headers: { Authorization: PEXELS_API_KEY }
      })
    ]);

    const photosData = await photosRes.json();
    const videosData = await videosRes.json();

    const normalizedPhotos = (photosData.photos || []).map(item => normalizePexels(item, 'photo'));
    const normalizedVideos = (videosData.videos || []).map(item => normalizePexels(item, 'video'));

    return [...normalizedPhotos, ...normalizedVideos];
  } catch (error) {
    console.error('Error fetching from Pexels:', error);
    return [];
  }
};

export const fetchPixabayContent = async (query = 'creative', page = 1, perPage = 10) => {
  if (!PIXABAY_API_KEY || PIXABAY_API_KEY === 'YOUR_PIXABAY_API_KEY') return [];

  try {
    const [photosRes, videosRes] = await Promise.all([
      fetch(`${PIXABAY_BASE_URL}/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}&image_type=photo`),
      fetch(`${PIXABAY_BASE_URL}/videos/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`)
    ]);

    const photosData = await photosRes.json();
    const videosData = await videosRes.json();

    const normalizedPhotos = (photosData.hits || []).map(item => normalizePixabay(item, 'photo'));
    const normalizedVideos = (videosData.hits || []).map(item => normalizePixabay(item, 'video'));

    return [...normalizedPhotos, ...normalizedVideos];
  } catch (error) {
    console.error('Error fetching from Pixabay:', error);
    return [];
  }
};

export const getAllExploreContent = async (query = 'creative', page = 1) => {
  try {
    // Fetch local content first with pagination
    const localRes = await fetch(`${API_BASE}/api/v1/upload?page=${page}&limit=12`);
    let localData = [];
    if (localRes.ok) {
      const response = await localRes.json();
      const projects = response.data?.items || [];
      localData = projects.map(project => ({
        ...project,
        source: 'Local',
        items: (project.items || []).map(i => ({
          ...i,
          mediaUrl: i.media_url || i.mediaUrl,
          mediaType: i.media_type || i.mediaType
        })),
        // Preview fields for the card
        mediaUrl: project.items?.[0]?.media_url || project.items?.[0]?.mediaUrl,
        mediaType: project.items?.[0]?.media_type || project.items?.[0]?.mediaType
      }));
    }

    // Fetch external content
    const [pexelsData, pixabayData] = await Promise.all([
      fetchPexelsContent(query, page, 6),
      fetchPixabayContent(query, page, 6)
    ]);

    // Normalize external content to "project" structure
    const normalizedExternal = [...pexelsData, ...pixabayData].map(item => ({
      ...item,
      items: [{
        mediaUrl: item.mediaUrl,
        mediaType: item.mediaType,
        title: item.title
      }]
    }));

    // Combine
    const combined = [...localData, ...normalizedExternal];
    
    // Sort by source priority: Local (highest), then External
    return combined.sort((a, b) => {
      if (a.source === 'Local' && b.source !== 'Local') return -1;
      if (a.source !== 'Local' && b.source === 'Local') return 1;
      return 0;
    });
  } catch (error) {
    console.error('Error fetching all content:', error);
    return [];
  }
};
