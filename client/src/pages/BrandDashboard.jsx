import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Plus, 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  CreditCard, 
  BarChart3, 
  MessageSquare,
  BadgeCheck,
  CheckCircle2,
  Clock,
  Zap
} from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

// ─────────────────────────────────────────────────────────────────────────────
// Components (Outside to prevent focus loss and recreation)
// ─────────────────────────────────────────────────────────────────────────────

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 p-4 text-xs font-bold uppercase tracking-widest transition-all ${
      active 
        ? 'border-l-[3px] border-[#0044ff] text-black bg-gray-50/50' 
        : 'border-l-[3px] border-transparent text-gray-400 hover:text-black hover:bg-gray-50'
    }`}
  >
    <Icon size={18} />
    <span className="flex-1 text-left">{label}</span>
  </button>
);

const SectionHeader = ({ title, subtitle, children }) => (
  <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-12">
    <div>
      <h2 className="text-4xl font-black tracking-tighter uppercase mb-2">{title}</h2>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{subtitle}</p>
    </div>
    <div className="flex gap-2">
      {children}
    </div>
  </div>
);

const MyCampaigns = ({ campaigns, setActiveTab }) => (
  <div className="space-y-1">
    <SectionHeader title="My Campaigns" subtitle="Track your active opportunities">
      <Link to="/opportunities/new" className="flex items-center gap-2 p-4 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#0044ff] transition-all border-2 border-black">
        <Plus size={14} /> Post Opportunity
      </Link>
    </SectionHeader>

    <div className="border-t border-gray-100">
      {campaigns.length === 0 ? (
        <div className="py-20 text-center border-b border-gray-100">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No campaigns found</p>
        </div>
      ) : (
        campaigns.map(c => (
          <div key={c.id} className="group flex flex-col md:flex-row md:items-center justify-between p-8 border-b border-gray-100 hover:bg-gray-50/50 transition-all cursor-pointer">
            <div className="flex gap-6 items-center">
              <div className="w-12 h-12 border-2 border-black flex items-center justify-center font-black">
                {c.status === 'live' ? <Clock size={20} /> : <CheckCircle2 size={20} />}
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-tight">{c.title}</h3>
                <div className="flex gap-4 mt-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{c.budget_type}</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">•</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{c.niche?.join(', ')}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-12 mt-4 md:mt-0">
              <div className="text-right">
                <p className="text-xl font-black">₹{Number(c.budget_amount || 0).toLocaleString()}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Budget</p>
              </div>
              <button onClick={() => { setActiveTab('applications'); }} className="p-4 border-2 border-black hover:bg-black hover:text-white transition-all text-[10px] font-black uppercase tracking-widest">
                View Apps
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);

const Applications = ({ applications, handleApplicationAction, smartSort }) => (
  <div className="space-y-1">
    <SectionHeader title="Applications" subtitle="Creators who want to collaborate">
      <button onClick={smartSort} className="flex items-center gap-2 p-4 border-2 border-black text-black text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all">
        <Zap size={14} className="text-[#0044ff]" /> Smart Sort
      </button>
    </SectionHeader>

    <div className="border-t border-gray-100">
      {applications.length === 0 ? (
        <div className="py-20 text-center border-b border-gray-100">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No applications yet</p>
        </div>
      ) : (
        applications.map(app => (
          <div key={app.id} className="group flex flex-col md:flex-row md:items-center justify-between p-8 border-b border-gray-100 hover:bg-gray-50/50 transition-all">
            <div className="flex gap-6 items-center">
              <div className="w-16 h-16 border-2 border-black">
                <img src={app.creator?.avatar_url || 'https://via.placeholder.com/150'} className="w-full h-full object-cover" alt="" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold tracking-tight">{app.creator?.username}</h3>
                  {app.creator?.is_verified && <BadgeCheck size={16} className="text-[#0044ff]" />}
                </div>
                <p className="text-[10px] font-bold text-[#0044ff] uppercase tracking-widest mb-2">{app.opportunity_title}</p>
                <div className="flex gap-4">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{app.creator?.follower_count?.toLocaleString()} Followers</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">•</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{app.creator?.rating || 0}/5 Rating</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-8 mt-6 md:mt-0">
              <div className="text-right">
                <p className="text-xl font-black">₹{Number(app.expected_price || 0).toLocaleString()}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Requested</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleApplicationAction(app.id, 'shortlisted')}
                  className="p-4 border-2 border-black text-[10px] font-black uppercase tracking-widest hover:bg-[#0044ff] hover:border-[#0044ff] hover:text-white transition-all"
                >
                  Shortlist
                </button>
                <button 
                  onClick={() => handleApplicationAction(app.id, 'rejected')}
                  className="p-4 border-2 border-gray-200 text-gray-400 text-[10px] font-black uppercase tracking-widest hover:border-black hover:text-black transition-all"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);

const Analytics = ({ stats }) => (
  <div>
    <SectionHeader title="Analytics" subtitle="Real-time performance metrics" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
      <div className="p-12 border-2 border-black">
        <p className="text-4xl font-black tracking-tighter">{stats.views.toLocaleString()}</p>
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-2">Total Impressions</p>
      </div>
      <div className="p-12 border-2 border-black">
        <p className="text-4xl font-black tracking-tighter">{stats.appsReceived}</p>
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-2">Applications Received</p>
      </div>
      <div className="p-12 border-2 border-black">
        <p className="text-4xl font-black tracking-tighter">{stats.completionRate}%</p>
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-2">Campaign Completion</p>
      </div>
    </div>
  </div>
);

const Payments = ({ payments }) => (
  <div>
    <SectionHeader title="Payments" subtitle="Escrow & Transaction History" />
    <div className="border-t border-gray-100">
      {payments.length === 0 ? (
        <div className="py-20 text-center border-b border-gray-100">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No transactions yet</p>
        </div>
      ) : (
        payments.map(p => (
          <div key={p.id} className="flex items-center justify-between p-8 border-b border-gray-100">
            <div className="flex items-center gap-6">
              <div className={`p-4 border-2 ${p.status === 'released' ? 'border-green-500 text-green-500' : 'border-black'}`}>
                <CreditCard size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold">₹{Number(p.amount).toLocaleString()}</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">To {p.creator?.username} • {p.opportunity?.title}</p>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 border-2 ${
                p.status === 'released' ? 'bg-green-500 border-green-500 text-white' : 'border-black'
              }`}>
                {p.status}
              </span>
              {p.status === 'held' && (
                <button className="text-[10px] font-black uppercase tracking-widest underline underline-offset-4 hover:text-[#0044ff]">
                  Release Funds
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────

export default function BrandDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const socket = useSocket();
  const [activeTab, setActiveTab] = useState('campaigns');
  const [loading, setLoading] = useState(true);
  
  // Data State
  const [campaigns, setCampaigns] = useState([]);
  const [applications, setApplications] = useState([]);
  const [paymentsData, setPaymentsData] = useState([]);
  const [stats, setStats] = useState({
    views: 0,
    appsReceived: 0,
    completionRate: 0
  });

  // Redirect to verification if brand is not yet verified
  useEffect(() => {
    if (user && !user.is_verified) {
      navigate('/verify/brand', { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchDashboardData();
  }, [activeTab]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'campaigns') {
        const res = await api.get('/opportunities/my/brand');
        setCampaigns(res.data);
      } else if (activeTab === 'applications') {
        const res = await api.get('/opportunities/my/brand');
        const apps = [];
        for (const opp of res.data) {
          const appRes = await api.get(`/opportunities/${opp.id}/applications`);
          apps.push(...appRes.data.map(a => ({ ...a, opportunity_title: opp.title })));
        }
        setApplications(apps);
      } else if (activeTab === 'payments') {
        const res = await api.get('/payments');
        setPaymentsData(res.data);
      }
      // Mock stats
      setStats({
        views: 1240,
        appsReceived: campaigns.reduce((acc, c) => acc + (c.apps_count || 0), 0),
        completionRate: 98
      });
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplicationAction = async (appId, status) => {
    try {
      await api.patch(`/opportunities/applications/${appId}`, { status });
      setApplications(prev => prev.map(a => a.id === appId ? { ...a, status } : a));
    } catch (err) {
      console.error('App action error:', err);
    }
  };

  const smartSort = () => {
    setApplications(prev => [...prev].sort((a, b) => {
      const scoreA = (a.creator.follower_count || 0) * 0.4 + (a.creator.rating || 0) * 0.6;
      const scoreB = (b.creator.follower_count || 0) * 0.4 + (b.creator.rating || 0) * 0.6;
      return scoreB - scoreA;
    }));
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      <Helmet>
        <title>Brand Dashboard — Driplens</title>
      </Helmet>

      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-72 border-r-2 border-black h-screen sticky top-0 bg-white">
        <div className="p-8 border-b-2 border-black flex items-center justify-between">
          <Link to="/" className="text-2xl font-black tracking-tighter">DRIPLENS</Link>
          {user?.is_verified && <BadgeCheck className="text-[#0044ff]" size={20} />}
        </div>

        <nav className="flex-1 py-8">
          <SidebarItem icon={LayoutDashboard} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
          <SidebarItem icon={Plus} label="Post Opportunity" active={activeTab === 'post'} onClick={() => navigate('/opportunities/new')} />
          <SidebarItem icon={Briefcase} label="My Campaigns" active={activeTab === 'campaigns'} onClick={() => setActiveTab('campaigns')} />
          <SidebarItem icon={Users} label="Applications" active={activeTab === 'applications'} onClick={() => setActiveTab('applications')} />
          <SidebarItem icon={CreditCard} label="Payments" active={activeTab === 'payments'} onClick={() => setActiveTab('payments')} />
          <SidebarItem icon={BarChart3} label="Analytics" active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
        </nav>

        <div className="p-8 border-t-2 border-black">
          <Link to="/messages" className="flex items-center gap-3 text-xs font-black uppercase tracking-widest hover:text-[#0044ff] transition-all">
            <MessageSquare size={16} /> Comms Center
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 md:p-16">
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'campaigns' && <MyCampaigns campaigns={campaigns} setActiveTab={setActiveTab} />}
              {activeTab === 'applications' && <Applications applications={applications} handleApplicationAction={handleApplicationAction} smartSort={smartSort} />}
              {activeTab === 'analytics' && <Analytics stats={stats} />}
              {activeTab === 'payments' && <Payments payments={paymentsData} />}
              {activeTab === 'overview' && <MyCampaigns campaigns={campaigns} setActiveTab={setActiveTab} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Bottom Nav - Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t-2 border-black flex justify-around p-4 z-50">
        <button onClick={() => setActiveTab('campaigns')} className={activeTab === 'campaigns' ? 'text-[#0044ff]' : 'text-gray-400'}>
          <Briefcase size={24} />
        </button>
        <button onClick={() => setActiveTab('applications')} className={activeTab === 'applications' ? 'text-[#0044ff]' : 'text-gray-400'}>
          <Users size={24} />
        </button>
        <button onClick={() => navigate('/opportunities/new')} className="text-black">
          <Plus size={24} />
        </button>
        <button onClick={() => setActiveTab('payments')} className={activeTab === 'payments' ? 'text-[#0044ff]' : 'text-gray-400'}>
          <CreditCard size={24} />
        </button>
        <button onClick={() => setActiveTab('analytics')} className={activeTab === 'analytics' ? 'text-[#0044ff]' : 'text-gray-400'}>
          <BarChart3 size={24} />
        </button>
      </nav>
    </div>
  );
}
