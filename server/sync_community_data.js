import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const PEXELS_API_KEY = process.env.VITE_PEXELS_API_KEY || 'your_pexels_key_here';

async function syncPexelsToDb() {
  console.log('🚀 Starting sync: Joining external data to your database...');

  try {
    // 1. Get some high quality content from Pexels
    const res = await fetch('https://api.pexels.com/v1/search?query=cinematography&per_page=10', {
      headers: { Authorization: PEXELS_API_KEY }
    });
    
    if (!res.ok) {
      throw new Error(`Pexels API failed: ${res.statusText}. Please ensure VITE_PEXELS_API_KEY is set in client/.env`);
    }

    const data = await res.json();
    const photos = data.photos || [];

    // 2. Ensure we have a "Community" profile to assign these to
    const COMMUNITY_USER_ID = '00000000-0000-0000-0000-000000000000';
    
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: COMMUNITY_USER_ID,
        username: 'Driplens Community',
        role: 'creator',
        bio: 'Automated global creative feed integration.',
        category: 'Mixed Media'
      });

    if (profileError) console.warn('Note: Profile upsert warning:', profileError.message);

    // 3. Insert into portfolio_items
    const itemsToInsert = photos.map(photo => ({
      creator_id: COMMUNITY_USER_ID,
      title: `Work by ${photo.photographer}`,
      description: `Imported from Pexels. Photographer: ${photo.photographer}`,
      category: 'Photography',
      media_url: photo.src.large2x || photo.src.large,
      media_type: 'image',
      storage_path: `external/pexels/${photo.id}`,
      created_at: new Date().toISOString()
    }));

    const { error: insertError } = await supabase
      .from('portfolio_items')
      .upsert(itemsToInsert, { onConflict: 'storage_path' });

    if (insertError) {
      console.error('❌ Failed to join data to database:', insertError.message);
    } else {
      console.log(`✅ Success! Joined ${itemsToInsert.length} community items to your database.`);
      console.log('Users will now see this content in the Explore Global Work feed.');
    }

  } catch (err) {
    console.error('❌ Sync failed:', err.message);
  }
}

syncPexelsToDb();
