import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Calendar, 
  Filter, 
  TrendingUp, 
  UserPlus, 
  PenLine, 
  MoreVertical,
  ExternalLink
} from 'lucide-react';
import NotificationsView from './dashboard/NotificationsView';
import AnalyticsView from './dashboard/AnalyticsView';
import ReportsView from './dashboard/ReportsView';

const OverviewContent = ({ user }) => {
  const [activeSubTab, setActiveSubTab] = useState('Overview');
  const tabs = ['Overview', 'Notifications', 'Analytics', 'Saved reports', 'Scheduled reports', 'User reports'];
  const timeRanges = ['12 months', '30 days', '7 days', '24 hours'];
  
  const stats = [
    { label: 'MRR', value: '$18,880', trend: '+7.4%', color: '#6366f1' },
    { label: 'Total members', value: '4,862', trend: '+9.2%', color: '#10b981' },
    { label: 'Paid members', value: '2,671', trend: '+6.6%', color: '#10b981' },
    { label: 'Email open rate', value: '82%', trend: '+8.1%', color: '#10b981' },
  ];

  const topMembers = [
    { name: 'Phoenix Baker', date: 'Feb 2026', avatar: 'https://i.pravatar.cc/150?u=phoenix' },
    { name: 'Lana Steiner', date: 'Jan 2026', avatar: 'https://i.pravatar.cc/150?u=lana' },
    { name: 'Demi Wilkinson', date: 'Mar 2026', avatar: 'https://i.pravatar.cc/150?u=demi' },
    { name: 'Candice Wu', date: 'Feb 2026', avatar: 'https://i.pravatar.cc/150?u=candice' },
    { name: 'Natali Craig', date: 'Mar 2026', avatar: 'https://i.pravatar.cc/150?u=natali' },
  ];

  const recentPosts = [
    {
      title: 'Building your API Stack',
      excerpt: 'The rise of RESTful APIs has been met by a rise in tools for creating, testing, and managing them.',
      author: 'Lana Steiner',
      date: '18 Jan 2026',
      category: 'Design',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800'
    },
    {
      title: 'Collaboration = better designer',
      excerpt: 'Collaboration can make our teams stronger, and our individual designs better.',
      author: 'Natali Craig',
      date: '14 Jan 2026',
      category: 'Design',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800'
    }
  ];

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto pb-20">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-gray-100 pb-4">
        <div className="flex gap-6 overflow-x-auto no-scrollbar pb-2 w-full md:w-auto">
          {tabs.map((tab) => (
            <button 
              key={tab} 
              onClick={() => setActiveSubTab(tab)}
              className={`text-sm font-medium whitespace-nowrap px-1 py-2 transition-colors relative ${activeSubTab === tab ? 'text-black' : 'text-gray-400 hover:text-black'}`}
            >
              {tab}
              {activeSubTab === tab && (
                <motion.div 
                  layoutId="activeSubTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Search" 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px] text-gray-400 font-medium">
            <span className="text-[12px]">⌘</span>K
          </div>
        </div>
      </div>

      {activeSubTab === 'Overview' && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-8"
        >
          {/* Welcome & Time Filter */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.username?.split(' ')[0] || 'Olivia'}</h1>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="flex bg-gray-100 p-1 rounded-lg">
                {timeRanges.map((range, i) => (
                  <button 
                    key={range} 
                    className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${i === 1 ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-black'}`}
                  >
                    {range}
                  </button>
                ))}
              </div>
              <button className="flex items-center gap-2 px-4 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold hover:bg-gray-50 transition-all">
                <Calendar size={14} /> Select dates
              </button>
              <button className="flex items-center gap-2 px-4 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold hover:bg-gray-50 transition-all">
                <Filter size={14} /> Filters
              </button>
            </div>
          </div>

          {/* Main Stats Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* MRR Chart Area */}
            <div className="lg:col-span-3 bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">MRR</p>
                  <div className="flex items-center gap-3">
                    <h2 className="text-4xl font-bold">$18,880</h2>
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-600 text-xs font-bold rounded-full">
                      <TrendingUp size={12} /> 7.4%
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Simple SVG Chart */}
              <div className="h-64 w-full relative mt-4">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 1000 200" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  {[0, 1, 2, 3].map(i => (
                    <line key={i} x1="0" y1={i * 66.6} x2="1000" y2={i * 66.6} stroke="#f3f4f6" strokeWidth="1" />
                  ))}
                  {/* Chart Path */}
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                    d="M0,150 L100,140 L200,145 L300,130 L400,135 L500,120 L600,110 L700,115 L800,105 L900,100 L1000,95"
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <motion.path
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.1 }}
                    transition={{ delay: 1, duration: 1 }}
                    d="M0,150 L100,140 L200,145 L300,130 L400,135 L500,120 L600,110 L700,115 L800,105 L900,100 L1000,95 V200 H0 Z"
                    fill="#6366f1"
                  />
                  {/* Lower Path */}
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: "easeInOut", delay: 0.2 }}
                    d="M0,180 L100,175 L200,185 L300,170 L400,178 L500,160 L600,155 L700,165 L800,145 L900,150 L1000,140"
                    fill="none"
                    stroke="#d1d5db"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />
                </svg>
                <div className="flex justify-between mt-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest">
                  <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
                </div>
              </div>
            </div>

            {/* Side Stats */}
            <div className="flex flex-col gap-6">
              {stats.slice(1).map((stat) => (
                <div key={stat.label} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold">{stat.value}</h3>
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-600 text-xs font-bold rounded-full">
                      <TrendingUp size={12} /> {stat.trend}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Content Creation & Recent Posts */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3 flex flex-col gap-8">
              {/* Start Creating */}
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold">Start creating content</h2>
                  <button className="text-gray-400 hover:text-black"><MoreVertical size={20} /></button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-4 p-6 bg-white border border-gray-200 rounded-2xl hover:border-black transition-all cursor-pointer group shadow-sm">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      <UserPlus size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold">Create your first member</h4>
                      <p className="text-xs text-gray-500">Add yourself or import from CSV</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-6 bg-white border border-gray-200 rounded-2xl hover:border-black transition-all cursor-pointer group shadow-sm">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      <PenLine size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold">Create a new post</h4>
                      <p className="text-xs text-gray-500">Dive into the editor and start creating</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Posts */}
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold">Recent posts</h2>
                  <button className="text-gray-400 hover:text-black"><MoreVertical size={20} /></button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {recentPosts.map((post) => (
                    <div key={post.title} className="group cursor-pointer">
                      <div className="aspect-[16/9] overflow-hidden rounded-2xl mb-4 border border-gray-100">
                        <img src={post.image} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" alt="" />
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">{post.category}</span>
                        <span className="text-gray-300">•</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{post.date}</span>
                      </div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-600 transition-colors">{post.title}</h3>
                      <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">{post.excerpt}</p>
                      <button className="flex items-center gap-2 text-indigo-600 text-xs font-bold hover:gap-3 transition-all">
                        Read post <ExternalLink size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Members Sidebar */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold">Top members</h2>
                <button className="text-gray-400 hover:text-black"><MoreVertical size={20} /></button>
              </div>
              <div className="flex flex-col gap-6">
                {topMembers.map((member) => (
                  <div key={member.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img src={member.avatar} className="w-10 h-10 rounded-full border border-gray-100" alt="" />
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold">{member.name}</h4>
                        <p className="text-[10px] text-gray-400 font-medium">Member since {member.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {activeSubTab === 'Notifications' && <NotificationsView />}
      {activeSubTab === 'Analytics' && <AnalyticsView />}
      {(activeSubTab === 'Saved reports' || activeSubTab === 'Scheduled reports' || activeSubTab === 'User reports') && (
        <ReportsView type={activeSubTab} />
      )}
    </div>
  );
};

export default OverviewContent;
