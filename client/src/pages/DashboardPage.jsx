import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
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
  BarChart3
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
import { format, subYears } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';

// ─────────────────────────────────────────────────────────────────────────────
// Mock Data
// ─────────────────────────────────────────────────────────────────────────────

const mrrData = {
  '12 months': [
    { month: 'Jan', value: 12000 }, { month: 'Feb', value: 13500 }, { month: 'Mar', value: 12800 },
    { month: 'Apr', value: 15000 }, { month: 'May', value: 16200 }, { month: 'Jun', value: 15800 },
    { month: 'Jul', value: 17500 }, { month: 'Aug', value: 18200 }, { month: 'Sep', value: 17900 },
    { month: 'Oct', value: 19500 }, { month: 'Nov', value: 20800 }, { month: 'Dec', value: 18880 },
  ],
  '30 days': [
    { month: 'Week 1', value: 4200 }, { month: 'Week 2', value: 4800 }, { month: 'Week 3', value: 4500 }, { month: 'Week 4', value: 5380 },
  ],
  '7 days': [
    { month: 'Mon', value: 600 }, { month: 'Tue', value: 800 }, { month: 'Wed', value: 750 },
    { month: 'Thu', value: 900 }, { month: 'Fri', value: 1100 }, { month: 'Sat', value: 1050 }, { month: 'Sun', value: 1200 },
  ],
  '24 hours': [
    { month: '00:00', value: 50 }, { month: '04:00', value: 30 }, { month: '08:00', value: 120 },
    { month: '12:00', value: 250 }, { month: '16:00', value: 180 }, { month: '20:00', value: 320 },
  ]
};

const topMembers = [
  { id: 1, name: 'Alex Rivera', role: 'Premium Member', date: '12 Jan 2024', status: 'online', avatar: 'https://i.pravatar.cc/150?u=alex' },
  { id: 2, name: 'Sarah Chen', role: 'Gold Member', date: '05 Mar 2024', status: 'online', avatar: 'https://i.pravatar.cc/150?u=sarah' },
  { id: 3, name: 'Marcus Bell', role: 'New Member', date: '28 Apr 2024', status: 'offline', avatar: 'https://i.pravatar.cc/150?u=marcus' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Components
// ─────────────────────────────────────────────────────────────────────────────

const SidebarItem = ({ icon: Icon, label, active, onClick, badge, to }) => {
  const content = (
    <div className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
      active 
        ? 'bg-[#0540F2] text-white shadow-lg shadow-blue-200' 
        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
    }`}>
      <Icon size={20} className={active ? 'text-white' : 'text-gray-400 group-hover:text-gray-900'} />
      <span className="flex-1 text-left font-medium text-sm">{label}</span>
      {badge && (
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
          active ? 'bg-white/20 text-white' : 'bg-red-500 text-white'
        }`}>
          {badge}
        </span>
      )}
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="block w-full">
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className="w-full">
      {content}
    </button>
  );
};

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

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [timeframe, setTimeframe] = useState('12 months');
  const [searchQuery, setSearchQuery] = useState('');

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('sidebar-search')?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard' },
    { icon: Briefcase, label: 'Projects', to: '/opportunities' },
    { icon: Clock, label: 'Tasks', badge: '3', to: '/applied' },
    { icon: BarChart3, label: 'Reporting', to: '/earnings' },
    { icon: Users, label: 'Users', to: '/creators' },
  ];

  const bottomNavItems = [
    { icon: HelpCircle, label: 'Support', to: '/support' },
    { icon: Settings, label: 'Settings', to: '/profile/edit' },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] font-inter">
      <Helmet>
        <title>Dashboard | DRIPLENS</title>
      </Helmet>

      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-100 flex flex-col sticky top-0 h-screen z-40 hidden lg:flex">
        <div className="p-6">
          <Link to="/" className="text-2xl font-black tracking-tighter text-[#0540F2]">DRIPLENS</Link>
        </div>

        {/* Search */}
        <div className="px-6 mb-6">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0540F2] transition-colors" size={16} />
            <input 
              id="sidebar-search"
              type="text" 
              placeholder="Search..." 
              className="w-full bg-gray-50 border border-transparent focus:border-[#0540F2] focus:bg-white rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-medium text-gray-400 bg-white border border-gray-200 rounded-md">⌘K</kbd>
            </div>
          </div>
        </div>

        {/* Main Nav */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <SidebarItem 
              key={item.label} 
              {...item} 
              active={activeTab === item.label}
              onClick={() => setActiveTab(item.label)}
            />
          ))}
        </nav>

        {/* Bottom Nav */}
        <div className="px-4 py-6 border-t border-gray-50 space-y-1">
          {bottomNavItems.map((item) => (
            <SidebarItem 
              key={item.label} 
              {...item} 
              active={activeTab === item.label}
              onClick={() => setActiveTab(item.label)}
            />
          ))}
          
          {/* New Features Card */}
          <div className="mt-6 p-4 bg-blue-50 rounded-2xl relative overflow-hidden group">
            <div className="absolute -right-2 -top-2 w-16 h-16 bg-blue-100/50 rounded-full blur-2xl group-hover:bg-blue-200/50 transition-colors" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-[#0540F2] rounded-lg text-white">
                  <Zap size={14} fill="currentColor" />
                </div>
                <span className="text-xs font-bold text-[#0540F2]">New features</span>
              </div>
              <p className="text-[11px] text-blue-800 leading-relaxed mb-3">
                Check out the latest updates to your workspace and tools.
              </p>
              <button className="text-[11px] font-bold text-[#0540F2] flex items-center gap-1 hover:underline">
                Dismiss <ChevronRight size={12} />
              </button>
            </div>
          </div>

          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all mt-4 group"
          >
            <LogOut size={20} className="text-gray-400 group-hover:text-red-600" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-1">Dashboard</h1>
            <p className="text-sm text-gray-500 font-medium">Welcome back, {user?.display_name || user?.username || 'Creator'}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Timeframe Selectors */}
            <div className="flex bg-white p-1 rounded-xl border border-gray-100 shadow-sm">
              {['12 months', '30 days', '7 days', '24 hours'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeframe(t)}
                  className={`px-3 md:px-4 py-1.5 text-[10px] md:text-xs font-bold rounded-lg transition-all ${
                    timeframe === t 
                      ? 'bg-[#0540F2] text-white shadow-md' 
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Date Range */}
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm text-[10px] md:text-xs font-bold text-gray-700">
              <Calendar size={14} className="text-gray-400" />
              <span className="hidden sm:inline">
                {format(subYears(new Date(), 1), 'dd MMM yyyy')} – {format(new Date(), 'dd MMM yyyy')}
              </span>
              <span className="sm:hidden">
                {format(new Date(), 'MMM yyyy')}
              </span>
            </div>

            {/* Filter */}
            <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm text-[10px] md:text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all">
              <Filter size={14} className="text-gray-400" />
              <span>Filters</span>
            </button>
          </div>
        </header>

        {/* MRR Section */}
        <section className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-8 shadow-sm border border-gray-50 mb-8 overflow-hidden relative">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-8 md:gap-12">
            <div>
              <div className="flex items-start justify-between mb-8">
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Monthly Recurring Revenue</p>
                  <div className="flex items-center gap-4">
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter">$18,880</h2>
                    <div className="flex items-center gap-1 bg-green-50 text-green-600 px-2 py-1 rounded-lg text-xs font-bold">
                      <TrendingUp size={14} />
                      <span>7.4%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chart */}
              <div className="h-[250px] md:h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mrrData[timeframe] || mrrData['12 months']}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0540F2" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#0540F2" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis 
                      dataKey="month" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 600 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 600 }}
                      dx={-10}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: 'none', 
                        borderRadius: '16px', 
                        boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)',
                        padding: '12px'
                      }}
                      itemStyle={{ color: '#0540F2', fontWeight: 800, fontSize: '14px' }}
                      labelStyle={{ color: '#94A3B8', fontWeight: 600, fontSize: '10px', textTransform: 'uppercase', marginBottom: '4px' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#0540F2" 
                      strokeWidth={4} 
                      fillOpacity={1} 
                      fill="url(#colorValue)" 
                      animationDuration={2000}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Vertical Stats */}
            <div className="flex flex-row lg:flex-col justify-around lg:justify-center gap-6 md:gap-10 border-t lg:border-t-0 lg:border-l border-gray-50 pt-6 lg:pt-0 lg:pl-12">
              <StatMini label="Total Members" value="2,420" change="12.5" isPositive={true} />
              <StatMini label="Paid Members" value="1,148" change="8.2" isPositive={true} />
              <StatMini label="Email Open Rate" value="64.2%" change="2.4" isPositive={true} />
            </div>
          </div>
        </section>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
          {/* Content Creation Cards */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900">Start creating content</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button onClick={() => navigate('/creators')} className="group text-left bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-50 text-[#0540F2] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#0540F2] group-hover:text-white transition-colors">
                  <UserPlus size={28} />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Create your first member</h4>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">Add yourself or import from CSV to get started.</p>
                <div className="mt-6 flex items-center gap-2 text-[#0540F2] text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                  Get Started <ChevronRight size={14} />
                </div>
              </button>

              <button onClick={() => navigate('/upload')} className="group text-left bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <PenLine size={28} />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Create a new post</h4>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">Dive into the editor and start creating your story.</p>
                <div className="mt-6 flex items-center gap-2 text-purple-600 text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                  Open Editor <ChevronRight size={14} />
                </div>
              </button>
            </div>
          </div>

          {/* Top Members */}
          <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-8 shadow-sm border border-gray-50">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-gray-900">Top Members</h3>
              <button className="text-[10px] font-black uppercase tracking-widest text-[#0540F2] hover:underline">View All</button>
            </div>
            <div className="space-y-6">
              {topMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl overflow-hidden border-2 border-white shadow-sm group-hover:scale-110 transition-transform">
                        <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                      </div>
                      {member.status === 'online' && (
                        <div className="absolute -right-1 -bottom-1 w-3 h-3 md:w-4 md:h-4 bg-green-500 border-2 md:border-4 border-white rounded-full" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#0540F2] transition-colors">{member.name}</h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Member since {member.date}</p>
                    </div>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all">
                    <MoreVertical size={16} />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-50">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#0540F2] shadow-sm">
                    <Mail size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Invite link</p>
                    <p className="text-xs font-bold text-gray-900 truncate">driplens.com/j/premium</p>
                  </div>
                </div>
                <button className="text-[10px] font-black uppercase tracking-widest bg-white px-3 py-1.5 rounded-lg shadow-sm hover:shadow-md transition-all shrink-0">Copy</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
