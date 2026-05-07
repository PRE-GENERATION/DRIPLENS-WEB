import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

const CREATOR_CATEGORIES = [
  'Cinematography',
  'Photography',
  '3D Motion',
  'Design',
  'Illustration',
  'Animation',
  'Graphic Design',
  'VFX'
];

const BRAND_CATEGORIES = [
  'Fashion & Beauty',
  'Tech & Gadgets',
  'Food & Beverage',
  'Travel & Hospitality',
  'Health & Wellness',
  'Finance & Services',
  'Home & Lifestyle',
  'E-commerce'
];

export default function EditProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isCreator = user?.role === 'creator';
  const categories = isCreator ? CREATOR_CATEGORIES : BRAND_CATEGORIES;

  const avatarInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  const [formData, setFormData] = useState({
    bio: '',
    category: '',
    location: '',
    avatar_url: '',
    banner_url: '',
    instagram: '',
    twitter: '',
    website: '',
    min_budget: 0,
    max_budget: 10000,
    follower_count: 0,
    platforms: [],
    is_available: true,
    tags: []
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [dragActiveAvatar, setDragActiveAvatar] = useState(false);
  const [dragActiveBanner, setDragActiveBanner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [errors, setErrors] = useState({});

  // Load current profile data
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await api.get(`/creators/${user.id}`);
        const creator = res.data.creator;
        setFormData({
          bio: creator.bio || '',
          category: creator.category || '',
          location: creator.location || '',
          avatar_url: creator.avatar_url || '',
          banner_url: creator.banner_url || '',
          instagram: creator.instagram || '',
          twitter: creator.twitter || '',
          website: creator.website || '',
          min_budget: creator.min_budget || 0,
          max_budget: creator.max_budget || 10000,
          follower_count: creator.follower_count || 0,
          platforms: creator.platforms || [],
          is_available: creator.is_available ?? true,
          tags: creator.tags || []
        });
        if (creator.avatar_url) setAvatarPreview(creator.avatar_url);
        if (creator.banner_url) setBannerPreview(creator.banner_url);
      } catch (err) {
        console.error('Failed to load profile:', err);
        setMessage({ type: 'error', text: 'Failed to load profile' });
      } finally {
        setInitialLoading(false);
      }
    };
    if (user?.id) loadProfile();
  }, [user?.id]);

  // Handle file selection/drop
  const handleAvatarDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActiveAvatar(true);
    } else if (e.type === 'dragleave') {
      setDragActiveAvatar(false);
    }
  };

  const handleAvatarDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveAvatar(false);
    if (e.dataTransfer.files?.[0]) {
      processAvatarFile(e.dataTransfer.files[0]);
    }
  };

  const handleAvatarChange = (e) => {
    if (e.target.files?.[0]) {
      processAvatarFile(e.target.files[0]);
    }
  };

  const processAvatarFile = (file) => {
    if (!file.type.startsWith('image/')) {
      setErrors(p => ({ ...p, avatar: 'Avatar must be an image' }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors(p => ({ ...p, avatar: 'Avatar must be under 5MB' }));
      return;
    }
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarPreview(reader.result);
      setErrors(p => ({ ...p, avatar: '' }));
    };
    reader.readAsDataURL(file);
  };

  const handleBannerDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActiveBanner(true);
    } else if (e.type === 'dragleave') {
      setDragActiveBanner(false);
    }
  };

  const handleBannerDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveBanner(false);
    if (e.dataTransfer.files?.[0]) {
      processBannerFile(e.dataTransfer.files[0]);
    }
  };

  const handleBannerChange = (e) => {
    if (e.target.files?.[0]) {
      processBannerFile(e.target.files[0]);
    }
  };

  const processBannerFile = (file) => {
    if (!file.type.startsWith('image/')) {
      setErrors(p => ({ ...p, banner: 'Banner must be an image' }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors(p => ({ ...p, banner: 'Banner must be under 5MB' }));
      return;
    }
    setBannerFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setBannerPreview(reader.result);
      setErrors(p => ({ ...p, banner: '' }));
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setFormData(p => ({ ...p, [name]: val }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const handlePlatformToggle = (platform) => {
    setFormData(p => ({
      ...p,
      platforms: p.platforms.includes(platform)
        ? p.platforms.filter(pl => pl !== platform)
        : [...p.platforms, platform]
    }));
  };

  const handleTagsChange = (e) => {
    const tags = e.target.value.split(',').map(t => t.trim()).filter(Boolean);
    setFormData(p => ({ ...p, tags }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (formData.bio && formData.bio.length > 500) {
      newErrors.bio = 'Bio must be 500 characters or less';
    }
    if (formData.location && formData.location.length > 100) {
      newErrors.location = 'Location must be 100 characters or less';
    }
    if (formData.website && !isValidUrl(formData.website)) {
      newErrors.website = 'Enter a valid website URL';
    }
    if (isCreator) {
      if (formData.min_budget < 0) newErrors.min_budget = 'Min budget cannot be negative';
      if (formData.max_budget < formData.min_budget) newErrors.max_budget = 'Max budget must be >= min budget';
      if (formData.follower_count < 0) newErrors.follower_count = 'Follower count cannot be negative';
    }
    return newErrors;
  };

  const isValidUrl = (string) => {
    if (!string) return true;
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      let avatarUrl = formData.avatar_url;
      let bannerUrl = formData.banner_url;

      // 1. Upload images first if they were changed
      if (avatarFile) {
        const avatarFormData = new FormData();
        avatarFormData.append('avatar', avatarFile);
        const res = await api.post('/upload/avatar', avatarFormData);
        avatarUrl = res.data.publicUrl;
      }

      if (bannerFile) {
        const bannerFormData = new FormData();
        bannerFormData.append('banner', bannerFile);
        const res = await api.post('/upload/banner', bannerFormData);
        bannerUrl = res.data.publicUrl;
      }

      // 2. Prepare payload
      const payload = {
        bio:           formData.bio,
        category:      formData.category,
        location:      formData.location,
        instagram:     formData.instagram,
        twitter:       formData.twitter,
        website:       formData.website,
        avatar_url:    avatarUrl,
        banner_url:    bannerUrl,
        ...(isCreator && {
          min_budget:     Number(formData.min_budget),
          max_budget:     Number(formData.max_budget),
          follower_count: Number(formData.follower_count),
          platforms:      formData.platforms,
          is_available:   formData.is_available,
          tags:           formData.tags
        })
      };

      // 3. Update profile
      await api.patch('/creators/profile', payload);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => {
        navigate(`/dashboard/${user.role}`);
      }, 1500);
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => navigate(`/dashboard/${user?.role}`);

  const inputStyle = { 
    width: '100%', 
    border: '0.5px solid #E8E8F0', 
    borderRadius: '8px', 
    padding: '8px 11px', 
    fontSize: '12px', 
    color: '#0D1033', 
    background: '#FAFAFA', 
    outline: 'none',
    transition: 'border-color 0.2s'
  };

  const labelStyle = { 
    fontSize: '10px', 
    color: '#9CA3AF', 
    letterSpacing: '.05em', 
    textTransform: 'uppercase', 
    marginBottom: '5px' 
  };

  if (initialLoading) {
    return (
      <div style={{ minHeight: '100vh', background: '#F8F9FC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, system-ui, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '24px', height: '24px', border: '2px solid #3B50E0', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ fontSize: '11px', color: '#9CA3AF' }}>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Edit Profile — Driplens</title>
        <meta name="description" content="Edit your Driplens profile" />
      </Helmet>

      <div style={{ minHeight: '100vh', background: '#F8F9FC', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, system-ui, sans-serif' }}>
        {/* TOP HEADER BAR */}
        <div style={{ background: '#fff', borderBottom: '0.5px solid #F0F0F0', padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
          <div>
            <div style={{ fontSize: '14px', color: '#0D1033', fontWeight: '500' }}>Profile settings</div>
            <div style={{ fontSize: '10px', color: '#9CA3AF', marginTop: '2px' }}>Manage your public profile and personal information</div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              type="button"
              onClick={handleCancel} 
              style={{ fontSize: '11px', padding: '7px 16px', borderRadius: '8px', border: '0.5px solid #E0E0E8', background: '#fff', color: '#6B7280', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button 
              type="button"
              onClick={handleSubmit} 
              disabled={loading}
              style={{ fontSize: '11px', padding: '7px 18px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #3B50E0, #C060C0)', color: '#fff', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </div>

        {/* BODY */}
        <div style={{ display: 'flex', flex: 1, maxWidth: '900px', margin: '0 auto', width: '100%', padding: '24px 24px' }}>

          {/* LEFT SIDEBAR NAV */}
          <div style={{ width: '160px', flexShrink: 0, marginRight: '24px' }}>
            {[['Profile', true], ['Portfolio', false], ['Availability', false], ['Notifications', false], ['Security', false]].map(([label, active]) => (
              <div 
                key={label} 
                style={{ fontSize: '12px', color: active ? '#0D1033' : '#6B7280', padding: '8px 12px', borderRadius: '8px', background: active ? '#F5F5FF' : 'transparent', fontWeight: active ? '500' : '400', cursor: 'pointer', marginBottom: '2px' }}
              >
                {label}
              </div>
            ))}
          </div>

          {/* MAIN CONTENT — CARDS */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            <AnimatePresence>
              {message.text && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  style={{ 
                    padding: '12px 16px', 
                    borderRadius: '12px', 
                    fontSize: '11px',
                    marginBottom: '4px',
                    background: message.type === 'error' ? '#FEF2F2' : '#F0FDF4',
                    color: message.type === 'error' ? '#991B1B' : '#166534',
                    border: `0.5px solid ${message.type === 'error' ? '#FEE2E2' : '#DCFCE7'}`
                  }}
                >
                  {message.text}
                </motion.div>
              )}
            </AnimatePresence>

            {/* CARD 1 — Profile photo */}
            <div style={{ background: '#fff', border: '0.5px solid #F0F0F0', borderRadius: '14px', padding: '20px 22px' }}>
              <div style={{ fontSize: '12px', color: '#0D1033', fontWeight: '500', marginBottom: '2px' }}>Profile photo</div>
              <div style={{ fontSize: '10px', color: '#9CA3AF', marginBottom: '14px' }}>This will be displayed on your public profile</div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                <div 
                  onClick={() => avatarInputRef.current?.click()}
                  style={{ 
                    width: '52px', 
                    height: '52px', 
                    borderRadius: '50%', 
                    background: avatarPreview ? `url(${avatarPreview}) center/cover no-repeat` : 'linear-gradient(135deg, #3B50E0, #C060C0)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontSize: '18px', 
                    color: '#fff', 
                    flexShrink: 0, 
                    cursor: 'pointer',
                    overflow: 'hidden'
                  }}
                >
                  {!avatarPreview && user?.username?.[0]?.toUpperCase()}
                </div>
                <div>
                  <input type="file" ref={avatarInputRef} onChange={handleAvatarChange} className="hidden" accept="image/*" />
                  <button 
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    style={{ fontSize: '10px', padding: '6px 14px', border: '0.5px solid #E0E0E8', borderRadius: '7px', background: '#fff', color: '#0D1033', cursor: 'pointer', marginRight: '8px' }}
                  >
                    Upload new photo
                  </button>
                  <button 
                    type="button"
                    onClick={() => { setAvatarFile(null); setAvatarPreview(null); }}
                    style={{ fontSize: '10px', padding: '6px 14px', border: '0.5px solid #F09595', borderRadius: '7px', background: '#fff', color: '#E24B4A', cursor: 'pointer' }}
                  >
                    Remove
                  </button>
                  <div style={{ fontSize: '10px', color: '#9CA3AF', marginTop: '6px' }}>JPG, PNG or WebP — max 5MB</div>
                </div>
              </div>

              {/* Banner / Cover Photo - Keeping existing logic */}
              <div style={{ borderTop: '0.5px solid #F0F0F0', paddingTop: '20px' }}>
                <div style={{ fontSize: '12px', color: '#0D1033', fontWeight: '500', marginBottom: '2px' }}>Cover photo</div>
                <div style={{ fontSize: '10px', color: '#9CA3AF', marginBottom: '14px' }}>Recommended: 1200×400px</div>
                <div 
                  onClick={() => bannerInputRef.current?.click()}
                  style={{ 
                    width: '100%', 
                    height: '100px', 
                    borderRadius: '10px', 
                    border: '1px dashed #E0E0E8', 
                    background: bannerPreview ? `url(${bannerPreview}) center/cover no-repeat` : '#FAFAFA',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <input type="file" ref={bannerInputRef} onChange={handleBannerChange} className="hidden" accept="image/*" />
                  {!bannerPreview && <span style={{ fontSize: '10px', color: '#9CA3AF' }}>Click to upload cover photo</span>}
                </div>
                {errors.banner && <p style={{ color: '#E24B4A', fontSize: '10px', marginTop: '4px' }}>{errors.banner}</p>}
              </div>
            </div>

            {/* CARD 2 — Personal details */}
            <div style={{ background: '#fff', border: '0.5px solid #F0F0F0', borderRadius: '14px', padding: '20px 22px' }}>
              <div style={{ fontSize: '12px', color: '#0D1033', fontWeight: '500', marginBottom: '2px' }}>Personal details</div>
              <div style={{ fontSize: '10px', color: '#9CA3AF', marginBottom: '16px' }}>Update your {isCreator ? 'specialty' : 'industry'}, bio and location</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                
                {/* Category/Specialty */}
                <div>
                  <div style={labelStyle}>{isCreator ? 'Specialty' : 'Industry'}</div>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    style={inputStyle}
                  >
                    <option value="">Select a category...</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Location */}
                <div>
                  <div style={labelStyle}>Location</div>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="City, Country"
                    style={inputStyle}
                  />
                  {errors.location && <p style={{ color: '#E24B4A', fontSize: '10px', marginTop: '4px' }}>{errors.location}</p>}
                </div>

                {/* Bio */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <div style={labelStyle}>Bio {formData.bio.length > 0 && `(${formData.bio.length}/500)`}</div>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell your story..."
                    rows="3"
                    maxLength="500"
                    style={{ ...inputStyle, resize: 'none' }}
                  />
                  {errors.bio && <p style={{ color: '#E24B4A', fontSize: '10px', marginTop: '4px' }}>{errors.bio}</p>}
                </div>
              </div>
            </div>

            {/* CARD 3 — Social links */}
            <div style={{ background: '#fff', border: '0.5px solid #F0F0F0', borderRadius: '14px', padding: '20px 22px' }}>
              <div style={{ fontSize: '12px', color: '#0D1033', fontWeight: '500', marginBottom: '2px' }}>Social links</div>
              <div style={{ fontSize: '10px', color: '#9CA3AF', marginBottom: '16px' }}>Add your social media profiles</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <div style={labelStyle}>Instagram</div>
                  <input
                    type="text"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleInputChange}
                    placeholder="handle"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <div style={labelStyle}>Twitter / X</div>
                  <input
                    type="text"
                    name="twitter"
                    value={formData.twitter}
                    onChange={handleInputChange}
                    placeholder="handle"
                    style={inputStyle}
                  />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <div style={labelStyle}>Website</div>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://..."
                    style={inputStyle}
                  />
                  {errors.website && <p style={{ color: '#E24B4A', fontSize: '10px', marginTop: '4px' }}>{errors.website}</p>}
                </div>
              </div>
            </div>

            {/* CARD 4 — Creator Discovery Settings */}
            {isCreator && (
              <div style={{ background: '#fff', border: '0.5px solid #F0F0F0', borderRadius: '14px', padding: '20px 22px' }}>
                <div style={{ fontSize: '12px', color: '#0D1033', fontWeight: '500', marginBottom: '2px' }}>Discovery settings</div>
                <div style={{ fontSize: '10px', color: '#9CA3AF', marginBottom: '16px' }}>Manage how brands find and hire you</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <div style={labelStyle}>Min Budget ($)</div>
                    <input
                      type="number"
                      name="min_budget"
                      value={formData.min_budget}
                      onChange={handleInputChange}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <div style={labelStyle}>Max Budget ($)</div>
                    <input
                      type="number"
                      name="max_budget"
                      value={formData.max_budget}
                      onChange={handleInputChange}
                      style={inputStyle}
                    />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <div style={labelStyle}>Follower Count</div>
                    <input
                      type="number"
                      name="follower_count"
                      value={formData.follower_count}
                      onChange={handleInputChange}
                      style={inputStyle}
                    />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <div style={labelStyle}>Platforms</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                      {['Instagram', 'TikTok', 'YouTube', 'Twitter', 'Twitch', 'LinkedIn'].map(plt => (
                        <button
                          key={plt}
                          type="button"
                          onClick={() => handlePlatformToggle(plt)}
                          style={{
                            padding: '5px 12px',
                            borderRadius: '100px',
                            fontSize: '10px',
                            border: '0.5px solid #E0E0E8',
                            background: formData.platforms.includes(plt) ? '#3B50E0' : '#fff',
                            color: formData.platforms.includes(plt) ? '#fff' : '#6B7280',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                        >
                          {plt}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <div style={labelStyle}>Tags (Comma separated)</div>
                    <input
                      type="text"
                      defaultValue={formData.tags.join(', ')}
                      onBlur={handleTagsChange}
                      placeholder="cinematic, storytelling..."
                      style={inputStyle}
                    />
                  </div>
                  <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: '#F9FAFB', borderRadius: '10px', marginTop: '8px' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: '#0D1033', fontWeight: '500' }}>Available for hire</div>
                      <div style={{ fontSize: '9px', color: '#9CA3AF' }}>Show availability badge on profile</div>
                    </div>
                    <input
                      type="checkbox"
                      name="is_available"
                      checked={formData.is_available}
                      onChange={handleInputChange}
                      style={{ width: '16px', height: '16px', accentColor: '#3B50E0', cursor: 'pointer' }}
                    />
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}
