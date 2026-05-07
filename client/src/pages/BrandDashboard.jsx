import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Zap, 
  MessageSquare, 
  User, 
  Plus, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  CheckSquare,
  BarChart3,
  ExternalLink,
  Search,
  ArrowUpRight
} from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

// ─── StatCard ────────────────────────────────────────────────────────────────
function StatCard({ label, value, loading, icon: Icon }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-[#EEEEEE] p-6 relative overflow-hidden group"
    >
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-[#AAAAAA] text-[9px] font-bold uppercase tracking-[0.4em] mb-2">{label}</p>
          {loading ? (
            <div className="h-10 w-24 bg-[#F5F5F5] animate-pulse" />
          ) : (
            <h2 className="text-4xl font-bold text-black tracking-tighter">{value}</h2>
          )}
        </div>
        <div className="p-2 bg-[#FAFAFA] border border-[#EEEEEE] group-hover:border-black transition-colors">
          <Icon className="w-4 h-4 text-[#AAAAAA] group-hover:text-black transition-colors" />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
    </motion.div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    Pending:   'border-[#EEEEEE] text-[#AAAAAA]',
    Accepted:  'border-black bg-black text-white',
    Declined:  'border-red-200 text-red-500',
    Completed: 'border-green-200 text-green-600',
    Review:    'border-blue-200 text-blue-600',
  };
  return (
    <span className={`inline-block px-3 py-1 text-[8px] font-bold uppercase tracking-widest border ${map[status] ?? 'border-[#EEEEEE] text-[#AAAAAA]'}`}>
      {status}
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function BrandDashboard() {
  const { user } = useAuth();
  const [requests,    setRequests]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [form,        setForm]        = useState({
    creator_id: '', project_title: '', project_description: '', budget: '',
  });
  const [submitting,  setSubmitting]  = useState(false);
  const [formError,   setFormError]   = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/hiring');
        const all  = res.data?.requests ?? [];
        setRequests(all.filter(r => r.brand_id === user?.id));
      } catch (err) {
        console.error('Failed to load hiring requests:', err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) load();
  }, [user?.id]);
 
   const socket = useSocket();
 
   useEffect(() => {
     if (!socket) return;
     const handleHiringUpdate = (updatedReq) => {
       setRequests(prev => prev.map(r => r.id === updatedReq.id ? updatedReq : r));
     };
     socket.on('hiring_update', handleHiringUpdate);
     return () => socket.off('hiring_update', handleHiringUpdate);
   }, [socket]);

  const totalBriefs  = requests.length;
  const pendingCount = requests.filter(r => r.status === 'Pending').length;
  const activeCount  = requests.filter(r => r.status === 'Accepted').length;

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setFormError('');
    setFormSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (form.project_title.trim().length < 3) {
      setFormError('Project title too short.');
      return;
    }
    const budgetNum = parseFloat(form.budget);
    if (!budgetNum || budgetNum <= 0) {
      setFormError('Invalid budget.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        project_title:       form.project_title.trim(),
        project_description: form.project_description.trim(),
        budget:              budgetNum,
        ...(form.creator_id.trim() && { creator_id: form.creator_id.trim() }),
      };
      const res = await api.post('/hiring', payload);
      const newRequest = res.data?.request;
      if (newRequest) setRequests(prev => [newRequest, ...prev]);
      setFormSuccess('Brief posted successfully.');
      setForm({ creator_id: '', project_title: '', project_description: '', budget: '' });
    } catch (err) {
      setFormError(err.message || 'Failed to post brief.');
    } finally {
      setSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="min-h-screen bg-white selection:bg-black selection:text-white antialiased">
      <Helmet>
        <title>Dashboard — {user?.username}</title>
      </Helmet>

      {/* ── Top Bar Navigation ── */}
      <div className="border-b border-[#F5F5F5] sticky top-0 z-50 bg-white/80 backdrop-blur-xl">
        <div className="max-w-[1600px] mx-auto px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="w-2 h-2 bg-black rounded-full" />
             <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-black">Console v1.0</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/messages" className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-[#AAAAAA] hover:text-black transition-colors">
              <MessageSquare className="w-3.5 h-3.5" /> Messages
            </Link>
            <Link to="/profile/edit" className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-[#AAAAAA] hover:text-black transition-colors">
              <User className="w-3.5 h-3.5" /> Profile
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-8 py-12">
        
        {/* ── Header Section ── */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="px-3 py-1 border border-black text-[9px] font-bold uppercase tracking-[0.4em]">Brand Account</div>
            <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#AAAAAA]">Session Active</div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4">
            Welcome back, <br />
            <span className="text-[#DDDDDD]">{user?.username}</span>
          </h1>
          <p className="text-[#666666] text-sm font-light leading-relaxed max-w-md">
            Overview of your creative ecosystem. Track, manage, and scale your brand partnerships.
          </p>
        </motion.div>

        {/* ── Stats Grid ── */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-1 mb-16"
        >
          <StatCard label="Total Briefs" value={totalBriefs} loading={loading} icon={BarChart3} />
          <StatCard label="Awaiting Response" value={pendingCount} loading={loading} icon={Clock} />
          <StatCard label="Active Network" value={activeCount} loading={loading} icon={Zap} />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
          
          {/* ── Tracker Section ── */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-8 border-b border-[#F5F5F5] pb-6">
              <h2 className="text-[10px] uppercase tracking-[0.5em] font-black">Sent Requests Tracker</h2>
              <div className="flex items-center gap-4">
                <Search className="w-3.5 h-3.5 text-[#AAAAAA]" />
                <span className="text-[9px] uppercase tracking-widest font-bold text-[#AAAAAA]">Filter by status</span>
              </div>
            </div>

            {loading ? (
              <div className="space-y-1">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-16 bg-[#FAFAFA] animate-pulse" />
                ))}
              </div>
            ) : requests.length === 0 ? (
              <div className="border border-dashed border-[#EEEEEE] py-20 text-center">
                <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#AAAAAA] mb-4">No data available</p>
                <button className="text-[9px] font-bold uppercase tracking-widest border border-[#EEEEEE] px-6 py-3 hover:border-black transition-all">Generate First Brief</button>
              </div>
            ) : (
              <div className="space-y-1">
                {requests.map(r => (
                  <motion.div 
                    key={r.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="group border border-[#F5F5F5] bg-white p-6 flex flex-wrap items-center justify-between gap-6 hover:border-black hover:shadow-xl transition-all duration-500 relative overflow-hidden"
                  >
                    <div className="flex items-center gap-4">
                      {r.creator?.avatar_url ? (
                        <img src={r.creator.avatar_url} alt="" className="w-10 h-10 object-cover grayscale group-hover:grayscale-0 transition-all" />
                      ) : (
                        <div className="w-10 h-10 bg-[#FAFAFA] border border-[#EEEEEE] flex items-center justify-center">
                          <User className="w-4 h-4 text-[#AAAAAA]" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-sm font-bold tracking-tight mb-1">{r.project_title}</h3>
                        <p className="text-[9px] uppercase tracking-widest font-bold text-[#AAAAAA]">to {r.creator?.username ?? 'Network'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-12">
                      <div className="text-right">
                        <div className="text-xs font-black mb-1">${Number(r.budget).toLocaleString()}</div>
                        <div className="text-[8px] uppercase tracking-widest text-[#AAAAAA]">Allocation</div>
                      </div>
                      <StatusBadge status={r.status} />
                      <div className="flex items-center gap-3">
                         {r.status === 'Accepted' ? (
                           <Link to="/messages" className="p-2 border border-[#EEEEEE] hover:border-black transition-colors group/btn">
                             <MessageSquare className="w-3.5 h-3.5 text-[#AAAAAA] group-hover/btn:text-black transition-colors" />
                           </Link>
                         ) : (
                           <div className="p-2 border border-[#F9F9F9] opacity-30 cursor-not-allowed">
                             <MessageSquare className="w-3.5 h-3.5 text-[#AAAAAA]" />
                           </div>
                         )}
                         <Link to={`/profile/${r.creator?.id}`} className="p-2 border border-[#EEEEEE] hover:border-black transition-colors group/btn">
                            <ArrowUpRight className="w-3.5 h-3.5 text-[#AAAAAA] group-hover/btn:text-black transition-colors" />
                         </Link>
                      </div>
                    </div>
                    
                    <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-transparent group-hover:border-black transition-all duration-500" />
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* ── Post a Brief Sidebar ── */}
          <div className="lg:col-span-1 space-y-12">
            <div className="bg-black p-8 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/5 to-transparent -z-0" />
              <div className="relative z-10">
                <h2 className="text-2xl font-bold tracking-tighter mb-2">Execute Brief</h2>
                <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#666666] mb-10">Initialize Network Response</p>

                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <label className="text-[8px] uppercase tracking-[0.4em] font-bold text-[#666666]">Identifier</label>
                    <input
                      type="text"
                      name="creator_id"
                      value={form.creator_id}
                      onChange={handleChange}
                      placeholder="CREATOR_ID (OPTIONAL)"
                      className="w-full bg-[#111111] border border-[#222222] p-4 text-[10px] font-bold tracking-widest text-white placeholder-[#333333] focus:outline-none focus:border-[#444444] transition-colors"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[8px] uppercase tracking-[0.4em] font-bold text-[#666666]">Assignment Title</label>
                    <input
                      type="text"
                      name="project_title"
                      value={form.project_title}
                      onChange={handleChange}
                      placeholder="ENTER PROJECT TITLE"
                      required
                      className="w-full bg-[#111111] border border-[#222222] p-4 text-[10px] font-bold tracking-widest text-white placeholder-[#333333] focus:outline-none focus:border-[#444444] transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[8px] uppercase tracking-[0.4em] font-bold text-[#666666]">Allocation ($)</label>
                    <input
                      type="number"
                      name="budget"
                      value={form.budget}
                      onChange={handleChange}
                      placeholder="0.00"
                      required
                      min="1"
                      step="0.01"
                      className="w-full bg-[#111111] border border-[#222222] p-4 text-[10px] font-bold tracking-widest text-white placeholder-[#333333] focus:outline-none focus:border-[#444444] transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[8px] uppercase tracking-[0.4em] font-bold text-[#666666]">Directive</label>
                    <textarea
                      name="project_description"
                      value={form.project_description}
                      onChange={handleChange}
                      placeholder="DESCRIBE THE ASSIGNMENT..."
                      required
                      rows={4}
                      className="w-full bg-[#111111] border border-[#222222] p-4 text-[10px] font-bold tracking-widest text-white placeholder-[#333333] focus:outline-none focus:border-[#444444] transition-colors resize-none"
                    />
                  </div>

                  <AnimatePresence>
                    {(formError || formSuccess) && (
                      <motion.p 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className={`text-[9px] font-bold uppercase tracking-widest ${formError ? 'text-red-500' : 'text-green-500'}`}
                      >
                        {formError || formSuccess}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-white text-black text-[10px] font-black uppercase tracking-[0.5em] py-5 hover:bg-[#EEEEEE] transition-all disabled:opacity-50 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                  >
                    {submitting ? 'PROCESSING...' : 'INITIALIZE BRIEF'}
                  </button>
                </form>
              </div>
            </div>

            <Link
              to="/messages"
              className="group border border-[#EEEEEE] p-8 flex items-center justify-between hover:border-black transition-all"
            >
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.5em] mb-1">Encrypted Comms</h3>
                <p className="text-[8px] text-[#AAAAAA] uppercase tracking-widest font-bold">Access all active threads</p>
              </div>
              <div className="p-3 bg-[#FAFAFA] border border-[#EEEEEE] group-hover:border-black transition-colors">
                 <MessageSquare className="w-4 h-4 text-[#AAAAAA] group-hover:text-black transition-colors" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
