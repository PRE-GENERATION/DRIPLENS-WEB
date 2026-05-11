import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  IndianRupee, 
  BadgeCheck, 
  Share2, 
  AlertCircle,
  Clock,
  Box,
  FileText,
  Instagram,
  CheckCircle2,
  X
} from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function OpportunityDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplyDrawer, setShowApplyDrawer] = useState(false);
  const [applyLoading, setApplyLoading] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  
  // Application Form
  const [appData, setAppData] = useState({
    reel_links: '',
    intro_message: '',
    expected_price: '',
    intro_video_url: ''
  });

  useEffect(() => {
    fetchOpportunity();
  }, [id]);

  const fetchOpportunity = async () => {
    try {
      const res = await api.get(`/opportunities/${id}`);
      setOpportunity(res.data);
    } catch (err) {
      console.error('Failed to fetch opportunity:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      navigate('/auth?mode=register&role=creator');
      return;
    }
    setApplyLoading(true);
    try {
      await api.post(`/opportunities/${id}/apply`, {
        ...appData,
        reel_links: appData.reel_links.split(',').map(l => l.trim()),
        expected_price: parseFloat(appData.expected_price)
      });
      setApplySuccess(true);
      setTimeout(() => {
        setShowApplyDrawer(false);
        setApplySuccess(false);
      }, 3000);
    } catch (err) {
      alert(err.message || 'Failed to apply');
    } finally {
      setApplyLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center"><div className="w-8 h-8 border-4 border-black border-t-transparent animate-spin" /></div>;
  if (!opportunity) return <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4"><h1 className="text-4xl font-black uppercase">Not Found</h1><Link to="/opportunities" className="underline font-bold uppercase tracking-widest text-xs">Back to all</Link></div>;

  const timeLeft = new Date(opportunity.application_deadline) - new Date();
  const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{opportunity.title} — Driplens</title>
      </Helmet>

      {/* Hero Header */}
      <div className="border-b-2 border-black px-8 py-12 md:py-24">
        <div className="max-w-6xl mx-auto">
          <button onClick={() => navigate('/opportunities')} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:text-[#0044ff] mb-12">
            <ArrowLeft size={16} /> Back to List
          </button>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div className="flex-1">
              <div className="flex flex-wrap gap-4 mb-6">
                {opportunity.niche?.map(n => (
                  <span key={n} className="px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-widest">{n}</span>
                ))}
                <span className="px-3 py-1 border-2 border-black text-[10px] font-black uppercase tracking-widest">{opportunity.budget_type}</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-6">{opportunity.title}</h1>
              
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 border-2 border-black overflow-hidden shrink-0">
                    <img src={opportunity.brand?.avatar_url || 'https://via.placeholder.com/150'} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Posted by</p>
                    <div className="flex items-center gap-1">
                      <p className="font-black text-sm uppercase tracking-tight">{opportunity.brand?.username}</p>
                      {opportunity.brand?.is_verified && <BadgeCheck size={14} className="text-[#0044ff]" />}
                    </div>
                  </div>
                </div>
                <div className="h-8 w-[1px] bg-gray-100" />
                <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
                  <MapPin size={14} /> {opportunity.city || 'Global'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Layout */}
      <div className="max-w-6xl mx-auto px-8 py-20 flex flex-col lg:flex-row gap-20">
        
        {/* Left Column: Details */}
        <div className="flex-1 space-y-20">
          
          {/* Description */}
          <div className="space-y-6">
            <h3 className="text-sm font-black uppercase tracking-[0.3em] text-gray-300">Campaign Overview</h3>
            <div className="prose prose-lg max-w-none font-medium leading-relaxed text-gray-700">
              {opportunity.description}
            </div>
          </div>

          {/* Goals */}
          {opportunity.campaign_goal && (
            <div className="space-y-6 p-8 bg-gray-50 border-l-4 border-black">
              <h3 className="text-sm font-black uppercase tracking-[0.3em] text-black">Campaign Goal</h3>
              <p className="text-lg font-bold leading-relaxed">{opportunity.campaign_goal}</p>
            </div>
          )}

          {/* Deliverables Grid */}
          <div className="space-y-8">
            <h3 className="text-sm font-black uppercase tracking-[0.3em] text-gray-300">Required Deliverables</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-1 bg-black border-2 border-black">
              <div className="bg-white p-8 text-center">
                <p className="text-4xl font-black mb-1">{opportunity.num_reels || 0}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Reels</p>
              </div>
              <div className="bg-white p-8 text-center">
                <p className="text-4xl font-black mb-1">{opportunity.num_stories || 0}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Stories</p>
              </div>
              <div className="bg-white p-8 text-center">
                <p className="text-4xl font-black mb-1">{opportunity.num_photos || 0}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Photos</p>
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className="space-y-8">
            <h3 className="text-sm font-black uppercase tracking-[0.3em] text-gray-300">Creator Requirements</h3>
            <div className="space-y-4">
              <div className="flex justify-between py-4 border-b border-gray-100">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Minimum Followers</span>
                <span className="text-xs font-black uppercase tracking-widest">{opportunity.min_followers?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-4 border-b border-gray-100">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Gender Preference</span>
                <span className="text-xs font-black uppercase tracking-widest">{opportunity.gender_preference}</span>
              </div>
              <div className="flex justify-between py-4 border-b border-gray-100">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Target Languages</span>
                <span className="text-xs font-black uppercase tracking-widest">{opportunity.language?.join(', ') || 'Any'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Action Panel */}
        <div className="lg:w-96">
          <div className="sticky top-32 space-y-8">
            
            {/* Apply Box */}
            <div className="border-2 border-black p-8 bg-white">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Budget</p>
                  <div className="flex items-center gap-1 text-3xl font-black">
                    <IndianRupee size={20} /> {Number(opportunity.budget_amount || 0).toLocaleString()}
                  </div>
                </div>
                <div className={`px-2 py-1 text-[8px] font-black uppercase tracking-widest border-2 ${daysLeft > 0 ? 'border-red-500 text-red-500' : 'border-gray-200 text-gray-300'}`}>
                  {daysLeft > 0 ? `${daysLeft} DAYS LEFT` : 'CLOSED'}
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest">
                  <Calendar size={14} /> Deadline: {new Date(opportunity.application_deadline).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-gray-400">
                  <Clock size={14} /> Content by: {new Date(opportunity.content_deadline).toLocaleDateString()}
                </div>
              </div>

              <button 
                onClick={() => setShowApplyDrawer(true)}
                disabled={daysLeft <= 0}
                className="w-full py-5 bg-black text-white font-black uppercase tracking-[0.2em] border-2 border-black hover:bg-[#0044ff] hover:border-[#0044ff] transition-all disabled:opacity-50"
              >
                APPLY NOW
              </button>

              <p className="text-[10px] font-bold text-center text-gray-400 uppercase tracking-widest mt-4">
                Payments secured via Driplens Escrow
              </p>
            </div>

            {/* Extra Info */}
            <div className="p-8 border border-gray-100 bg-gray-50/50 space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-widest">Specifications</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                  <CheckCircle2 size={14} className={opportunity.raw_files_needed ? 'text-black' : 'text-gray-200'} />
                  Raw Files Needed
                </div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                  <CheckCircle2 size={14} className={opportunity.usage_rights ? 'text-black' : 'text-gray-200'} />
                  Usage Rights Required
                </div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                  <AlertCircle size={14} className="text-black" />
                  {opportunity.num_revisions} Revision Rounds
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Drawer Overlay */}
      <AnimatePresence>
        {showApplyDrawer && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowApplyDrawer(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ y: '100%' }} 
              animate={{ y: 0 }} 
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 w-full md:w-[600px] md:left-1/2 md:-translate-x-1/2 bg-white z-[101] border-t-4 border-black p-8 md:p-12 h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-12">
                <h2 className="text-3xl font-black uppercase tracking-tighter">Submit Application</h2>
                <button onClick={() => setShowApplyDrawer(false)} className="p-2 border-2 border-gray-100 hover:border-black transition-all">
                  <X size={20} />
                </button>
              </div>

              {applySuccess ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter">Application Sent!</h3>
                  <p className="text-sm font-bold uppercase tracking-widest text-gray-400">The brand will review your profile and get back to you.</p>
                </div>
              ) : (
                <form onSubmit={handleApply} className="space-y-8">
                  <div className="p-6 bg-gray-50 border-2 border-black">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Portfolio Pull</p>
                    <p className="text-xs font-bold uppercase tracking-widest">Your Driplens profile will be automatically attached to this application.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Previous Work (Reel Links)</label>
                    <textarea 
                      placeholder="Paste 2-3 Instagram Reel or YouTube links (comma separated)"
                      className="w-full p-4 border-2 border-black font-bold outline-none focus:border-[#0044ff] resize-none"
                      rows={3}
                      value={appData.reel_links}
                      onChange={(e) => setAppData(p => ({ ...p, reel_links: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Pitch (Max 200 chars)</label>
                    <textarea 
                      placeholder="Why are you the perfect fit for this campaign?"
                      maxLength={200}
                      className="w-full p-4 border-2 border-black font-bold outline-none focus:border-[#0044ff] resize-none"
                      rows={4}
                      value={appData.intro_message}
                      onChange={(e) => setAppData(p => ({ ...p, intro_message: e.target.value }))}
                      required
                    />
                    <p className="text-[10px] text-right font-bold text-gray-400">{appData.intro_message.length}/200</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Expected Price (INR)</label>
                    <input 
                      type="number"
                      placeholder="Enter your fee"
                      className="w-full p-4 border-2 border-black font-bold text-xl outline-none focus:border-[#0044ff]"
                      value={appData.expected_price}
                      onChange={(e) => setAppData(p => ({ ...p, expected_price: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Intro Video (Optional)</label>
                    <input 
                      type="url"
                      placeholder="Paste a 20-sec Loom/Google Drive link"
                      className="w-full p-4 border-2 border-black font-bold outline-none focus:border-[#0044ff]"
                      value={appData.intro_video_url}
                      onChange={(e) => setAppData(p => ({ ...p, intro_video_url: e.target.value }))}
                    />
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">A short intro video increases hiring chances by 40%.</p>
                  </div>

                  <button 
                    type="submit" 
                    disabled={applyLoading}
                    className="w-full py-5 bg-[#0044ff] text-white font-black uppercase tracking-[0.2em] border-2 border-[#0044ff] hover:bg-black hover:border-black transition-all disabled:opacity-50"
                  >
                    {applyLoading ? 'SUBMITTING...' : 'CONFIRM APPLICATION'}
                  </button>
                </form>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
