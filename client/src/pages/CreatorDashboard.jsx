import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  LayoutDashboard, 
  Briefcase, 
  MessageSquare, 
  Users, 
  Settings, 
  HelpCircle, 
  Bell, 
  Search, 
  Filter, 
  Calendar,
  ArrowUpRight,
  TrendingUp,
  UserPlus,
  PenLine,
  MoreVertical,
  LogOut,
  ChevronRight,
  Clock,
  Mail,
  Zap,
  BarChart3,
  IndianRupee,
  MapPin,
  Tag,
  Upload,
  ArrowRight,
  Box,
  CheckCircle2,
  BadgeCheck
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { format, subMonths, startOfMonth, endOfMonth, subYears } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { useSocket } from '../context/SocketContext';
import OverviewContent from '../components/OverviewContent';

// ─────────────────────────────────────────────────────────────────────────────
// Components
// ─────────────────────────────────────────────────────────────────────────────

const SectionHeader = ({ title, subtitle, children }) => (
  <div className="flex items-center justify-between mb-12">
    <div>
      <h2 className="text-4xl font-black tracking-tighter uppercase">{title}</h2>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-2">{subtitle}</p>
    </div>
    {children}
  </div>
);

const SidebarItem = ({ icon: Icon, label, active, onClick, badge }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
      active 
        ? 'bg-[#0540F2] text-white shadow-lg shadow-blue-200' 
        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
    }`}
  >
    <Icon size={20} className={active ? 'text-white' : 'text-gray-400 group-hover:text-gray-900'} />
    <span className="flex-1 text-left font-medium text-sm">{label}</span>
    {badge && (
      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
        active ? 'bg-white/20 text-white' : 'bg-red-500 text-white'
      }`}>
        {badge}
      </span>
    )}
  </button>
);

const StatMini = ({ label, value, change, isPositive }) => (
  <div className="flex flex-col gap-1">
    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
    <div className="flex items-end gap-2">
      <h4 className="text-xl font-bold text-gray-900">{value}</h4>
      <span className={`text-[10px] font-bold flex items-center mb-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {isPositive ? '+' : '-'}{change}%
      </span>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────

export default function CreatorDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const socket = useSocket();
  const activeTab = searchParams.get('tab') || 'overview';
  const [loading, setLoading] = useState(true);
  
  // Data State
  const [opportunities, setOpportunities] = useState([
    { id: 'o1', title: 'Nike Air Max Launch', budget_amount: 15000, budget_type: 'Paid', niche: ['Sports', 'Fashion'], brand: { username: 'Nike', avatar_url: 'https://i.pravatar.cc/150?u=nike' } },
    { id: 'o2', title: 'Starbucks Summer Promo', budget_amount: 8000, budget_type: 'Paid', niche: ['Food', 'Lifestyle'], brand: { username: 'Starbucks', avatar_url: 'https://i.pravatar.cc/150?u=starbucks' } },
    { id: 'o3', title: 'Adobe Creative Cloud', budget_amount: 0, budget_type: 'Barter', niche: ['Tech', 'Design'], brand: { username: 'Adobe', avatar_url: 'https://i.pravatar.cc/150?u=adobe' } },
    { id: 'o4', title: 'Sony WH-1000XM5 Review', budget_amount: 12000, budget_type: 'Paid', niche: ['Tech', 'Music'], brand: { username: 'Sony', avatar_url: 'https://i.pravatar.cc/150?u=sony' } },
    { id: 'o5', title: 'Tesla Model 3 Vlog', budget_amount: 50000, budget_type: 'Paid', niche: ['Auto', 'Tech'], brand: { username: 'Tesla', avatar_url: 'https://i.pravatar.cc/150?u=tesla' } },
    { id: 'o6', title: 'H&M Winter Collection', budget_amount: 10000, budget_type: 'Paid', niche: ['Fashion'], brand: { username: 'H&M', avatar_url: 'https://i.pravatar.cc/150?u=hm' } },
    { id: 'o7', title: 'Coca Cola Refresh', budget_amount: 0, budget_type: 'Barter', niche: ['Food'], brand: { username: 'Coca Cola', avatar_url: 'https://i.pravatar.cc/150?u=coke' } },
    { id: 'o8', title: 'Apple Watch Series 9', budget_amount: 20000, budget_type: 'Paid', niche: ['Tech', 'Health'], brand: { username: 'Apple', avatar_url: 'https://i.pravatar.cc/150?u=apple' } },
    { id: 'o9', title: 'Spotify Premium Promo', budget_amount: 5000, budget_type: 'Paid', niche: ['Music', 'Entertainment'], brand: { username: 'Spotify', avatar_url: 'https://i.pravatar.cc/150?u=spotify' } },
    { id: 'o10', title: 'Netflix Originals', budget_amount: 30000, budget_type: 'Paid', niche: ['Entertainment', 'Movies'], brand: { username: 'Netflix', avatar_url: 'https://i.pravatar.cc/150?u=netflix' } }
  ]);
  const [applications, setApplications] = useState([
    { id: 'a1', status: 'hired', expected_price: 15000, opportunity: { title: 'Nike Air Max Launch', brand: { username: 'Nike' } } },
    { id: 'a2', status: 'shortlisted', expected_price: 8000, opportunity: { title: 'Starbucks Summer', brand: { username: 'Starbucks' } } },
    { id: 'a3', status: 'pending', expected_price: 7500, opportunity: { title: 'Adobe Tutorial', brand: { username: 'Adobe' } } },
    { id: 'a4', status: 'rejected', expected_price: 12000, opportunity: { title: 'Sony Review', brand: { username: 'Sony' } } },
    { id: 'a5', status: 'pending', expected_price: 50000, opportunity: { title: 'Tesla Vlog', brand: { username: 'Tesla' } } },
    { id: 'a6', status: 'hired', expected_price: 10000, opportunity: { title: 'H&M Winter', brand: { username: 'H&M' } } },
    { id: 'a7', status: 'shortlisted', expected_price: 6000, opportunity: { title: 'Coca Cola Reel', brand: { username: 'Coca Cola' } } },
    { id: 'a8', status: 'pending', expected_price: 20000, opportunity: { title: 'Apple Watch', brand: { username: 'Apple' } } },
    { id: 'a9', status: 'hired', expected_price: 5000, opportunity: { title: 'Spotify Story', brand: { username: 'Spotify' } } },
    { id: 'a10', status: 'shortlisted', expected_price: 30000, opportunity: { title: 'Netflix Promo', brand: { username: 'Netflix' } } }
  ]);
  const [projects, setProjects] = useState([
    { id: 'p1', progress: 80, status: 'in_progress', brand: { username: 'Nike', avatar_url: 'https://i.pravatar.cc/150?u=nike' }, hiring_request: { project_title: 'Nike Air Max Reel' } },
    { id: 'p2', progress: 40, status: 'in_progress', brand: { username: 'H&M', avatar_url: 'https://i.pravatar.cc/150?u=hm' }, hiring_request: { project_title: 'H&M Lookbook' } },
    { id: 'p3', progress: 95, status: 'in_progress', brand: { username: 'Spotify', avatar_url: 'https://i.pravatar.cc/150?u=spotify' }, hiring_request: { project_title: 'Spotify Story' } },
    { id: 'p4', progress: 10, status: 'in_progress', brand: { username: 'Netflix', avatar_url: 'https://i.pravatar.cc/150?u=netflix' }, hiring_request: { project_title: 'Netflix Promo' } },
    { id: 'p5', progress: 100, status: 'submitted', brand: { username: 'Starbucks', avatar_url: 'https://i.pravatar.cc/150?u=starbucks' }, hiring_request: { project_title: 'Starbucks Post' } },
    { id: 'p6', progress: 20, status: 'in_progress', brand: { username: 'Sony', avatar_url: 'https://i.pravatar.cc/150?u=sony' }, hiring_request: { project_title: 'Sony Review' } },
    { id: 'p7', progress: 0, status: 'in_progress', brand: { username: 'Tesla', avatar_url: 'https://i.pravatar.cc/150?u=tesla' }, hiring_request: { project_title: 'Tesla Vlog' } },
    { id: 'p8', progress: 55, status: 'in_progress', brand: { username: 'Apple', avatar_url: 'https://i.pravatar.cc/150?u=apple' }, hiring_request: { project_title: 'Apple Watch Reel' } },
    { id: 'p9', progress: 70, status: 'in_progress', brand: { username: 'Adobe', avatar_url: 'https://i.pravatar.cc/150?u=adobe' }, hiring_request: { project_title: 'Adobe Tutorial' } },
    { id: 'p10', progress: 35, status: 'in_progress', brand: { username: 'Coca Cola', avatar_url: 'https://i.pravatar.cc/150?u=coke' }, hiring_request: { project_title: 'Coca Cola Reel' } }
  ]);
  const [payments, setPayments] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [stats, setStats] = useState({
    earnings: 125000,
    completed: 12,
    rating: 4.9,
    repeatClients: 4
  });

  const setActiveTab = (tab) => {
    setSearchParams({ tab });
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'opportunities') {
        const res = await api.get('/opportunities');
        let opps = res.data;
        if (opps.length <= 3) {
          opps = [
            { id: 'o1', title: 'Nike Air Max Launch', budget_amount: 15000, budget_type: 'Paid', niche: ['Sports', 'Fashion'], brand: { username: 'Nike', avatar_url: 'https://i.pravatar.cc/150?u=nike' } },
            { id: 'o2', title: 'Starbucks Summer Promo', budget_amount: 8000, budget_type: 'Paid', niche: ['Food', 'Lifestyle'], brand: { username: 'Starbucks', avatar_url: 'https://i.pravatar.cc/150?u=starbucks' } },
            { id: 'o3', title: 'Adobe Creative Cloud', budget_amount: 0, budget_type: 'Barter', niche: ['Tech', 'Design'], brand: { username: 'Adobe', avatar_url: 'https://i.pravatar.cc/150?u=adobe' } },
            { id: 'o4', title: 'Sony WH-1000XM5 Review', budget_amount: 12000, budget_type: 'Paid', niche: ['Tech', 'Music'], brand: { username: 'Sony', avatar_url: 'https://i.pravatar.cc/150?u=sony' } },
            { id: 'o5', title: 'Tesla Model 3 Vlog', budget_amount: 50000, budget_type: 'Paid', niche: ['Auto', 'Tech'], brand: { username: 'Tesla', avatar_url: 'https://i.pravatar.cc/150?u=tesla' } },
            { id: 'o6', title: 'H&M Winter Collection', budget_amount: 10000, budget_type: 'Paid', niche: ['Fashion'], brand: { username: 'H&M', avatar_url: 'https://i.pravatar.cc/150?u=hm' } },
            { id: 'o7', title: 'Coca Cola Refresh', budget_amount: 0, budget_type: 'Barter', niche: ['Food'], brand: { username: 'Coca Cola', avatar_url: 'https://i.pravatar.cc/150?u=coke' } },
            { id: 'o8', title: 'Apple Watch Series 9', budget_amount: 20000, budget_type: 'Paid', niche: ['Tech', 'Health'], brand: { username: 'Apple', avatar_url: 'https://i.pravatar.cc/150?u=apple' } },
            { id: 'o9', title: 'Spotify Premium Promo', budget_amount: 5000, budget_type: 'Paid', niche: ['Music', 'Entertainment'], brand: { username: 'Spotify', avatar_url: 'https://i.pravatar.cc/150?u=spotify' } },
            { id: 'o10', title: 'Netflix Originals', budget_amount: 30000, budget_type: 'Paid', niche: ['Entertainment', 'Movies'], brand: { username: 'Netflix', avatar_url: 'https://i.pravatar.cc/150?u=netflix' } }
          ];
        }
        setOpportunities(opps);
      } else if (activeTab === 'applied') {
        const res = await api.get('/opportunities/my/applications');
        let apps = res.data;
        if (apps.length <= 2) {
          apps = [
            { id: 'a1', status: 'hired', expected_price: 15000, opportunity: { title: 'Nike Air Max Launch', brand: { username: 'Nike' } } },
            { id: 'a2', status: 'shortlisted', expected_price: 8000, opportunity: { title: 'Starbucks Summer', brand: { username: 'Starbucks' } } },
            { id: 'a3', status: 'pending', expected_price: 7500, opportunity: { title: 'Adobe Tutorial', brand: { username: 'Adobe' } } },
            { id: 'a4', status: 'rejected', expected_price: 12000, opportunity: { title: 'Sony Review', brand: { username: 'Sony' } } },
            { id: 'a5', status: 'pending', expected_price: 50000, opportunity: { title: 'Tesla Vlog', brand: { username: 'Tesla' } } },
            { id: 'a6', status: 'hired', expected_price: 10000, opportunity: { title: 'H&M Winter', brand: { username: 'H&M' } } },
            { id: 'a7', status: 'shortlisted', expected_price: 6000, opportunity: { title: 'Coca Cola Reel', brand: { username: 'Coca Cola' } } },
            { id: 'a8', status: 'pending', expected_price: 20000, opportunity: { title: 'Apple Watch', brand: { username: 'Apple' } } },
            { id: 'a9', status: 'hired', expected_price: 5000, opportunity: { title: 'Spotify Story', brand: { username: 'Spotify' } } },
            { id: 'a10', status: 'shortlisted', expected_price: 30000, opportunity: { title: 'Netflix Promo', brand: { username: 'Netflix' } } }
          ];
        }
        setApplications(apps);
      } else if (activeTab === 'payments') {
        const res = await api.get('/payments');
        setPayments(res.data);
      } else if (activeTab === 'portfolio') {
        const res = await api.get('/creators/portfolio');
        setPortfolio(res.data);
      } else if (activeTab === 'projects') {
        const res = await api.get('/projects');
        let projs = res.data.projects || res.data;
        if (projs.length === 0) {
          projs = [
            { id: 'p1', progress: 80, status: 'in_progress', brand: { username: 'Nike', avatar_url: 'https://i.pravatar.cc/150?u=nike' }, hiring_request: { project_title: 'Nike Air Max Reel' } },
            { id: 'p2', progress: 40, status: 'in_progress', brand: { username: 'H&M', avatar_url: 'https://i.pravatar.cc/150?u=hm' }, hiring_request: { project_title: 'H&M Lookbook' } },
            { id: 'p3', progress: 95, status: 'in_progress', brand: { username: 'Spotify', avatar_url: 'https://i.pravatar.cc/150?u=spotify' }, hiring_request: { project_title: 'Spotify Story' } },
            { id: 'p4', progress: 10, status: 'in_progress', brand: { username: 'Netflix', avatar_url: 'https://i.pravatar.cc/150?u=netflix' }, hiring_request: { project_title: 'Netflix Promo' } },
            { id: 'p5', progress: 100, status: 'submitted', brand: { username: 'Starbucks', avatar_url: 'https://i.pravatar.cc/150?u=starbucks' }, hiring_request: { project_title: 'Starbucks Post' } },
            { id: 'p6', progress: 20, status: 'in_progress', brand: { username: 'Sony', avatar_url: 'https://i.pravatar.cc/150?u=sony' }, hiring_request: { project_title: 'Sony Review' } },
            { id: 'p7', progress: 0, status: 'in_progress', brand: { username: 'Tesla', avatar_url: 'https://i.pravatar.cc/150?u=tesla' }, hiring_request: { project_title: 'Tesla Vlog' } },
            { id: 'p8', progress: 55, status: 'in_progress', brand: { username: 'Apple', avatar_url: 'https://i.pravatar.cc/150?u=apple' }, hiring_request: { project_title: 'Apple Watch Reel' } },
            { id: 'p9', progress: 70, status: 'in_progress', brand: { username: 'Adobe', avatar_url: 'https://i.pravatar.cc/150?u=adobe' }, hiring_request: { project_title: 'Adobe Tutorial' } },
            { id: 'p10', progress: 35, status: 'in_progress', brand: { username: 'Coca Cola', avatar_url: 'https://i.pravatar.cc/150?u=coke' }, hiring_request: { project_title: 'Coca Cola Reel' } }
          ];
        }
        setProjects(projs);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Redirect to onboarding if profile not yet completed
  useEffect(() => {
    if (user && !user.onboarding_complete) {
      navigate('/onboarding/step-1', { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchDashboardData();
  }, [activeTab]);

  const ActiveProjects = () => (
    <div className="space-y-1">
      <SectionHeader title="Active Projects" subtitle="Work in progress & content submission" />
      <div className="border-t border-gray-100">
        {loading ? (
           <div className="py-20 text-center border-b border-gray-100"><p className="text-xs font-bold text-gray-400 animate-pulse uppercase tracking-widest">Loading projects...</p></div>
        ) : projects.length === 0 ? (
          <div className="py-20 text-center border-b border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No active projects yet</p>
          </div>
        ) : (
          projects.map(p => (
            <div key={p.id} onClick={() => navigate(`/progress/${p.id}`)} className="group flex flex-col md:flex-row md:items-center justify-between p-8 border-b border-gray-100 hover:bg-gray-50/50 transition-all cursor-pointer">
              <div className="flex gap-6 items-center">
                <div className="w-12 h-12 border-2 border-black overflow-hidden">
                  <img src={p.brand?.avatar_url} className="w-full h-full object-cover" alt="" />
                </div>
                <div>
                  <h3 className="text-xl font-bold tracking-tight">{p.hiring_request?.project_title || 'Content Collaboration'}</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Brand: {p.brand?.username}</p>
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
                  p.status === 'revision_requested' ? 'bg-red-500 text-white border-red-500' : 
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
          {[
            { title: 'Nike Air Max Launch', amount: 15000, date: '12 May 2026', status: 'Completed' },
            { title: 'H&M Winter Collection', amount: 10000, date: '10 May 2026', status: 'Completed' },
            { title: 'Spotify Story', amount: 5000, date: '08 May 2026', status: 'Completed' },
            { title: 'Starbucks Summer', amount: 8000, date: '05 May 2026', status: 'Pending' },
            { title: 'Sony Review', amount: 12000, date: '02 May 2026', status: 'Pending' },
            { title: 'Apple Watch Series 9', amount: 20000, date: '28 Apr 2026', status: 'Completed' },
            { title: 'Adobe Tutorial', amount: 7500, date: '25 Apr 2026', status: 'Completed' },
            { title: 'Tesla Vlog', amount: 50000, date: '20 Apr 2026', status: 'Pending' },
            { title: 'Netflix Promo', amount: 30000, date: '15 Apr 2026', status: 'Pending' },
            { title: 'Coca Cola Reel', amount: 6000, date: '10 Apr 2026', status: 'Completed' }
          ].map((t, i) => (
            <div key={i} className="flex justify-between items-center py-6 border-b border-gray-100">
              <div>
                <p className="font-bold text-sm">Campaign Payout: {t.title}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t.date}</p>
              </div>
              <div className="text-right">
                <p className={`font-black ${t.status === 'Completed' ? 'text-green-600' : 'text-orange-500'}`}>
                  {t.status === 'Completed' ? '+' : ''} ₹{t.amount.toLocaleString()}
                </p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t.status}</p>
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
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Dashboard | DRIPLENS</title>
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
              {activeTab === 'overview' && <OverviewContent user={user} />}
              {activeTab === 'opportunities' && <OpportunitiesFeed />}
              {activeTab === 'applied' && <AppliedCampaigns />}
              {activeTab === 'projects' && <ActiveProjects />}
              {activeTab === 'payments' && <PaymentsSection />}
              {activeTab === 'analytics' && <Analytics />}
              {activeTab === 'portfolio' && <PortfolioSection />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
