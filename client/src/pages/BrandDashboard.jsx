import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
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
import { FolderKanban } from 'lucide-react';
import OverviewContent from '../components/OverviewContent';

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

const MyCampaigns = ({ campaigns, onTabChange }) => (
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
              <button onClick={() => { onTabChange('applications'); }} className="p-4 border-2 border-black hover:bg-black hover:text-white transition-all text-[10px] font-black uppercase tracking-widest">
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

const ActiveProjects = ({ projects, onProjectClick }) => (
  <div className="space-y-1">
    <SectionHeader title="Active Projects" subtitle="Track work in progress and deliverables" />
    <div className="border-t border-gray-100">
      {projects.length === 0 ? (
        <div className="py-20 text-center border-b border-gray-100">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No active projects yet</p>
        </div>
      ) : (
        projects.map(p => (
          <div key={p.id} onClick={() => onProjectClick(p.id)} className="group flex flex-col md:flex-row md:items-center justify-between p-8 border-b border-gray-100 hover:bg-gray-50/50 transition-all cursor-pointer">
            <div className="flex gap-6 items-center">
              <div className="w-12 h-12 border-2 border-black overflow-hidden">
                <img src={p.creator?.avatar_url} className="w-full h-full object-cover" alt="" />
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-tight">{p.hiring_request?.project_title || 'Content Collaboration'}</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Creator: {p.creator?.username}</p>
              </div>
            </div>
            <div className="flex items-center gap-12">
              <div className="text-right">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-24 h-1.5 bg-gray-100 border border-gray-200">
                    <div className="h-full bg-[#0044ff]" style={{ width: `${p.progress}%` }} />
                  </div>
                  <span className="text-[10px] font-black">{p.progress}%</span>
                </div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Progress</p>
              </div>
              <div className={`px-3 py-1 border-2 text-[8px] font-black uppercase tracking-widest ${
                p.status === 'submitted' ? 'bg-[#0044ff] text-white border-[#0044ff]' : 'border-black'
              }`}>
                {p.status.replace('_', ' ')}
              </div>
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
  const [searchParams, setSearchParams] = useSearchParams();
  const socket = useSocket();
  const activeTab = searchParams.get('tab') || 'overview';
  const [loading, setLoading] = useState(true);
  
  // Data State
  const [campaigns, setCampaigns] = useState([
    { id: 'c1', title: 'Summer Collection Launch', budget_type: 'Paid', niche: ['Fashion', 'Lifestyle'], budget_amount: 100000, status: 'live', apps_count: 12 },
    { id: 'c2', title: 'Winter Essentials 2024', budget_type: 'Barter', niche: ['Fashion', 'Outdoor'], budget_amount: 0, status: 'live', apps_count: 8 },
    { id: 'c3', title: 'Fitness App Review', budget_type: 'Paid', niche: ['Health', 'Tech'], budget_amount: 50000, status: 'live', apps_count: 25 },
    { id: 'c4', title: 'Eco-friendly Kitchenware', budget_type: 'Barter', niche: ['Home', 'Sustainability'], budget_amount: 0, status: 'completed', apps_count: 15 },
    { id: 'c5', title: 'Gaming Peripheral Unboxing', budget_type: 'Paid', niche: ['Gaming', 'Tech'], budget_amount: 75000, status: 'live', apps_count: 42 },
    { id: 'c6', title: 'Skincare Routine Series', budget_type: 'Paid', niche: ['Beauty', 'Health'], budget_amount: 120000, status: 'live', apps_count: 19 },
    { id: 'c7', title: 'Travel Vlog: Bali Edition', budget_type: 'Paid', niche: ['Travel', 'Lifestyle'], budget_amount: 250000, status: 'live', apps_count: 67 },
    { id: 'c8', title: 'Smart Home Gadgets', budget_type: 'Barter', niche: ['Tech', 'Home'], budget_amount: 0, status: 'live', apps_count: 11 },
    { id: 'c9', title: 'Organic Pet Food Intro', budget_type: 'Paid', niche: ['Pets', 'Health'], budget_amount: 35000, status: 'completed', apps_count: 9 },
    { id: 'c10', title: 'Luxury Watch Showcase', budget_type: 'Paid', niche: ['Luxury', 'Fashion'], budget_amount: 500000, status: 'live', apps_count: 150 }
  ]);
  const [applications, setApplications] = useState([
    { id: 'a1', opportunity_title: 'Summer Collection Launch', expected_price: 25000, status: 'pending', creator: { id: 'cr1', username: 'alex_creates', is_verified: true, follower_count: 125000, rating: 4.8, avatar_url: 'https://i.pravatar.cc/150?u=1' } },
    { id: 'a2', opportunity_title: 'Winter Essentials 2024', expected_price: 18000, status: 'pending', creator: { id: 'cr2', username: 'samantha_vlogs', is_verified: false, follower_count: 45000, rating: 4.5, avatar_url: 'https://i.pravatar.cc/150?u=2' } },
    { id: 'a3', opportunity_title: 'Fitness App Review', expected_price: 45000, status: 'pending', creator: { id: 'cr3', username: 'pro_studio_gear', is_verified: true, follower_count: 500000, rating: 4.9, avatar_url: 'https://i.pravatar.cc/150?u=3' } },
    { id: 'a4', opportunity_title: 'Gaming Peripheral Unboxing', expected_price: 15000, status: 'pending', creator: { id: 'cr4', username: 'fitness_freak_99', is_verified: true, follower_count: 89000, rating: 4.7, avatar_url: 'https://i.pravatar.cc/150?u=4' } },
    { id: 'a5', opportunity_title: 'Eco-friendly Kitchenware', expected_price: 0, status: 'pending', creator: { id: 'cr5', username: 'tech_guru_official', is_verified: true, follower_count: 1200000, rating: 5.0, avatar_url: 'https://i.pravatar.cc/150?u=5' } },
    { id: 'a6', opportunity_title: 'Skincare Routine Series', expected_price: 30000, status: 'pending', creator: { id: 'cr6', username: 'eco_warrior_jane', is_verified: false, follower_count: 12000, rating: 4.2, avatar_url: 'https://i.pravatar.cc/150?u=6' } },
    { id: 'a7', opportunity_title: 'Travel Vlog: Bali Edition', expected_price: 120000, status: 'pending', creator: { id: 'cr7', username: 'travel_with_tom', is_verified: true, follower_count: 350000, rating: 4.9, avatar_url: 'https://i.pravatar.cc/150?u=7' } },
    { id: 'a8', opportunity_title: 'Smart Home Gadgets', expected_price: 0, status: 'pending', creator: { id: 'cr8', username: 'beauty_by_bella', is_verified: true, follower_count: 95000, rating: 4.6, avatar_url: 'https://i.pravatar.cc/150?u=8' } },
    { id: 'a9', opportunity_title: 'Organic Pet Food Intro', expected_price: 8000, status: 'pending', creator: { id: 'cr9', username: 'gamer_pro_max', is_verified: false, follower_count: 210000, rating: 4.4, avatar_url: 'https://i.pravatar.cc/150?u=9' } },
    { id: 'a10', opportunity_title: 'Luxury Watch Showcase', expected_price: 200000, status: 'pending', creator: { id: 'cr10', username: 'chef_de_cuisine', is_verified: true, follower_count: 42000, rating: 4.8, avatar_url: 'https://i.pravatar.cc/150?u=10' } }
  ]);
  const [projects, setProjects] = useState([
    { id: 'pr1', progress: 75, status: 'in_progress', creator: { username: 'alex_creates', avatar_url: 'https://i.pravatar.cc/150?u=1' }, hiring_request: { project_title: 'Summer Collection Reel' } },
    { id: 'pr2', progress: 30, status: 'in_progress', creator: { username: 'samantha_vlogs', avatar_url: 'https://i.pravatar.cc/150?u=2' }, hiring_request: { project_title: 'Winter Lookbook' } },
    { id: 'pr3', progress: 90, status: 'in_progress', creator: { username: 'pro_studio_gear', avatar_url: 'https://i.pravatar.cc/150?u=3' }, hiring_request: { project_title: 'Tech Unboxing' } },
    { id: 'pr4', progress: 10, status: 'in_progress', creator: { username: 'fitness_freak_99', avatar_url: 'https://i.pravatar.cc/150?u=4' }, hiring_request: { project_title: 'Fitness Challenge' } },
    { id: 'pr5', progress: 50, status: 'in_progress', creator: { username: 'tech_guru_official', avatar_url: 'https://i.pravatar.cc/150?u=5' }, hiring_request: { project_title: 'AI Tool Review' } },
    { id: 'pr6', progress: 100, status: 'submitted', creator: { username: 'eco_warrior_jane', avatar_url: 'https://i.pravatar.cc/150?u=6' }, hiring_request: { project_title: 'Eco Friendly Home' } },
    { id: 'pr7', progress: 0, status: 'in_progress', creator: { username: 'travel_with_tom', avatar_url: 'https://i.pravatar.cc/150?u=7' }, hiring_request: { project_title: 'Travel Vlog Series' } },
    { id: 'pr8', progress: 25, status: 'in_progress', creator: { username: 'beauty_by_bella', avatar_url: 'https://i.pravatar.cc/150?u=8' }, hiring_request: { project_title: 'Summer Makeup' } },
    { id: 'pr9', progress: 60, status: 'in_progress', creator: { username: 'gamer_pro_max', avatar_url: 'https://i.pravatar.cc/150?u=9' }, hiring_request: { project_title: 'Gaming Setup' } },
    { id: 'pr10', progress: 85, status: 'in_progress', creator: { username: 'chef_de_cuisine', avatar_url: 'https://i.pravatar.cc/150?u=10' }, hiring_request: { project_title: 'Gourmet Recipe' } }
  ]);
  const [paymentsData, setPaymentsData] = useState([
    { id: 'p1', amount: 25000, status: 'released', creator: { username: 'alex_creates' }, opportunity: { title: 'Summer Reel' } },
    { id: 'p2', amount: 15000, status: 'held', creator: { username: 'samantha_vlogs' }, opportunity: { title: 'Winter Essentials' } },
    { id: 'p3', amount: 50000, status: 'released', creator: { username: 'pro_studio_gear' }, opportunity: { title: 'App Walkthrough' } },
    { id: 'p4', amount: 12000, status: 'held', creator: { username: 'fitness_freak_99' }, opportunity: { title: 'Fitness Post' } },
    { id: 'p5', amount: 30000, status: 'released', creator: { username: 'tech_guru_official' }, opportunity: { title: 'Tech Review' } },
    { id: 'p6', amount: 20000, status: 'held', creator: { username: 'eco_warrior_jane' }, opportunity: { title: 'Eco Post' } },
    { id: 'p7', amount: 40000, status: 'released', creator: { username: 'travel_with_tom' }, opportunity: { title: 'Travel Vlog' } },
    { id: 'p8', amount: 10000, status: 'held', creator: { username: 'beauty_by_bella' }, opportunity: { title: 'Beauty Tips' } },
    { id: 'p9', amount: 5000, status: 'released', creator: { username: 'gamer_pro_max' }, opportunity: { title: 'Gaming Stream' } },
    { id: 'p10', amount: 60000, status: 'held', creator: { username: 'chef_de_cuisine' }, opportunity: { title: 'Recipe Video' } }
  ]);
  const [stats, setStats] = useState({
    views: 12500,
    appsReceived: 245,
    hiredCount: 18,
    spend: 450000
  });

  const setActiveTab = (tab) => {
    setSearchParams({ tab });
  };

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
        let camps = res.data;
        if (camps.length <= 1) { // Force mock data for demonstration if empty or only has the existing mock
          camps = [
            { id: 'c1', title: 'Summer Collection Launch', budget_type: 'Paid', niche: ['Fashion', 'Lifestyle'], budget_amount: 100000, status: 'live', apps_count: 12 },
            { id: 'c2', title: 'Winter Essentials 2024', budget_type: 'Barter', niche: ['Fashion', 'Outdoor'], budget_amount: 0, status: 'live', apps_count: 8 },
            { id: 'c3', title: 'Fitness App Review', budget_type: 'Paid', niche: ['Health', 'Tech'], budget_amount: 50000, status: 'live', apps_count: 25 },
            { id: 'c4', title: 'Eco-friendly Kitchenware', budget_type: 'Barter', niche: ['Home', 'Sustainability'], budget_amount: 0, status: 'completed', apps_count: 15 },
            { id: 'c5', title: 'Gaming Peripheral Unboxing', budget_type: 'Paid', niche: ['Gaming', 'Tech'], budget_amount: 75000, status: 'live', apps_count: 42 },
            { id: 'c6', title: 'Skincare Routine Series', budget_type: 'Paid', niche: ['Beauty', 'Health'], budget_amount: 120000, status: 'live', apps_count: 19 },
            { id: 'c7', title: 'Travel Vlog: Bali Edition', budget_type: 'Paid', niche: ['Travel', 'Lifestyle'], budget_amount: 250000, status: 'live', apps_count: 67 },
            { id: 'c8', title: 'Smart Home Gadgets', budget_type: 'Barter', niche: ['Tech', 'Home'], budget_amount: 0, status: 'live', apps_count: 11 },
            { id: 'c9', title: 'Organic Pet Food Intro', budget_type: 'Paid', niche: ['Pets', 'Health'], budget_amount: 35000, status: 'completed', apps_count: 9 },
            { id: 'c10', title: 'Luxury Watch Showcase', budget_type: 'Paid', niche: ['Luxury', 'Fashion'], budget_amount: 500000, status: 'live', apps_count: 150 }
          ];
        }
        setCampaigns(camps);
      } else if (activeTab === 'applications') {
        const res = await api.get('/opportunities/my/brand');
        const apps = [];
        // Only fetch if not using mock data
        if (res.data.length > 0) {
          for (const opp of res.data) {
            const appRes = await api.get(`/opportunities/${opp.id}/applications`);
            apps.push(...appRes.data.map(a => ({ ...a, opportunity_title: opp.title })));
          }
        }
        
        if (apps.length <= 3) {
          const mockApps = [
            { id: 'a1', opportunity_title: 'Summer Collection Launch', expected_price: 25000, status: 'pending', creator: { id: 'cr1', username: 'alex_creates', is_verified: true, follower_count: 125000, rating: 4.8, avatar_url: 'https://i.pravatar.cc/150?u=1' } },
            { id: 'a2', opportunity_title: 'Winter Essentials 2024', expected_price: 18000, status: 'pending', creator: { id: 'cr2', username: 'samantha_vlogs', is_verified: false, follower_count: 45000, rating: 4.5, avatar_url: 'https://i.pravatar.cc/150?u=2' } },
            { id: 'a3', opportunity_title: 'Fitness App Review', expected_price: 45000, status: 'pending', creator: { id: 'cr3', username: 'pro_studio_gear', is_verified: true, follower_count: 500000, rating: 4.9, avatar_url: 'https://i.pravatar.cc/150?u=3' } },
            { id: 'a4', opportunity_title: 'Gaming Peripheral Unboxing', expected_price: 15000, status: 'pending', creator: { id: 'cr4', username: 'fitness_freak_99', is_verified: true, follower_count: 89000, rating: 4.7, avatar_url: 'https://i.pravatar.cc/150?u=4' } },
            { id: 'a5', opportunity_title: 'Eco-friendly Kitchenware', expected_price: 0, status: 'pending', creator: { id: 'cr5', username: 'tech_guru_official', is_verified: true, follower_count: 1200000, rating: 5.0, avatar_url: 'https://i.pravatar.cc/150?u=5' } },
            { id: 'a6', opportunity_title: 'Skincare Routine Series', expected_price: 30000, status: 'pending', creator: { id: 'cr6', username: 'eco_warrior_jane', is_verified: false, follower_count: 12000, rating: 4.2, avatar_url: 'https://i.pravatar.cc/150?u=6' } },
            { id: 'a7', opportunity_title: 'Travel Vlog: Bali Edition', expected_price: 120000, status: 'pending', creator: { id: 'cr7', username: 'travel_with_tom', is_verified: true, follower_count: 350000, rating: 4.9, avatar_url: 'https://i.pravatar.cc/150?u=7' } },
            { id: 'a8', opportunity_title: 'Smart Home Gadgets', expected_price: 0, status: 'pending', creator: { id: 'cr8', username: 'beauty_by_bella', is_verified: true, follower_count: 95000, rating: 4.6, avatar_url: 'https://i.pravatar.cc/150?u=8' } },
            { id: 'a9', opportunity_title: 'Organic Pet Food Intro', expected_price: 8000, status: 'pending', creator: { id: 'cr9', username: 'gamer_pro_max', is_verified: false, follower_count: 210000, rating: 4.4, avatar_url: 'https://i.pravatar.cc/150?u=9' } },
            { id: 'a10', opportunity_title: 'Luxury Watch Showcase', expected_price: 200000, status: 'pending', creator: { id: 'cr10', username: 'chef_de_cuisine', is_verified: true, follower_count: 42000, rating: 4.8, avatar_url: 'https://i.pravatar.cc/150?u=10' } }
          ];
          setApplications(mockApps);
        } else {
          setApplications(apps);
        }
      } else if (activeTab === 'payments') {
        const res = await api.get('/payments');
        let payData = res.data;
        if (payData.length === 0) {
          payData = [
            { id: 'p1', amount: 25000, status: 'released', creator: { username: 'alex_creates' }, opportunity: { title: 'Summer Reel' } },
            { id: 'p2', amount: 15000, status: 'held', creator: { username: 'samantha_vlogs' }, opportunity: { title: 'Winter Essentials' } },
            { id: 'p3', amount: 50000, status: 'released', creator: { username: 'pro_studio_gear' }, opportunity: { title: 'App Walkthrough' } },
            { id: 'p4', amount: 12000, status: 'held', creator: { username: 'fitness_freak_99' }, opportunity: { title: 'Fitness Post' } },
            { id: 'p5', amount: 30000, status: 'released', creator: { username: 'tech_guru_official' }, opportunity: { title: 'Tech Review' } },
            { id: 'p6', amount: 20000, status: 'held', creator: { username: 'eco_warrior_jane' }, opportunity: { title: 'Eco Post' } },
            { id: 'p7', amount: 40000, status: 'released', creator: { username: 'travel_with_tom' }, opportunity: { title: 'Travel Vlog' } },
            { id: 'p8', amount: 10000, status: 'held', creator: { username: 'beauty_by_bella' }, opportunity: { title: 'Beauty Tips' } },
            { id: 'p9', amount: 5000, status: 'released', creator: { username: 'gamer_pro_max' }, opportunity: { title: 'Gaming Stream' } },
            { id: 'p10', amount: 60000, status: 'held', creator: { username: 'chef_de_cuisine' }, opportunity: { title: 'Recipe Video' } }
          ];
        }
        setPaymentsData(payData);
      } else if (activeTab === 'projects') {
        const res = await api.get('/projects');
        let projData = res.data.projects || res.data;
        if (projData.length === 0) {
          projData = [
            { id: 'pr1', progress: 75, status: 'in_progress', creator: { username: 'alex_creates', avatar_url: 'https://i.pravatar.cc/150?u=1' }, hiring_request: { project_title: 'Summer Collection Reel' } },
            { id: 'pr2', progress: 30, status: 'in_progress', creator: { username: 'samantha_vlogs', avatar_url: 'https://i.pravatar.cc/150?u=2' }, hiring_request: { project_title: 'Winter Lookbook' } },
            { id: 'pr3', progress: 90, status: 'in_progress', creator: { username: 'pro_studio_gear', avatar_url: 'https://i.pravatar.cc/150?u=3' }, hiring_request: { project_title: 'Tech Unboxing' } },
            { id: 'pr4', progress: 10, status: 'in_progress', creator: { username: 'fitness_freak_99', avatar_url: 'https://i.pravatar.cc/150?u=4' }, hiring_request: { project_title: 'Fitness Challenge' } },
            { id: 'pr5', progress: 50, status: 'in_progress', creator: { username: 'tech_guru_official', avatar_url: 'https://i.pravatar.cc/150?u=5' }, hiring_request: { project_title: 'AI Tool Review' } },
            { id: 'pr6', progress: 100, status: 'submitted', creator: { username: 'eco_warrior_jane', avatar_url: 'https://i.pravatar.cc/150?u=6' }, hiring_request: { project_title: 'Eco Friendly Home' } },
            { id: 'pr7', progress: 0, status: 'in_progress', creator: { username: 'travel_with_tom', avatar_url: 'https://i.pravatar.cc/150?u=7' }, hiring_request: { project_title: 'Travel Vlog Series' } },
            { id: 'pr8', progress: 25, status: 'in_progress', creator: { username: 'beauty_by_bella', avatar_url: 'https://i.pravatar.cc/150?u=8' }, hiring_request: { project_title: 'Summer Makeup' } },
            { id: 'pr9', progress: 60, status: 'in_progress', creator: { username: 'gamer_pro_max', avatar_url: 'https://i.pravatar.cc/150?u=9' }, hiring_request: { project_title: 'Gaming Setup' } },
            { id: 'pr10', progress: 85, status: 'in_progress', creator: { username: 'chef_de_cuisine', avatar_url: 'https://i.pravatar.cc/150?u=10' }, hiring_request: { project_title: 'Gourmet Recipe' } }
          ];
        }
        setProjects(projData);
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

  const menuItems = [
    { label: 'Overview', onClick: () => setActiveTab('overview') },
    { label: 'Post Brief', onClick: () => navigate('/opportunities/new') },
    { label: 'Campaigns', onClick: () => setActiveTab('campaigns') },
    { label: 'Projects', onClick: () => setActiveTab('projects') },
    { label: 'Applications', onClick: () => setActiveTab('applications') },
    { label: 'Payments', onClick: () => setActiveTab('payments') },
    { label: 'Analytics', onClick: () => setActiveTab('analytics') },
    { label: 'Messages', onClick: () => navigate('/messages') },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Brand Dashboard — Driplens</title>
      </Helmet>

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
              {activeTab === 'campaigns' && <MyCampaigns campaigns={campaigns} onTabChange={setActiveTab} />}
              {activeTab === 'projects' && <ActiveProjects projects={projects} onProjectClick={(id) => navigate(`/progress/${id}`)} />}
              {activeTab === 'applications' && <Applications applications={applications} handleApplicationAction={handleApplicationAction} smartSort={smartSort} />}
              {activeTab === 'analytics' && <Analytics stats={stats} />}
              {activeTab === 'payments' && <Payments payments={paymentsData} />}
              {activeTab === 'overview' && <OverviewContent user={user} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
