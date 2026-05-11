import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Filter, MapPin, Tag, Clock, IndianRupee, Search, ChevronDown } from 'lucide-react';
import { api } from '../lib/api';

const FilterPill = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest border-2 transition-all ${
      active ? 'bg-black border-black text-white' : 'border-gray-100 text-gray-400 hover:border-black'
    }`}
  >
    {label}
  </button>
);

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    city: '',
    budget_type: '',
    niche: '',
    language: ''
  });

  useEffect(() => {
    fetchOpportunities();
  }, [filters]);

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams(filters).toString();
      const res = await api.get(`/opportunities?${query}`);
      setOpportunities(res.data);
    } catch (err) {
      console.error('Failed to fetch opportunities:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFilter = (key, value) => {
    setFilters(p => ({ ...p, [key]: p[key] === value ? '' : value }));
  };

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Opportunities — Driplens</title>
      </Helmet>

      {/* Header & Hero */}
      <div className="bg-black text-white py-24 px-8 border-b-2 border-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        <div className="max-w-[1400px] mx-auto relative z-10">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-8">
            OPEN<br />
            <span className="text-transparent" style={{ WebkitTextStroke: '2px white' }}>BRIEFS</span>
          </h1>
          <p className="text-sm font-bold uppercase tracking-[0.3em] opacity-60 max-w-md">
            Direct opportunities from top brands. No middleman. Professional meritocracy only.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b-2 border-black px-8 py-6">
        <div className="max-w-[1400px] mx-auto flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest mr-4">
            <Filter size={14} /> Filter By
          </div>
          
          <div className="flex flex-wrap gap-2">
            {/* Budget Type */}
            <FilterPill label="Paid" active={filters.budget_type === 'Paid'} onClick={() => toggleFilter('budget_type', 'Paid')} />
            <FilterPill label="Barter" active={filters.budget_type === 'Barter'} onClick={() => toggleFilter('budget_type', 'Barter')} />
            <FilterPill label="Paid + Barter" active={filters.budget_type === 'Paid + Barter'} onClick={() => toggleFilter('budget_type', 'Paid + Barter')} />
            
            <div className="w-[1px] h-8 bg-gray-100 mx-2" />
            
            {/* Niches */}
            {['Food', 'Fashion', 'Fitness', 'Tech', 'Travel'].map(n => (
              <FilterPill key={n} label={n} active={filters.niche === n} onClick={() => toggleFilter('niche', n)} />
            ))}

            <div className="w-[1px] h-8 bg-gray-100 mx-2" />

            {/* City Filter */}
            <div className="relative">
              <input 
                placeholder="CITY" 
                value={filters.city}
                onChange={(e) => setFilters(p => ({ ...p, city: e.target.value }))}
                className="px-4 py-2 border-2 border-black text-[10px] font-bold uppercase tracking-widest focus:outline-none w-24"
              />
            </div>

            {/* Language Filter */}
            <div className="relative">
              <input 
                placeholder="LANGUAGE" 
                value={filters.language}
                onChange={(e) => setFilters(p => ({ ...p, language: e.target.value }))}
                className="px-4 py-2 border-2 border-black text-[10px] font-bold uppercase tracking-widest focus:outline-none w-32"
              />
            </div>
          </div>

          <div className="flex-1" />
          
          {/* Search Placeholder */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input 
              placeholder="SEARCH CAMPAIGNS" 
              className="pl-10 pr-4 py-2 border-2 border-black text-[10px] font-bold uppercase tracking-widest focus:outline-none w-48 md:w-64"
            />
          </div>
        </div>
      </div>

      {/* Opportunity List */}
      <div className="max-w-[1400px] mx-auto px-8 py-12">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-24 bg-gray-50 animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : opportunities.length === 0 ? (
          <div className="py-40 text-center">
            <h2 className="text-2xl font-black uppercase tracking-tighter text-gray-300">No opportunities found</h2>
            <button onClick={() => setFilters({ city: '', budget_type: '', niche: '', language: '' })} className="mt-4 text-xs font-black uppercase tracking-widest underline underline-offset-8">Clear Filters</button>
          </div>
        ) : (
          <div className="space-y-4">
            {opportunities.map(opp => (
              <Link 
                to={`/opportunities/${opp.id}`} 
                key={opp.id}
                className="group flex flex-col md:flex-row md:items-center justify-between p-8 border-b border-gray-100 hover:bg-gray-50/50 hover:border-black transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-8">
                  <div className="w-16 h-16 bg-gray-50 border-2 border-black flex items-center justify-center shrink-0">
                    <img src={opp.brand?.avatar_url || 'https://via.placeholder.com/150'} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight mb-1 group-hover:text-[#0044ff] transition-colors">{opp.title}</h3>
                    <div className="flex flex-wrap gap-4 items-center">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#0044ff]">{opp.brand?.username}</span>
                      <span className="text-[10px] font-bold text-gray-300">•</span>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <MapPin size={10} /> {opp.city || 'Global'}
                      </div>
                      <span className="text-[10px] font-bold text-gray-300">•</span>
                      <div className="flex gap-2">
                        {opp.niche?.map(n => (
                          <span key={n} className="text-[8px] font-black uppercase tracking-widest px-2 py-1 bg-gray-100 text-gray-500">{n}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-12 mt-8 md:mt-0">
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1 text-xl font-black">
                      <IndianRupee size={16} /> {Number(opp.budget_amount || 0).toLocaleString()}
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-300">{opp.budget_type}</div>
                  </div>
                  <div className="text-right border-l border-gray-100 pl-8">
                    <div className="text-sm font-bold uppercase tracking-widest">{new Date(opp.application_deadline).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-red-500">Deadline</div>
                  </div>
                  <div className="hidden group-hover:block transition-all">
                    <div className="w-10 h-10 border-2 border-black flex items-center justify-center bg-black text-white">
                      <ChevronDown size={20} className="-rotate-90" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
