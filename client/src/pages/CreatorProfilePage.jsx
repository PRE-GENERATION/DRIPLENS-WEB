import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare,
  Video,
  MapPin,
  Layers,
  Camera,
  Quote,
  Edit,
  Trash2,
  Plus,
  X,
  Upload,
  Loader2,
  Globe,
  Instagram,
  Eye,
  TrendingUp,
  BarChart2,
  Users,
  Bookmark,
  MoreHorizontal,
  Star,
  UserPlus
} from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';



/* Derive readable initials from a username / display_name */
function initials(str = 'A') {
  return str.split(/[\s_]/).slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('');
}

export default function CreatorProfilePage() {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const { user }     = useAuth();

  const [creator,       setCreator]       = useState(null);
  const [error,         setError]         = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(null);

  const [portfolioFilter, setPortfolioFilter] = useState('All');
  const [editingProject, setEditingProject] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  /* Resolve 'me' → real user id, then fetch */
  const load = async () => {
    const resolvedId = id === 'me' ? user?.id : id;
    if (!resolvedId) return;

    try {
      const data = await api.get(`/creators/${resolvedId}`);
      if (data?.data?.creator) {
        setCreator(data.data.creator);
      } else {
        setError('Creator not found');
      }
    } catch (err) {
      setError(err.message || 'Failed to load creator profile');
    }
  };

  useEffect(() => {
    load();
    window.scrollTo(0, 0);
  }, [id, user?.id]);

  const isOwnProfile = user && creator && user.id === creator.id;

  /* ── Portfolio filter ── */
  const portfolioProjects = creator?.portfolio_projects || [];
  const filteredProjects = portfolioFilter === 'All'
    ? portfolioProjects
    : portfolioProjects.filter(project =>
        project.items?.some(item =>
          portfolioFilter === 'Video'
            ? item.media_type === 'video'
            : item.media_type !== 'video'
        )
      );

  const [activeTab, setActiveTab] = useState('Projects');

  /* ── Error / loading states ── */
  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-6">
        <h2 className="text-3xl font-bold">{error}</h2>
        <Link to="/creators" className="btn-primary py-3 px-8">Back to Creators</Link>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  /* Derive display values from real profile fields */
  const displayName  = creator.display_name || creator.username || 'Salih Turan';
  const roleLabel    = creator.category || 'Creator';
  const locationLabel = creator.location || 'Bursa, Turkey';
  const bio          = creator.bio || 'A multi-disciplinary creative professional with a passion for pushing visual boundaries and capturing the essence of the moment.';
  
  const stats = [
    { label: 'Total Views', value: '1.2M', icon: Eye },
    { label: 'Recent Rank', value: '#12', icon: TrendingUp },
    { label: 'All-Time Rank', value: '#45', icon: BarChart2 },
    { label: 'Followers', value: '8.4K', icon: Users },
  ];




  return (
    <div className="bg-white min-h-screen pb-20 font-sans text-[#111111]">

      {/* ── Minimal Top Navigation ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center bg-white sticky top-0 z-30 border-b border-zinc-50">
        <Link to="/explore" className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-black transition-colors flex items-center gap-2">
          <span>←</span> Back
        </Link>
        <div className="flex items-center gap-4">
          {isOwnProfile && (
            <Link to="/profile/edit" className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-black transition-all">
              Settings
            </Link>
          )}
          <button className="text-zinc-400 hover:text-black">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ── Profile Header Section ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10">
        <div className="flex flex-col md:flex-row items-start justify-between gap-6">
          <div className="flex flex-col md:flex-row items-start gap-6 flex-1">
            {/* Circular Avatar */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative shrink-0"
            >
              <div className="w-[100px] h-[100px] rounded-none border border-zinc-900 shadow-sm overflow-hidden bg-zinc-50">
                {creator.avatar_url ? (
                  <img 
                    src={creator.avatar_url} 
                    alt={displayName} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-zinc-300">
                    {initials(displayName)}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Name and Bio */}
            <div className="flex-1">
              <h1 className="text-[28px] md:text-[32px] font-bold text-zinc-900 leading-tight mb-2">{displayName}</h1>
              <p className="text-zinc-500 text-[15px] leading-relaxed mb-4 max-w-xl">
                {bio}
              </p>
              
              {/* Location and Socials */}
              <div className="flex flex-wrap items-center gap-4 text-zinc-400 text-[14px]">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" /> {locationLabel}
                </div>
                <div className="flex items-center gap-4">
                  <a href="#" className="hover:text-zinc-900 transition-colors flex items-center gap-1.5">
                    <Globe className="w-4 h-4" /> website
                  </a>
                  <a href="#" className="hover:text-zinc-900 transition-colors flex items-center gap-1.5">
                    <Instagram className="w-4 h-4" /> instagram
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 self-end md:self-start mt-4 md:mt-2">
            <button 
              onClick={() => navigate(`/profile/${creator.id}/pricing`)}
              className="flex items-center gap-2 px-8 py-2.5 bg-black text-white border border-black rounded-none shadow-md text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all"
            >
              Hire Me
            </button>
            <button 
              onClick={() => navigate(`/dm/${creator.id}`)}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-zinc-900 rounded-none shadow-sm text-sm font-semibold hover:bg-zinc-50 transition-all"
            >
              <MessageSquare className="w-4 h-4" /> Message
            </button>
          </div>
        </div>
      </div>

      {/* ── Statistics Section ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Performance Card */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-white rounded-none border border-transparent hover:border-zinc-900 shadow-none hover:shadow-sm p-6 flex items-center justify-between transition-all duration-300 cursor-default group"
          >
            <div className="flex flex-col gap-1">
              <span className="text-[22px] font-bold text-zinc-900">1.2M</span>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Total Views</span>
            </div>
            <div className="flex flex-col gap-1 text-center">
              <span className="text-[22px] font-bold text-zinc-900">#12</span>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">30-day Rank</span>
            </div>
            <div className="flex flex-col gap-1 text-right">
              <span className="text-[22px] font-bold text-zinc-900">#45</span>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">All-time Rank</span>
            </div>
          </motion.div>

          {/* Activity Card */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-white rounded-none border border-transparent hover:border-zinc-900 shadow-none hover:shadow-sm p-6 flex items-center justify-between transition-all duration-300 cursor-default group"
          >
            <div className="flex flex-col gap-1 opacity-50">
              <span className="text-[22px] font-bold text-zinc-900">0</span>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Challenges Won</span>
            </div>
            <div className="flex flex-col gap-1 text-center">
              <span className="text-[22px] font-bold text-zinc-900">14</span>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Shortlisted</span>
            </div>
            <div className="flex flex-col gap-1 text-right opacity-50">
              <span className="text-[22px] font-bold text-zinc-900">0</span>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Meetups</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Image Gallery Grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-4 mb-8">
          {['All', 'Video', 'Photos'].map(f => (
            <button
              key={f}
              onClick={() => setPortfolioFilter(f)}
              className={`px-6 py-2 rounded-none text-[11px] font-bold uppercase tracking-widest transition-all ${
                portfolioFilter === f 
                ? 'bg-zinc-900 text-white shadow-lg' 
                : 'bg-zinc-50 text-zinc-500 hover:bg-zinc-100 border border-zinc-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center bg-zinc-50 rounded-none border border-dashed border-zinc-200">
            <Layers className="w-16 h-16 text-zinc-200 mb-6" />
            <p className="text-zinc-500 text-lg font-medium mb-8">
              {isOwnProfile ? 'Your portfolio is currently empty.' : 'No projects found in this category.'}
            </p>
            {isOwnProfile && (
              <Link to="/upload" className="bg-black text-white px-10 py-4 rounded-none text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-xl">
                Add Your First Project
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[16px]">
            {filteredProjects.map((project, i) => {
              const firstItem = project.items?.[0] || {};
              const hasMedia = firstItem.media_url;

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.02 }}
                  className="group"
                >
                  <motion.div 
                    whileHover={{ scale: 1.01, y: -2 }}
                    onClick={() => setSelectedMedia({
                      ...project,
                      mediaUrl: firstItem.media_url,
                      mediaType: firstItem.media_type,
                      items: project.items
                    })}
                    className="relative aspect-square rounded-none overflow-hidden bg-zinc-50 cursor-pointer hover:shadow-xl transition-all duration-300 border border-transparent hover:border-zinc-900"
                  >
                    {hasMedia ? (
                      <>
                        {firstItem.media_type === 'video' ? (
                          <video
                            src={firstItem.media_url}
                            className="w-full h-full object-cover"
                            muted
                            playsInline
                            onMouseEnter={e => e.target.play()}
                            onMouseLeave={e => {
                              e.target.pause();
                              e.target.currentTime = 0;
                            }}
                          />
                        ) : (
                          <img
                            src={firstItem.media_url}
                            alt={project.title}
                            loading="lazy"
                            className="w-full h-full object-cover"
                          />
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-zinc-50">
                        <Camera className="w-10 h-10 text-zinc-200 mb-4" />
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">No Preview</p>
                      </div>
                    )}

                    {/* Favorite Star Icon */}
                    <div className="absolute top-3 left-3 z-10">
                      <button className="p-1.5 bg-black/10 hover:bg-black/20 backdrop-blur-sm rounded-none text-white transition-all">
                        <Star className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {/* More Menu Overlay */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <button className="p-1.5 bg-white/90 backdrop-blur-sm rounded-none shadow-sm text-zinc-600 hover:text-black transition-all border border-zinc-200">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Lightbox (Minimalist) ── */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white flex flex-col"
            onClick={() => setSelectedMedia(null)}
          >
            <div className="flex justify-between items-center px-8 py-6 shrink-0 border-b border-zinc-50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-none border border-zinc-900 overflow-hidden">
                  <img src={creator.avatar_url} className="w-full h-full object-cover" alt="" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">{displayName}</h4>
                  <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest">{roleLabel}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => navigate(`/dm/${creator.id}`)}
                  className="bg-black text-white px-6 py-2 rounded-none text-xs font-bold hover:bg-zinc-800 transition-all"
                >
                  Hire Me
                </button>
                <button 
                  onClick={() => setSelectedMedia(null)}
                  className="p-2 hover:bg-zinc-100 rounded-none transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-12" onClick={e => e.stopPropagation()}>
              <div className="max-w-5xl mx-auto">
                <div className="mb-12">
                  <h2 className="text-4xl font-bold text-zinc-900 mb-4">{selectedMedia.title}</h2>
                  <p className="text-zinc-500 text-lg leading-relaxed max-w-2xl">{selectedMedia.description}</p>
                </div>
                
                <div className="space-y-20">
                  {selectedMedia.items?.map((item, idx) => (
                    <div key={idx} className="relative w-full flex justify-center">
                      {item.media_type === 'video' ? (
                        <video 
                          src={item.media_url} 
                          controls 
                          className="max-w-full max-h-[85vh] object-contain rounded-none shadow-md border border-zinc-100" 
                        />
                      ) : (
                        <img 
                          src={item.media_url} 
                          alt="" 
                          className="max-w-full max-h-[85vh] object-contain rounded-none shadow-md border border-zinc-100" 
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Edit Project Modal (Reusing existing logic) ── */}
      <AnimatePresence>
        {editingProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-white/95 flex items-center justify-center p-4 backdrop-blur-md"
            onClick={() => setEditingProject(null)}
          >
            <motion.div
              initial={{ scale: 0.98, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.98, opacity: 0, y: 10 }}
              className="max-w-4xl w-full bg-white rounded-3xl overflow-hidden relative shadow-2xl p-10 border border-zinc-100 max-h-[90vh] flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-10 shrink-0">
                <h2 className="text-2xl font-bold tracking-tight">Edit Project</h2>
                <button
                  onClick={() => setEditingProject(null)}
                  className="p-2 hover:bg-zinc-100 rounded-full transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar pr-4">
                <form id="edit-project-form" onSubmit={async (e) => {
                  e.preventDefault();
                  setIsSaving(true);
                  try {
                    await api.patch(`/upload/projects/${editingProject.id}`, {
                      title: editingProject.title,
                      description: editingProject.description || null,
                      category: editingProject.category
                    });
                    await load();
                    setEditingProject(null);
                  } catch (err) {
                    alert(err.message || 'Failed to update project');
                  } finally {
                    setIsSaving(false);
                  }
                }} className="space-y-8 mb-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Title</label>
                      <input 
                        type="text" 
                        value={editingProject.title}
                        onChange={e => setEditingProject({...editingProject, title: e.target.value})}
                        className="w-full bg-zinc-50 border border-zinc-100 px-6 py-4 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Category</label>
                      <select 
                        value={editingProject.category}
                        onChange={e => setEditingProject({...editingProject, category: e.target.value})}
                        className="w-full bg-zinc-50 border border-zinc-100 px-6 py-4 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5 transition-all appearance-none"
                      >
                        {['Cinematography', 'Photography', '3D Motion', 'Design', 'Illustration', 'Animation', 'Graphic Design', 'VFX'].map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Description</label>
                    <textarea 
                      rows={4}
                      value={editingProject.description || ''}
                      onChange={e => setEditingProject({...editingProject, description: e.target.value})}
                      className="w-full bg-zinc-50 border border-zinc-100 px-6 py-4 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5 transition-all resize-none"
                    />
                  </div>
                </form>

                {/* Media Management */}
                <div className="space-y-8">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold">Project Media</h3>
                    <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-black cursor-pointer hover:bg-zinc-50 transition-all px-6 py-3 border border-zinc-200 rounded-full">
                      <Plus className="w-4 h-4" /> Add Media
                      <input 
                        type="file" 
                        multiple 
                        className="hidden" 
                        onChange={async (e) => {
                          if (!e.target.files?.length) return;
                          const formData = new FormData();
                          Array.from(e.target.files).forEach(file => formData.append('media', file));
                          formData.append('project_id', editingProject.id);
                          formData.append('category', editingProject.category);
                          formData.append('title', editingProject.title);
                          
                          setIsSaving(true);
                          try {
                            await api.post('/upload/portfolio', formData, {
                              headers: { 'Content-Type': 'multipart/form-data' }
                            });
                            await load();
                            const res = await api.get(`/creators/${creator.id}`);
                            const updated = res.data.creator.portfolio_projects.find(p => p.id === editingProject.id);
                            setEditingProject(updated);
                          } catch (err) {
                            alert(err.message || 'Upload failed');
                          } finally {
                            setIsSaving(false);
                          }
                        }}
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                    {editingProject.items?.map((item, idx) => (
                      <div key={item.id} className="relative group aspect-square bg-zinc-50 border border-zinc-100 rounded-2xl overflow-hidden shadow-sm">
                        {item.media_type === 'video' ? (
                          <div className="w-full h-full flex items-center justify-center">
                            <Video className="w-8 h-8 text-zinc-200" />
                          </div>
                        ) : (
                          <img src={item.media_url} className="w-full h-full object-cover" alt="" />
                        )}
                        <button
                          onClick={async () => {
                            if (!confirm('Remove this item?')) return;
                            try {
                              await api.delete(`/upload/portfolio/${item.id}`);
                              setEditingProject(prev => ({
                                ...prev,
                                items: prev.items.filter(i => i.id !== item.id)
                              }));
                              await load();
                            } catch (err) {
                              alert(err.message || 'Delete failed');
                            }
                          }}
                          className="absolute top-3 right-3 p-2 bg-white/90 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white shadow-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-zinc-100 flex justify-between items-center shrink-0">
                <button
                  onClick={async () => {
                    if (!confirm('Delete this entire project? This cannot be undone.')) return;
                    try {
                      await api.delete(`/upload/projects/${editingProject.id}`);
                      await load();
                      setEditingProject(null);
                    } catch (err) {
                      alert(err.message || 'Failed to delete project');
                    }
                  }}
                  className="flex items-center gap-2 text-red-500 text-[11px] font-bold uppercase tracking-widest hover:text-red-700 transition-all"
                >
                  <Trash2 className="w-4 h-4" /> Delete Project
                </button>

                <div className="flex gap-4">
                  <button
                    onClick={() => setEditingProject(null)}
                    className="px-8 py-3.5 text-[11px] font-bold uppercase tracking-widest border border-zinc-200 rounded-full hover:bg-zinc-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    form="edit-project-form"
                    type="submit"
                    disabled={isSaving}
                    className="px-10 py-3.5 text-[11px] font-bold uppercase tracking-widest bg-black text-white rounded-full hover:bg-zinc-800 transition-all flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-black/10"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
