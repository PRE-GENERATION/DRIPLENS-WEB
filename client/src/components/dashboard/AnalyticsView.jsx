import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Eye, MousePointer2, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const AnalyticsView = () => {
  const metrics = [
    { label: 'Total Views', value: '124.5k', trend: '+12.4%', up: true, icon: <Eye size={20} className="text-blue-600" />, color: 'bg-blue-50' },
    { label: 'Active Members', value: '3,842', trend: '+8.2%', up: true, icon: <Users size={20} className="text-indigo-600" />, color: 'bg-indigo-50' },
    { label: 'Click Rate', value: '4.2%', trend: '-2.1%', up: false, icon: <MousePointer2 size={20} className="text-purple-600" />, color: 'bg-purple-50' },
    { label: 'Conversion', value: '2.8%', trend: '+4.5%', up: true, icon: <TrendingUp size={20} className="text-green-600" />, color: 'bg-green-50' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-8"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Analytics Overview</h2>
        <div className="flex gap-2">
          <select className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black/5">
            <option>Last 30 days</option>
            <option>Last 7 days</option>
            <option>Last 24 hours</option>
          </select>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m) => (
          <div key={m.label} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-10 h-10 rounded-xl ${m.color} flex items-center justify-center`}>
                {m.icon}
              </div>
              <span className={`flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full ${m.up ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {m.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {m.trend}
              </span>
            </div>
            <p className="text-sm font-medium text-gray-500 mb-1">{m.label}</p>
            <h3 className="text-2xl font-bold">{m.value}</h3>
          </div>
        ))}
      </div>

      {/* Growth Chart Placeholder */}
      <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-lg font-bold">Growth Trends</h3>
            <p className="text-sm text-gray-500">Monitor your audience growth over time</p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
              <span className="text-xs font-medium text-gray-600">Active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-200"></div>
              <span className="text-xs font-medium text-gray-600">New</span>
            </div>
          </div>
        </div>

        <div className="h-72 w-full relative">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 1000 200" preserveAspectRatio="none">
             {/* Grid Lines */}
             {[0, 1, 2, 3, 4].map(i => (
                <line key={i} x1="0" y1={i * 50} x2="1000" y2={i * 50} stroke="#f8fafc" strokeWidth="1" />
              ))}
              
              {/* Complex Area Path */}
              <motion.path
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                d="M0,180 C100,170 150,120 200,130 C250,140 300,80 400,90 C500,100 550,40 650,50 C750,60 850,20 1000,30"
                fill="none"
                stroke="#6366f1"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <motion.path
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.1 }}
                transition={{ delay: 0.5, duration: 1 }}
                d="M0,180 C100,170 150,120 200,130 C250,140 300,80 400,90 C500,100 550,40 650,50 C750,60 850,20 1000,30 V200 H0 Z"
                fill="#6366f1"
              />
          </svg>
          <div className="flex justify-between mt-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AnalyticsView;
