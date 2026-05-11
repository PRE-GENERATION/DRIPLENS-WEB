import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Zap, 
  LayoutDashboard, 
  Briefcase, 
  CreditCard, 
  BarChart3, 
  MessageSquare,
  BadgeCheck,
  Search,
  CheckCircle2,
  Clock,
  IndianRupee,
  MapPin,
  Tag,
  Upload,
  ArrowRight
} from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

// ─────────────────────────────────────────────────────────────────────────────
// Components
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

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────

export default function CreatorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const socket = useSocket();
  const [activeTab, setActiveTab] = useState('opportunities');
  const [loading, setLoading] = useState(true);
  
  // Data State
  const [opportunities, setOpportunities] = useState([]);
  const [applications, setApplications] = useState([]);
  const [payments, setPayments] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [stats, setStats] = useState({
    earnings: 0,
    completed: 0,
    rating: 0,
    repeatClients: 0
  });

  // Redirect to onboarding if profile not yet completed
  useEffect(() => {
    if (user && !user.onboarding_complete) {
      navigate('/onboarding/step-1', { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchDashboardData();
  }, [activeTab]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'opportunities') {
        const res = await api.get('/opportunities');
        setOpportunities(res.data);
      } else if (activeTab === 'applied') {
        const res = await api.get('/opportunities/my/applications');
        setApplications(res.data);
      } else if (activeTab === 'payments') {
        const res = await api.get('/payments');
        setPayments(res.data);
      } else if (activeTab === 'portfolio') {
        // Fetch uploaded work
        const res = await api.get('/creators/portfolio');
        setPortfolio(res.data);
      }
      // Mock stats
      setStats({
        earnings: 125000,
        completed: 14,
        rating: 4.9,
        repeatClients: 6
      });
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // ───────────────────────────────────────────────────────────────────────────
  // Sections
  // ───────────────────────────────────────────────────────────────────────────

  const OpportunitiesFeed = () => (
    <div className="space-y-1">
      <SectionHeader title="Live Briefs" subtitle="Opportunities matching your profile" />
      <div className="border-t border-gray-100">
        {opportunities.length === 0 ? (
          <div className="py-20 text-center border-b border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No active briefs found</p>
          </div>
        ) : (
          opportunities.map(opp => (
            <Link 
              to={`/opportunities/${opp.id}`} 
              key={opp.id} 
              className="group flex flex-col md:flex-row md:items-center justify-between p-8 border-b border-gray-100 hover:bg-gray-50/50 transition-all"
            >
              <div className="flex gap-6 items-center">
                <div className="w-12 h-12 border-2 border-black flex items-center justify-center shrink-0">
                  <img src={opp.brand?.avatar_url || 'https://via.placeholder.com/150'} className="w-full h-full object-cover" alt="" />
                </div>
                <div>
                  <h3 className="text-xl font-bold tracking-tight mb-1 group-hover:text-[#0044ff] transition-colors">{opp.title}</h3>
                  <div className="flex gap-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#0044ff]">{opp.brand?.username}</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{opp.niche?.join(', ')}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-12 mt-4 md:mt-0">
                <div className="text-right">
                  <p className="text-xl font-black">₹{Number(opp.budget_amount || 0).toLocaleString()}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{opp.budget_type}</p>
                </div>
                <div className="p-4 border-2 border-black group-hover:bg-black group-hover:text-white transition-all text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  Apply <ArrowRight size={14} />
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );

  const AppliedCampaigns = () => (
    <div className="space-y-1">
      <SectionHeader title="Applied Campaigns" subtitle="Track your proposal status" />
      <div className="border-t border-gray-100">
        {applications.length === 0 ? (
          <div className="py-20 text-center border-b border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">You haven't applied to any campaigns yet</p>
          </div>
        ) : (
          applications.map(app => (
            <div key={app.id} className="flex flex-col md:flex-row md:items-center justify-between p-8 border-b border-gray-100 hover:bg-gray-50/50 transition-all">
              <div className="flex gap-6 items-center">
                <div className={`w-12 h-12 border-2 flex items-center justify-center shrink-0 ${
                  app.status === 'hired' ? 'bg-green-500 border-green-500 text-white' : 
                  app.status === 'shortlisted' ? 'bg-[#0044ff] border-[#0044ff] text-white' : 'border-black'
                }`}>
                  {app.status === 'hired' ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                </div>
                <div>
                  <h3 className="text-xl font-bold tracking-tight">{app.opportunity?.title}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Client: {app.opportunity?.brand?.username}</p>
                    {app.status === 'hired' && (
                      <span className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest rounded-full">
                        <BadgeCheck size={10} /> Payment Secured
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-12 mt-4 md:mt-0">
                <div className="text-right">
                  <p className="text-xl font-black">₹{Number(app.expected_price || 0).toLocaleString()}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Expected</p>
                </div>
                <div className={`px-4 py-2 border-2 text-[10px] font-black uppercase tracking-[0.2em] min-w-[120px] text-center ${
                  app.status === 'hired' ? 'bg-green-500 border-green-500 text-white' : 
                  app.status === 'shortlisted' ? 'bg-[#0044ff] border-[#0044ff] text-white' :
                  app.status === 'rejected' ? 'bg-red-500 border-red-500 text-white' : 'border-black'
                }`}>
                  {app.status.toUpperCase()}
                </div>
                {app.status === 'shortlisted' && (
                  <button onClick={() => navigate(`/dm/${app.opportunity?.brand_id}`)} className="p-3 border-2 border-black hover:bg-black hover:text-white transition-all">
                    <MessageSquare size={16} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const PaymentsSection = () => (
    <div className="space-y-8">
      <SectionHeader title="Payments" subtitle="Earnings & UPI Settings" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-12 border-2 border-black bg-black text-white">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-60">Total Earnings</p>
          <h3 className="text-6xl font-black tracking-tighter mb-8">₹{stats.earnings.toLocaleString()}</h3>
          <button className="text-[10px] font-black uppercase tracking-widest underline underline-offset-4 hover:text-[#0044ff]">Withdraw to Bank</button>
        </div>
        
        <div className="p-12 border-2 border-black">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-8">Connected UPI ID</p>
          <div className="flex items-center justify-between p-4 border-2 border-gray-100 mb-8">
            <span className="font-bold">annanya@okicici</span>
            <button className="text-[10px] font-black uppercase tracking-widest text-[#0044ff]">Edit</button>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">Payments are instantly released to your UPI ID once the brand approves your content.</p>
        </div>
      </div>

      <div className="mt-12">
        <h4 className="text-xs font-black uppercase tracking-widest mb-6">Recent Transactions</h4>
        <div className="border-t-2 border-black">
          {[1,2,3].map(i => (
            <div key={i} className="flex justify-between items-center py-6 border-b border-gray-100">
              <div>
                <p className="font-bold text-sm">Campaign Payout: Nike Air Max</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">12 May 2026</p>
              </div>
              <div className="text-right">
                <p className="font-black text-green-600">+ ₹15,000</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Completed</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const PortfolioSection = () => (
    <div>
      <SectionHeader title="Portfolio" subtitle="Your uploaded content & work">
        <button onClick={() => navigate('/upload')} className="bg-black text-white px-6 py-3 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          <Upload size={14} /> Upload New
        </button>
      </SectionHeader>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {portfolio.length === 0 ? (
          [1,2,3,4].map(i => (
            <div key={i} className="aspect-square bg-gray-50 border-2 border-gray-100 flex items-center justify-center text-gray-300">
              <Box size={32} />
            </div>
          ))
        ) : (
          portfolio.map(work => (
            <div key={work.id} className="aspect-square border-2 border-black overflow-hidden group relative">
              <img src={work.url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt="" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-white">{work.title}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const Analytics = () => (
    <div>
      <SectionHeader title="Analytics" subtitle="Campaign performance & growth" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-1">
        <div className="p-12 border-2 border-black">
          <p className="text-4xl font-black tracking-tighter">₹{(stats.earnings/1000).toFixed(1)}K</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-2">Total Earnings</p>
        </div>
        <div className="p-12 border-2 border-black">
          <p className="text-4xl font-black tracking-tighter">{stats.completed}</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-2">Campaigns Done</p>
        </div>
        <div className="p-12 border-2 border-black">
          <p className="text-4xl font-black tracking-tighter">{stats.rating}</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-2">Average Rating</p>
        </div>
        <div className="p-12 border-2 border-black">
          <p className="text-4xl font-black tracking-tighter">{stats.repeatClients}</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-2">Repeat Clients</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      <Helmet>
        <title>Creator Dashboard — Driplens</title>
      </Helmet>

      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-72 border-r-2 border-black h-screen sticky top-0 bg-white">
        <div className="p-8 border-b-2 border-black flex items-center justify-between">
          <Link to="/" className="text-2xl font-black tracking-tighter">DRIPLENS</Link>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[8px] font-black uppercase tracking-widest">LIVE</span>
          </div>
        </div>

        <nav className="flex-1 py-8">
          <SidebarItem icon={LayoutDashboard} label="Opportunities" active={activeTab === 'opportunities'} onClick={() => setActiveTab('opportunities')} />
          <SidebarItem icon={Briefcase} label="Applied Campaigns" active={activeTab === 'applied'} onClick={() => setActiveTab('applied')} />
          <SidebarItem icon={MessageSquare} label="Messages" active={activeTab === 'messages'} onClick={() => navigate('/messages')} />
          <SidebarItem icon={CreditCard} label="Payments" active={activeTab === 'payments'} onClick={() => setActiveTab('payments')} />
          <SidebarItem icon={BarChart3} label="Analytics" active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
          <SidebarItem icon={Upload} label="Portfolio" active={activeTab === 'portfolio'} onClick={() => setActiveTab('portfolio')} />
        </nav>

        <div className="p-8 border-t-2 border-black">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-black overflow-hidden shrink-0">
              <img src={user?.avatar_url || 'https://via.placeholder.com/150'} className="w-full h-full object-cover" alt="" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-tighter truncate">{user?.display_name || user?.username}</p>
              <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest truncate">{user?.role}</p>
            </div>
          </div>
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
              {activeTab === 'opportunities' && <OpportunitiesFeed />}
              {activeTab === 'applied' && <AppliedCampaigns />}
              {activeTab === 'payments' && <PaymentsSection />}
              {activeTab === 'analytics' && <Analytics />}
              {activeTab === 'portfolio' && <PortfolioSection />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Bottom Nav - Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t-2 border-black flex justify-around p-4 z-50">
        <button onClick={() => setActiveTab('opportunities')} className={activeTab === 'opportunities' ? 'text-[#0044ff]' : 'text-gray-400'}>
          <LayoutDashboard size={24} />
        </button>
        <button onClick={() => setActiveTab('applied')} className={activeTab === 'applied' ? 'text-[#0044ff]' : 'text-gray-400'}>
          <Briefcase size={24} />
        </button>
        <button onClick={() => navigate('/messages')} className="text-gray-400">
          <MessageSquare size={24} />
        </button>
        <button onClick={() => setActiveTab('payments')} className={activeTab === 'payments' ? 'text-[#0044ff]' : 'text-gray-400'}>
          <CreditCard size={24} />
        </button>
        <button onClick={() => setActiveTab('portfolio')} className={activeTab === 'portfolio' ? 'text-[#0044ff]' : 'text-gray-400'}>
          <Upload size={24} />
        </button>
      </nav>
    </div>
  );
}
