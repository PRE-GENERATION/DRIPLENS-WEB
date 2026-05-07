import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  MessageSquare, 
  User, 
  Plus, 
  PlayCircle,
  ArrowUpRight,
  LayoutDashboard,
  Image as ImageIcon,
  Inbox,
  TrendingUp
} from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

// ─── MetricBlock ─────────────────────────────────────────────────────────────
function MetricBlock({ label, value, loading, icon: Icon, trend }) {
  return (
    <motion.div 
      whileHover={{ backgroundColor: '#F9FAFB' }}
      className="border border-[#F0F0F0] p-6 bg-white transition-colors duration-200 flex flex-col group"
    >
      <div className="flex items-center gap-2">
        <div className="p-1 border border-[#F0F0F0] bg-[#FAFAFA]">
          <Icon className="w-3.5 h-3.5 text-[#0D1033]" />
        </div>
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-[#9CA3AF]">{label}</span>
      </div>
      {loading ? (
        <div className="h-9 w-24 bg-gray-50 animate-pulse mt-2" />
      ) : (
        <h2 className="text-5xl text-[#0D1033] mt-2 group-hover:translate-x-1 transition-transform duration-300">{value}</h2>
      )}
      <div className="flex items-center gap-1 mt-2">
        <span className="text-[10px] text-[#9CA3AF] font-bold uppercase tracking-tighter">{trend || '↑ 0.0%'}</span>
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CreatorDashboard() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [requests, setRequests]   = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    
    const load = async () => {
      try {
        const [hiringData, uploadData] = await Promise.all([
          api.get('/hiring'),
          api.get(`/upload?limit=10&creator_id=${user.id}`)
        ]);
        setRequests(hiringData.data.requests || []);
        setPortfolio(uploadData.data.items || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.id]);
 
   const socket = useSocket();
 
   useEffect(() => {
     if (!socket) return;
     const handleHiringUpdate = (updatedReq) => {
       setRequests(prev => {
         const exists = prev.find(r => r.id === updatedReq.id);
         if (exists) {
           return prev.map(r => r.id === updatedReq.id ? updatedReq : r);
         }
         return [updatedReq, ...prev];
       });
     };
     socket.on('hiring_update', handleHiringUpdate);
     return () => socket.off('hiring_update', handleHiringUpdate);
   }, [socket]);

  const pendingRequests = requests.filter(r => r.status === 'Pending');
  const accepted = requests.filter(r => r.status === 'Accepted' || r.status === 'Completed');

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/hiring/${id}/status`, { status });
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  const handleAddWork = () => navigate('/upload');

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', minHeight: '100vh', fontFamily: '"Space Grotesk", sans-serif' }} className="antialiased">
      <Helmet>
        <title>Dashboard — {user?.username}</title>
      </Helmet>

      {/* LEFT SIDEBAR */}
      <div style={{ background: '#fff', borderRight: '0.5px solid #F0F0F0', padding: '24px 14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {/* Nav items */}
        {[
          { label: 'OVERVIEW', onClick: () => navigate('/dashboard/creator'), path: '/dashboard/creator' },
          { label: 'PORTFOLIO', onClick: () => navigate('/profile/' + user?.id), path: '/profile/' + user?.id },
          { label: 'INQUIRIES', onClick: () => {
              navigate('/dashboard/creator');
              setTimeout(() => {
                document.getElementById('inquiries-section')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }, path: '/dashboard/creator' },
          { label: 'MESSAGES', onClick: () => navigate('/messages'), path: '/messages' },
          { label: 'PROFILE', onClick: () => navigate('/profile/edit'), path: '/profile/edit' }
        ].map((item) => {
          const active = (item.label === 'OVERVIEW' && location.pathname === '/dashboard/creator') ||
                         (item.label === 'MESSAGES' && location.pathname === '/messages') ||
                         (item.label === 'PORTFOLIO' && location.pathname.startsWith('/profile/'));
          return (
            <div 
              key={item.label} 
              onClick={item.onClick}
              onMouseEnter={e => e.currentTarget.style.color = '#0D1033'}
              onMouseLeave={e => e.currentTarget.style.color = active ? '#3B50E0' : '#9CA3AF'}
              style={{ 
                fontSize: '11px', 
                color: active ? '#3B50E0' : '#9CA3AF', 
                letterSpacing: '.08em', 
                padding: '7px 10px', 
                borderRadius: '6px', 
                background: active ? '#F5F5FF' : 'transparent', 
                cursor: 'pointer',
                display: 'block',
                transition: 'all 0.2s'
              }}
            >
              {item.label}
            </div>
          );
        })}
      </div>

      {/* MAIN CONTENT */}
      <div style={{ background: '#F8F9FC', padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '24px', letterSpacing: '-.02em', color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '8px', fontWeight: '800' }}>
              Good morning
            </div>
            <div style={{ fontSize: '56px', letterSpacing: '-.05em', color: '#0D1033', lineHeight: '1', textTransform: 'uppercase', fontWeight: '800' }}>
              {user?.username}
            </div>
            <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '10px', letterSpacing: '.06em', textTransform: 'uppercase' }}>
              Profile Performance Matrix · Q2 2026
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '9px', padding: '3px 10px', borderRadius: '999px', border: '0.5px solid #C8D0F8', background: '#EEF0FF', color: '#3B50E0', letterSpacing: '.08em' }}>CREATOR</span>
            <span style={{ fontSize: '9px', padding: '3px 10px', borderRadius: '999px', border: '0.5px solid #BBF7D0', background: '#EDFFF4', color: '#16A34A', letterSpacing: '.08em' }}>ACTIVE</span>
            <span style={{ fontSize: '10px', color: '#9CA3AF', marginLeft: '4px' }}>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {[
            { label: 'PORTFOLIO', value: portfolio.length, color: '#3B50E0', sub: '+0 this month', borderLeft: '3px solid #3B50E0' },
            { label: 'INQUIRIES', value: pendingRequests.length, color: '#C060C0', sub: '+0 new', borderLeft: '3px solid #C060C0' },
            { label: 'PROJECTS', value: accepted.length, color: '#16A34A', sub: 'active', borderLeft: '3px solid #16A34A' },
          ].map(card => (
            <div key={card.label} style={{ background: '#fff', border: 'none', borderLeft: card.borderLeft, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontSize: '10px', color: '#9CA3AF', letterSpacing: '.14em', textTransform: 'uppercase', marginBottom: '8px' }}>{card.label}</div>
              <div style={{ fontSize: '24px', color: card.color }}>{card.value}</div>
              <div style={{ fontSize: '9px', color: '#9CA3AF', marginTop: '6px' }}>{card.sub}</div>
            </div>
          ))}
        </div>

        {/* Portfolio section */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ fontSize: '10px', letterSpacing: '.16em', textTransform: 'uppercase', color: '#0D1033' }}>DIGITAL PORTFOLIO</div>
            <div onClick={handleAddWork} style={{ fontSize: '9px', color: '#3B50E0', cursor: 'pointer' }}>+ Add work</div>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="aspect-square bg-gray-50 border border-[#F0F0F0] animate-pulse" />
              ))}
            </div>
          ) : portfolio.length === 0 ? (
            <div style={{ border: '1px dashed #E0E0EC', background: '#fff', borderRadius: '10px', padding: '48px 32px', textAlign: 'center', fontSize: '11px', color: '#C4C4D0' }}>
              Upload your first work to start attracting brands
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolio.map(item => (
                <motion.div 
                  key={item.id}
                  whileHover={{ y: -4 }}
                  className="group bg-white border border-[#F0F0F0] p-4 transition-all duration-300"
                >
                  <div className="aspect-square relative overflow-hidden bg-[#FAFAFA] mb-4">
                    {item.media_type === 'image' ? (
                      <img src={item.media_url} alt={item.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#FAFAFA] border border-[#F0F0F0]">
                        <PlayCircle className="w-8 h-8 text-[#0D1033]/20 group-hover:text-[#0D1033]/40 transition-colors" />
                      </div>
                    )}
                    <div className="absolute top-0 left-0 px-2 py-1 bg-white border-r border-b border-[#F0F0F0] text-[8px] font-black uppercase tracking-widest text-[#0D1033]">
                      {item.category}
                    </div>
                  </div>
                  <div className="px-1">
                    <h3 className="text-xs font-black text-[#0D1033] truncate uppercase tracking-tighter">{item.title}</h3>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-[9px] font-bold text-[#9CA3AF] uppercase">{new Date(item.created_at).toLocaleDateString()}</p>
                      <ArrowUpRight className="w-3 h-3 text-[#9CA3AF] group-hover:text-[#0D1033] transition-colors" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Inquiries section */}
        <div id="inquiries-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ fontSize: '10px', letterSpacing: '.16em', textTransform: 'uppercase', color: '#0D1033' }}>INQUIRIES</div>
            <div style={{ fontSize: '9px', color: '#9CA3AF' }}>{pendingRequests.length} PENDING</div>
          </div>

          {loading ? (
            <div className="space-y-6">
              {[1, 2].map(i => (
                <div key={i} className="h-40 bg-gray-50 border border-[#F0F0F0] animate-pulse" />
              ))}
            </div>
          ) : pendingRequests.length === 0 ? (
            <div style={{ border: '1px dashed #E0E0EC', background: '#fff', borderRadius: '10px', padding: '48px 32px', textAlign: 'center', fontSize: '11px', color: '#C4C4D0' }}>
              No inquiries yet — brands will appear here once they reach out
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {pendingRequests.map(r => (
                <motion.div 
                  key={r.id}
                  whileHover={{ x: 4 }}
                  className="bg-white border border-[#F0F0F0] p-8 transition-all"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-lg font-light text-[#0D1033] tracking-tight">{r.project_title}</h3>
                      <p className="text-[9px] font-black text-[#9CA3AF] uppercase mt-1 tracking-widest">Client: {r.brand?.username}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-light text-[#0D1033]">${r.budget?.toLocaleString()}</div>
                      <div className="text-[9px] uppercase tracking-widest font-black text-[#9CA3AF]">Budget (USD)</div>
                    </div>
                  </div>
                  <div className="border-l-2 border-[#F0F0F0] pl-6 py-2 mb-8">
                    <p className="text-xs text-[#6B7280] leading-relaxed italic">
                      {r.project_description}
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => updateStatus(r.id, 'Accepted')} 
                      className="border border-[#0D1033] bg-white text-[#0D1033] px-10 py-3 text-[9px] font-black uppercase tracking-[0.2em] hover:bg-[#F9FAFB] transition-all"
                    >
                      Accept Proposal
                    </button>
                    <button 
                      onClick={() => updateStatus(r.id, 'Declined')} 
                      className="border border-[#F0F0F0] text-[#6B7280] px-10 py-3 text-[9px] font-black uppercase tracking-[0.2em] hover:bg-gray-50 transition-all"
                    >
                      Decline
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
