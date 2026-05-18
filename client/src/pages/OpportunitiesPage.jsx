import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { demoPhotographyOpportunities } from '../data/demoPhotographyOpportunities';

export default function OpportunitiesPage() {
  const [filters, setFilters] = useState({
    city: '',
    budget_type: '',
    niche: '',
    language: '',
    search: ''
  });

  const toggleFilter = (key, value) => {
    setFilters(p => ({ ...p, [key]: p[key] === value ? '' : value }));
  };

  // Filter logic for demo purposes
  const filteredOpportunities = demoPhotographyOpportunities.filter(opp => {
    const matchesCity = !filters.city || opp.city.some(c => c.toLowerCase().includes(filters.city.toLowerCase()));
    const matchesBudget = !filters.budget_type || opp.budgetType === filters.budget_type;
    const matchesNiche = !filters.niche || opp.niche.includes(filters.niche);
    const matchesLanguage = !filters.language || opp.language.some(l => l.toLowerCase().includes(filters.language.toLowerCase()));
    const matchesSearch = !filters.search || 
      opp.campaignTitle.toLowerCase().includes(filters.search.toLowerCase()) ||
      opp.brandName.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesCity && matchesBudget && matchesNiche && matchesLanguage && matchesSearch;
  });

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <Helmet>
        <title>Opportunities — Driplens</title>
      </Helmet>

      {/* Hero Section */}
      <section className="bg-[#000000] relative py-20 md:py-32 overflow-hidden border-b border-[#111111]">
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ 
            backgroundImage: `linear-gradient(#111111 1px, transparent 1px), linear-gradient(90deg, #111111 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
        
        <div className="max-w-[1400px] mx-auto px-8 md:px-12 relative z-10">
          <div className="flex flex-wrap items-baseline gap-x-4 mb-6">
            <h1 className="text-5xl md:text-[72px] font-black uppercase text-white leading-none tracking-tight">
              OPEN
            </h1>
            <h1 
              className="text-5xl md:text-[72px] font-black uppercase text-transparent leading-none tracking-[0.1em]"
              style={{ WebkitTextStroke: '1px white' }}
            >
              BRIEFS
            </h1>
          </div>
          
          <p className="text-[12px] md:text-[14px] font-medium uppercase tracking-[0.15em] text-white/70 max-w-2xl leading-relaxed">
            DIRECT OPPORTUNITIES FROM TOP BRANDS. NO MIDDLEMAN. PROFESSIONAL MERITOCRACY ONLY.
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="bg-white border-b border-black sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-8 py-4 flex flex-col md:flex-row md:items-center gap-6 overflow-x-auto no-scrollbar">
          
          <div className="flex items-center gap-2 text-[#6B7280] text-[12px] md:text-[14px] font-bold uppercase tracking-[0.1em] shrink-0">
            FILTER BY
          </div>

          <div className="flex items-center gap-3 md:gap-4 shrink-0">
            {[
              { id: 'Paid', label: 'Paid' },
              { id: 'Barter', label: 'Barter' },
              { id: 'Photography', label: 'Photography' },
              { id: 'Fashion', label: 'Fashion' },
              { id: 'Lifestyle', label: 'Lifestyle' },
              { id: 'Travel', label: 'Travel' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  if (['Paid', 'Barter'].includes(cat.id)) {
                    toggleFilter('budget_type', cat.id);
                  } else {
                    toggleFilter('niche', cat.id);
                  }
                }}
                className={`px-4 py-2 text-[12px] md:text-[14px] font-bold uppercase transition-all border ${
                  (filters.budget_type === cat.id || filters.niche === cat.id)
                    ? 'border-black text-black bg-white' 
                    : 'border-black text-[#6B7280] bg-white hover:bg-black/5'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <input
              type="text"
              placeholder="CITY"
              value={filters.city}
              onChange={(e) => setFilters(p => ({ ...p, city: e.target.value }))}
              className="w-32 md:w-40 px-4 py-2 border border-black text-[12px] md:text-[14px] font-bold uppercase placeholder:text-[#9CA3AF] focus:outline-none focus:ring-0"
            />
          </div>

          <div className="relative flex-1 md:max-w-md min-w-[200px]">
            <input
              type="text"
              placeholder="SEARCH CAMPAIGNS"
              value={filters.search}
              onChange={(e) => setFilters(p => ({ ...p, search: e.target.value }))}
              className="w-full px-4 py-2 border border-black text-[12px] md:text-[14px] font-bold uppercase placeholder:text-[#9CA3AF] focus:outline-none focus:ring-0"
            />
          </div>
        </div>
      </section>

      {/* Opportunity List */}
      <div className="max-w-[1400px] mx-auto px-8 py-12">
        {filteredOpportunities.length === 0 ? (
          <div className="py-40 text-center">
            <h2 className="text-2xl font-black uppercase tracking-tighter text-gray-300">No opportunities found</h2>
            <button onClick={() => setFilters({ city: '', budget_type: '', niche: '', language: '', search: '' })} className="mt-4 text-xs font-black uppercase tracking-widest underline underline-offset-8">Clear Filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredOpportunities.map(opp => (
              <Link 
                to={`/opportunities/${opp.id}`} 
                key={opp.id}
                className="group block p-5 bg-white border border-gray-100 hover:border-black transition-all shadow-sm hover:shadow-md"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div>
                      <h3 className="text-xl font-bold tracking-tight mb-0.5">{opp.campaignTitle}</h3>
                      <p className="text-sm text-gray-600 font-medium">{opp.brandName}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                        {opp.city.join(', ')}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                        {opp.niche.join(', ')}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:items-end gap-1 shrink-0">
                    <div className="text-lg font-black">
                      {opp.budgetType} {opp.budgetAmount > 0 && `₹${opp.budgetAmount.toLocaleString()}`}
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      Apply by {formatDate(opp.applicationDeadline)}
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
