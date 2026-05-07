import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  Instagram, 
  Twitter, 
  Linkedin, 
  Globe, 
  Plus, 
  Info,
  DollarSign,
  Users,
  Target,
  Hash,
  Briefcase
} from 'lucide-react';
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
    linkedin: '',
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
          linkedin: creator.linkedin || '',
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
        linkedin:      formData.linkedin,
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
        navigate('/profile/me');
      }, 1500);
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => navigate('/profile/me');

  const cardStyle = {
    background: '#FFFFFF',
    border: '1px solid #E5E7EB',
    borderRadius: '8px',
    padding: '32px',
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05), 0px 0px 0px 1px rgba(0, 0, 0, 0.05)',
    marginBottom: '32px'
  };

  const inputStyle = { 
    width: '100%', 
    border: '1px solid #D1D5DB', 
    borderRadius: '6px', 
    padding: '12px 16px', 
    fontSize: '14px', 
    color: '#111111', 
    background: '#FFFFFF', 
    outline: 'none',
    transition: 'all 0.3s ease',
    fontFamily: "'Inter', sans-serif"
  };

  const labelStyle = { 
    fontSize: '14px', 
    color: '#555555', 
    fontWeight: '500',
    marginBottom: '8px',
    display: 'block',
    fontFamily: "'Inter', sans-serif"
  };

  const focusStyle = "focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6] focus:ring-opacity-20";

  if (initialLoading) {
    return (
      <div style={{ minHeight: '100vh', background: '#F8F9FC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif" }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '24px', height: '24px', border: '2px solid #3B50E0', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ fontSize: '11px', color: '#9CA3AF', fontFamily: "'Inter', sans-serif" }}>Loading profile...</p>
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

      <div style={{ minHeight: '100vh', background: '#F9FAFB', display: 'flex', flexDirection: 'column', fontFamily: "'Inter', sans-serif" }}>

        {/* BODY */}
        <div style={{ display: 'flex', flex: 1, maxWidth: '1000px', margin: '0 auto', width: '100%', padding: '48px 24px' }}>

          <div style={{ flex: 1 }}>
            
            <AnimatePresence>
              {message.text && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  style={{ 
                    padding: '12px 16px', 
                    borderRadius: '8px', 
                    fontSize: '14px',
                    marginBottom: '24px',
                    background: message.type === 'error' ? '#FEF2F2' : '#F0FDF4',
                    color: message.type === 'error' ? '#991B1B' : '#166534',
                    border: `1px solid ${message.type === 'error' ? '#FEE2E2' : '#DCFCE7'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '500'
                  }}
                >
                  {message.text}
                </motion.div>
              )}
            </AnimatePresence>

            {/* COMBINED SECTION — SOCIAL & DISCOVERY */}
            <div style={cardStyle}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                
                {/* Left Column: Social Profiles */}
                <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-[#F0F0F0] pb-10 lg:pb-0 lg:pr-10">
                  <div style={{ marginBottom: '32px' }}>
                    <div style={{ fontSize: '20px', color: '#111111', fontWeight: '700', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Globe className="w-5 h-5 text-brand-accent" /> Social Profiles
                    </div>
                    <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: '1.5' }}>
                      Connect your social profiles to boost visibility and help brands find your work easily.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Instagram */}
                    <div className="group">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-pink-50 rounded-lg group-focus-within:bg-pink-500 group-focus-within:text-white transition-all">
                            <Instagram className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-semibold text-[#374151]">Instagram</span>
                        </div>
                        {!formData.instagram && (
                          <span className="text-[10px] font-bold text-pink-500 uppercase tracking-wider">Required</span>
                        )}
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          name="instagram"
                          value={formData.instagram}
                          onChange={handleInputChange}
                          placeholder="your_username"
                          className={focusStyle}
                          style={{ ...inputStyle, paddingLeft: '40px' }}
                        />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">@</span>
                      </div>
                    </div>

                    {/* Twitter/X */}
                    <div className="group">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-zinc-100 rounded-lg group-focus-within:bg-black group-focus-within:text-white transition-all">
                            <Twitter className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-semibold text-[#374151]">Twitter / X</span>
                        </div>
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          name="twitter"
                          value={formData.twitter}
                          onChange={handleInputChange}
                          placeholder="your_handle"
                          className={focusStyle}
                          style={{ ...inputStyle, paddingLeft: '40px' }}
                        />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">@</span>
                      </div>
                    </div>

                    {/* LinkedIn */}
                    <div className="group">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-50 rounded-lg group-focus-within:bg-blue-600 group-focus-within:text-white transition-all">
                            <Linkedin className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-semibold text-[#374151]">LinkedIn</span>
                        </div>
                      </div>
                      <input
                        type="text"
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleInputChange}
                        placeholder="linkedin.com/in/yourprofile"
                        className={focusStyle}
                        style={inputStyle}
                      />
                    </div>

                    {/* Website */}
                    <div className="group">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-indigo-50 rounded-lg group-focus-within:bg-indigo-600 group-focus-within:text-white transition-all">
                            <Globe className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-semibold text-[#374151]">Portfolio Website</span>
                        </div>
                      </div>
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        placeholder="https://yourwork.com"
                        className={focusStyle}
                        style={inputStyle}
                      />
                      {errors.website && <p style={{ color: '#EF4444', fontSize: '11px', marginTop: '6px' }}>{errors.website}</p>}
                    </div>

                    <div className="pt-4 mt-8 bg-zinc-50 p-4 rounded-xl border border-dashed border-zinc-200">
                      <div className="flex gap-3">
                        <Info className="w-4 h-4 text-brand-accent mt-0.5" />
                        <p className="text-[12px] text-[#4B5563] leading-relaxed">
                          <span className="font-bold text-brand-accent">Pro Tip:</span> Linked profiles are shown on your public portfolio to build trust with potential clients.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Discovery Details */}
                {isCreator && (
                  <div className="lg:col-span-7">
                    <div style={{ marginBottom: '32px' }}>
                      <div style={{ fontSize: '20px', color: '#111111', fontWeight: '700', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Target className="w-5 h-5 text-brand-accent" /> Discovery Details
                      </div>
                      <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: '1.5' }}>
                        Set your preferences to help brands find and hire you based on their specific needs.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-8">
                      <div>
                        <label style={labelStyle}>
                          <span className="flex items-center gap-2"><DollarSign className="w-3.5 h-3.5" /> Min Budget ($)</span>
                        </label>
                        <input
                          type="number"
                          name="min_budget"
                          value={formData.min_budget}
                          onChange={handleInputChange}
                          placeholder="500"
                          className={focusStyle}
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>
                          <span className="flex items-center gap-2"><DollarSign className="w-3.5 h-3.5" /> Max Budget ($)</span>
                        </label>
                        <input
                          type="number"
                          name="max_budget"
                          value={formData.max_budget}
                          onChange={handleInputChange}
                          placeholder="5000"
                          className={focusStyle}
                          style={inputStyle}
                        />
                      </div>
                    </div>

                    <div className="mb-8">
                      <label style={labelStyle}>
                        <span className="flex items-center gap-2"><Users className="w-3.5 h-3.5" /> Total Follower Count</span>
                      </label>
                      <input
                        type="number"
                        name="follower_count"
                        value={formData.follower_count}
                        onChange={handleInputChange}
                        placeholder="10000"
                        className={focusStyle}
                        style={inputStyle}
                      />
                    </div>

                    <div className="mb-8">
                      <label style={labelStyle}>
                        <span className="flex items-center gap-2"><Globe className="w-3.5 h-3.5" /> Active Platforms</span>
                      </label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
                        {['Instagram', 'TikTok', 'YouTube', 'Twitter', 'Twitch', 'LinkedIn'].map(plt => {
                          const isSelected = formData.platforms.includes(plt);
                          return (
                            <button
                              key={plt}
                              type="button"
                              onClick={() => handlePlatformToggle(plt)}
                              className="transition-all duration-200 active:scale-95"
                              style={{
                                padding: '8px 16px',
                                borderRadius: '12px',
                                fontSize: '13px',
                                fontWeight: '600',
                                border: isSelected ? 'none' : '1px solid #E5E7EB',
                                background: isSelected ? '#3B82F6' : '#FFFFFF',
                                color: isSelected ? '#FFFFFF' : '#4B5563',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: isSelected ? '0 4px 12px rgba(59, 130, 246, 0.25)' : 'none'
                              }}
                            >
                              {plt}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="mb-8">
                      <label style={labelStyle}>
                        <span className="flex items-center gap-2"><Hash className="w-3.5 h-3.5" /> Expertise Tags</span>
                      </label>
                      <div style={{ 
                        ...inputStyle, 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: '6px', 
                        padding: '8px',
                        minHeight: '48px',
                        alignItems: 'center',
                        cursor: 'text',
                        borderRadius: '12px'
                      }} onClick={() => document.getElementById('tags-input').focus()}>
                        {formData.tags.map(tag => (
                          <span
                            key={tag}
                            style={{
                              background: '#3B82F6',
                              color: '#FFFFFF',
                              padding: '4px 10px',
                              borderRadius: '8px',
                              fontSize: '12px',
                              fontWeight: '600',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setFormData(p => ({ ...p, tags: p.tags.filter(t => t !== tag) }));
                              }}
                              style={{ border: 'none', background: 'none', color: '#FFFFFF', cursor: 'pointer', padding: '0', fontSize: '14px', opacity: 0.8 }}
                            >
                              &times;
                            </button>
                          </span>
                        ))}
                        <input
                          id="tags-input"
                          type="text"
                          placeholder={formData.tags.length === 0 ? "add tags..." : ""}
                          style={{ 
                            border: 'none', 
                            outline: 'none', 
                            fontSize: '13px', 
                            flex: 1, 
                            minWidth: '100px',
                            background: 'transparent'
                          }}
                          onKeyDown={(e) => {
                            if (e.key === ',' || e.key === 'Enter') {
                              e.preventDefault();
                              const val = e.target.value.trim().replace(/,$/, '');
                              if (val && !formData.tags.includes(val)) {
                                setFormData(p => ({ ...p, tags: [...p.tags, val] }));
                                e.target.value = '';
                              }
                            }
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl border border-blue-100">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-600 rounded-lg text-white">
                          <Briefcase className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-blue-900 leading-none mb-1">Availability</p>
                          <p className="text-[11px] text-blue-700">Allow brands to hire you for projects</p>
                        </div>
                      </div>
                      <div 
                        onClick={() => handleInputChange({ target: { name: 'is_available', type: 'checkbox', checked: !formData.is_available } })}
                        className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-all duration-300 ${formData.is_available ? 'bg-blue-600' : 'bg-gray-300'}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-all duration-300 transform ${formData.is_available ? 'translate-x-6' : 'translate-x-0'}`} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>


            {/* SAVE BUTTON */}
            <div style={{ marginTop: '48px' }}>
              <button 
                type="button"
                onClick={handleSubmit} 
                disabled={loading}
                style={{ 
                  width: '100%',
                  fontSize: '16px', 
                  padding: '16px', 
                  borderRadius: '8px', 
                  border: 'none', 
                  background: '#3B82F6', 
                  color: '#FFFFFF', 
                  cursor: 'pointer', 
                  opacity: loading ? 0.7 : 1,
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#2563EB'}
                onMouseOut={(e) => e.currentTarget.style.background = '#3B82F6'}
              >
                {loading ? 'Saving...' : 'Save Settings'}
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
