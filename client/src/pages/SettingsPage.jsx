import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  Search, 
  Upload, 
  X, 
  Check, 
  ChevronDown, 
  Globe, 
  Mail, 
  FileText, 
  Video, 
  Image as ImageIcon,
  Trash2,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link as LinkIcon,
  Circle
} from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

import AppearanceSettings from '../components/settings/AppearanceSettings';
import PasswordSettings from '../components/settings/PasswordSettings';
import CompanyProfileSettings from '../components/settings/CompanyProfileSettings';

const BRAND_TABS = [
  'My details',
  'Profile',
  'Password',
  'Team',
  'Appearance',
  'Plan',
  'Billing',
  'Notifications',
  'Integrations',
  'API'
];

const CREATOR_TABS = [
  'My details',
  'Profile',
  'Password',
  'Email',
  'Notifications'
];

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isBrand = user?.role === 'brand';
  const tabs = isBrand ? BRAND_TABS : CREATOR_TABS;
  
  const [activeTab, setActiveTab] = useState('My details');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [avatarPreview, setAvatarPreview] = useState('https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150');
  const [avatarFile, setAvatarFile] = useState(null);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    country: 'India',
    timezone: 'Indian Standard Time (IST) UTC+05:30',
    bio: '',
    instagram: '',
    twitter: '',
    linkedin: '',
    website: '',
    min_budget: 0,
    max_budget: 10000,
    platforms: [],
    tags: []
  });

  const [files, setFiles] = useState([
    { id: 1, name: 'Tech design requirements.pdf', size: '200 KB', progress: 100, status: 'complete', type: 'pdf' },
    { id: 2, name: 'Dashboard recording.mp4', size: '1 MB', progress: 40, status: 'uploading', type: 'video' },
    { id: 3, name: 'Dashboard prototype FINAL.fig', size: '4 MB', progress: 80, status: 'uploading', type: 'figma' }
  ]);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) return;
      try {
        const res = await api.get(`/creators/${user.id}`);
        const creator = res.data.creator;
        const [first, ...last] = (user.full_name || '').split(' ');
        setFormData({
          firstName: first || '',
          lastName: last.join(' ') || '',
          email: user.email || '',
          role: creator.category || '',
          country: creator.location || 'India',
          timezone: 'Indian Standard Time (IST) UTC+05:30',
          bio: creator.bio || '',
          instagram: creator.instagram || '',
          twitter: creator.twitter || '',
          linkedin: creator.linkedin || '',
          website: creator.website || '',
          min_budget: creator.min_budget || 0,
          max_budget: creator.max_budget || 10000,
          platforms: creator.platforms || [],
          tags: creator.tags || []
        });
        if (creator.avatar_url) setAvatarPreview(creator.avatar_url);
      } catch (err) {
        console.error('Failed to load settings:', err);
      } finally {
        setInitialLoading(false);
      }
    };
    loadProfile();
  }, [user?.id, user?.full_name, user?.email]);

  const handleSave = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      let avatarUrl = avatarPreview;
      if (avatarFile) {
        const avatarFormData = new FormData();
        avatarFormData.append('avatar', avatarFile);
        const res = await api.post('/upload/avatar', avatarFormData);
        avatarUrl = res.data.publicUrl;
      }

      const payload = {
        bio: formData.bio,
        category: formData.role,
        location: formData.country,
        instagram: formData.instagram,
        twitter: formData.twitter,
        linkedin: formData.linkedin,
        website: formData.website,
        avatar_url: avatarUrl,
        min_budget: Number(formData.min_budget),
        max_budget: Number(formData.max_budget),
        platforms: formData.platforms,
        tags: formData.tags
      };

      await api.patch('/creators/profile', payload);
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to save settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const removeFile = (id) => {
    setFiles(files.filter(f => f.id !== id));
  };

  if (initialLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white font-sans">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm text-gray-500 animate-pulse">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 settings-container">
      <Helmet>
        <title>Settings — Driplens</title>
      </Helmet>

      <div className="max-w-[1200px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
          <div className="relative w-72" style={{ transform: 'none' }}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search" 
              className="w-full pl-10 pr-12 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-medium text-gray-400 flex items-center gap-0.5">
              <span className="text-xs">⌘</span>K
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-gray-50/50 p-1 rounded-xl border border-gray-100 flex items-center gap-1 mb-10 overflow-x-auto no-scrollbar" style={{ transform: 'none' }}>
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'
              }`}
            >
              {tab}
              {(tab === 'Notifications' || (isBrand && tab === 'Team')) && (
                <span className="ml-2 px-1.5 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded-md border border-gray-200">
                  {tab === 'Notifications' ? '2' : '4'}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Action Header */}
        <div className="flex items-start justify-between pb-6 border-b border-gray-200 mb-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {activeTab === 'Profile' && isBrand ? 'Company profile' : activeTab}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {activeTab === 'My details' ? 'Update your photo and personal details here.' : 
               (activeTab === 'Profile' && isBrand) ? 'Update your company photo and details here.' :
               `Manage your ${activeTab.toLowerCase()} settings.`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 border border-indigo-600 rounded-lg text-sm font-semibold text-white hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {message.text && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-4 rounded-lg text-sm mb-8 flex items-center justify-between ${
                message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'
              }`}
            >
              <div className="flex items-center gap-2">
                {message.type === 'success' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                {message.text}
              </div>
              <button onClick={() => setMessage({ type: '', text: '' })}><X className="w-4 h-4" /></button>
            </motion.div>
          )}
        </AnimatePresence>

        {activeTab === 'My details' && (
          <div className="space-y-8 divide-y divide-gray-200">
            {/* My details content */}
          
          {/* Name */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            <div className="md:col-span-3">
              <label className="text-sm font-medium text-gray-700">Name <span className="text-indigo-600">*</span></label>
            </div>
            <div className="md:col-span-9 flex flex-col md:flex-row gap-4">
              <input 
                type="text" 
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="flex-1 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                placeholder="First name"
              />
              <input 
                type="text" 
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="flex-1 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                placeholder="Last name"
              />
            </div>
          </div>

          {/* Email */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start pt-6">
            <div className="md:col-span-3">
              <label className="text-sm font-medium text-gray-700">Email address <span className="text-indigo-600">*</span></label>
            </div>
            <div className="md:col-span-9">
              <div className="relative max-w-2xl">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                  placeholder="email@example.com"
                />
              </div>
            </div>
          </div>

          {/* Photo */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start pt-6">
            <div className="md:col-span-3">
              <label className="text-sm font-medium text-gray-700">Your photo <span className="text-indigo-600">*</span></label>
              <p className="text-xs text-gray-500 mt-1">This will be displayed on your profile.</p>
            </div>
            <div className="md:col-span-9 flex items-center gap-6">
              <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-200">
                <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 max-w-2xl">
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center hover:border-indigo-400 hover:bg-indigo-50/10 transition-all cursor-pointer group">
                  <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-indigo-50 transition-colors border border-gray-100">
                    <Upload className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                  </div>
                  <p className="text-sm text-gray-600">
                    <span className="text-indigo-600 font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-400 mt-1">SVG, PNG, JPG or GIF (max. 800×400px)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Role */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start pt-6">
            <div className="md:col-span-3">
              <label className="text-sm font-medium text-gray-700">Role</label>
            </div>
            <div className="md:col-span-9">
              <input 
                type="text" 
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="max-w-2xl w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                placeholder="Product Designer"
              />
            </div>
          </div>

          {/* Country */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start pt-6">
            <div className="md:col-span-3">
              <label className="text-sm font-medium text-gray-700">Country</label>
            </div>
            <div className="md:col-span-9">
              <div className="relative max-w-2xl">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center">
                  <span className="text-base">🇦🇺</span>
                </div>
                <select 
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-300 rounded-lg text-sm appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                >
                  <option value="Australia">Australia</option>
                  <option value="United States">United States</option>
                  <option value="India">India</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Timezone */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start pt-6">
            <div className="md:col-span-3 flex items-center gap-1.5">
              <label className="text-sm font-medium text-gray-700">Timezone</label>
              <div className="w-3.5 h-3.5 rounded-full border border-gray-300 flex items-center justify-center text-[8px] text-gray-400 font-bold">?</div>
            </div>
            <div className="md:col-span-9">
              <div className="relative max-w-2xl">
                <Circle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select 
                  name="timezone"
                  value={formData.timezone}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-300 rounded-lg text-sm appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                >
                  <option value="Pacific Standard Time (PST) UTC-08:00">Pacific Standard Time (PST) UTC-08:00</option>
                  <option value="Indian Standard Time (IST) UTC+05:30">Indian Standard Time (IST) UTC+05:30</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start pt-6">
            <div className="md:col-span-3 flex flex-col">
              <label className="text-sm font-medium text-gray-700">Bio <span className="text-indigo-600">*</span></label>
              <p className="text-xs text-gray-500 mt-1">Write a short introduction.</p>
            </div>
            <div className="md:col-span-9 max-w-2xl w-full">
              <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all">
                <div className="flex items-center gap-1 p-1 border-b border-gray-200 bg-white">
                  <button className="p-2 hover:bg-gray-100 rounded text-gray-600 transition-colors"><Bold className="w-4 h-4" /></button>
                  <button className="p-2 hover:bg-gray-100 rounded text-gray-600 transition-colors"><Italic className="w-4 h-4" /></button>
                  <button className="p-2 hover:bg-gray-100 rounded text-gray-600 transition-colors"><Underline className="w-4 h-4" /></button>
                  <div className="w-px h-4 bg-gray-200 mx-1" />
                  <button className="p-2 hover:bg-gray-100 rounded text-gray-600 transition-colors flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-black border border-gray-200" />
                    <ChevronDown className="w-3 h-3 ml-1" />
                  </button>
                  <div className="w-px h-4 bg-gray-200 mx-1" />
                  <button className="p-2 hover:bg-gray-100 rounded text-gray-600 transition-colors"><List className="w-4 h-4" /></button>
                  <button className="p-2 hover:bg-gray-100 rounded text-gray-600 transition-colors"><ListOrdered className="w-4 h-4" /></button>
                </div>
                <textarea 
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="w-full p-4 text-sm bg-white outline-none resize-none min-h-[120px]"
                  placeholder="I'm a..."
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">276 characters left</p>
            </div>
          </div>

          {/* Portfolio Projects - Only for Creators */}
          {!isBrand && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start pt-8 pb-10">
              <div className="md:col-span-3">
                <label className="text-sm font-medium text-gray-700">Portfolio projects</label>
                <p className="text-xs text-gray-500 mt-1">Share a few snippets of your work.</p>
              </div>
              <div className="md:col-span-9 max-w-2xl w-full">
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center hover:border-indigo-400 hover:bg-indigo-50/10 transition-all cursor-pointer mb-6 group">
                  <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-indigo-50 transition-colors border border-gray-100">
                    <Upload className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                  </div>
                  <p className="text-sm text-gray-600">
                    <span className="text-indigo-600 font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-400 mt-1">SVG, PNG, JPG or GIF (max. 800×400px)</p>
                </div>

                {/* File List */}
                <div className="space-y-3">
                  {files.map(file => (
                    <div key={file.id} className="p-4 border border-gray-200 rounded-xl flex items-start gap-4 group">
                      <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                        {file.type === 'pdf' && <FileText className="w-5 h-5 text-red-500" />}
                        {file.type === 'video' && <Video className="w-5 h-5 text-blue-500" />}
                        {file.type === 'figma' && <div className="w-5 h-5 flex items-center justify-center text-[10px] font-bold text-purple-600">FIG</div>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                          <button 
                            onClick={() => removeFile(file.id)}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">{file.size}</span>
                          <div className="w-1 h-1 rounded-full bg-gray-300" />
                          <span className={`text-xs capitalize flex items-center gap-1 ${
                            file.status === 'complete' ? 'text-green-600 font-medium' : 'text-gray-500'
                          }`}>
                            {file.status === 'complete' && <Check className="w-3 h-3" />}
                            {file.status === 'uploading' && <Upload className="w-3 h-3" />}
                            {file.status}
                          </span>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="mt-3 relative h-2 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${file.progress}%` }}
                            className="absolute inset-y-0 left-0 bg-indigo-600 rounded-full"
                          />
                        </div>
                        <div className="mt-1 flex justify-end">
                          <span className="text-[10px] font-medium text-gray-500">{file.progress}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          </div>
        )}

        {activeTab === 'Profile' && (
          isBrand ? <CompanyProfileSettings /> : (
            <div className="space-y-8 divide-y divide-gray-200">
              {/* Creator Social Profiles (Existing content) */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start pt-6">
                <div className="md:col-span-3">
                  <label className="text-sm font-medium text-gray-700">Social Profiles</label>
                  <p className="text-xs text-gray-500 mt-1">Connect your social accounts.</p>
                </div>
                <div className="md:col-span-9 space-y-4 max-w-2xl">
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="text" 
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      placeholder="Instagram handle"
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 font-bold text-[10px] flex items-center justify-center border border-gray-300 rounded">X</div>
                    <input 
                      type="text" 
                      name="twitter"
                      value={formData.twitter}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      placeholder="Twitter/X handle"
                    />
                  </div>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="text" 
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      placeholder="Portfolio website URL"
                    />
                  </div>
                </div>
              </div>

              {/* Expertise */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start pt-6">
                <div className="md:col-span-3">
                  <label className="text-sm font-medium text-gray-700">Expertise Tags</label>
                  <p className="text-xs text-gray-500 mt-1">Add tags to help brands find you.</p>
                </div>
                <div className="md:col-span-9">
                  <input 
                    type="text" 
                    placeholder="Cinematography, Photography, Editing (comma separated)"
                    value={formData.tags?.join(', ') || ''}
                    onChange={(e) => setFormData(p => ({ ...p, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) }))}
                    className="w-full max-w-2xl px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>
            </div>
          )
        )}

        {activeTab === 'Password' && <PasswordSettings />}
        {activeTab === 'Appearance' && <AppearanceSettings />}

        {['Team', 'Plan', 'Billing', 'Email', 'Notifications', 'Integrations', 'API'].includes(activeTab) && (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Circle className="w-8 h-8 text-gray-200 animate-pulse" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{activeTab} Settings</h3>
            <p className="text-gray-500 max-w-xs mt-2">We're working on bringing these settings to you. Check back soon!</p>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200 mt-10">
          <button 
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 border border-indigo-600 rounded-lg text-sm font-semibold text-white hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        /* Ensure no unintended tilting on settings elements */
        .settings-container *, 
        .no-scrollbar,
        button,
        input {
          transform: none !important;
        }
      `}} />
    </div>
  );
}
