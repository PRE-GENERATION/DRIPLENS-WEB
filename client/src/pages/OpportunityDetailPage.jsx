import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { demoPhotographyOpportunities } from '../data/demoPhotographyOpportunities';
import { api } from '../lib/api';

export default function OpportunityDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplyDrawer, setShowApplyDrawer] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [pitch, setPitch] = useState('');
  const [workLink, setWorkLink] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [bidError, setBidError] = useState('');

  useEffect(() => {
    const fetchOpportunity = async () => {
      try {
        // Try fetching from API first
        const res = await api.get(`/opportunities/${id}`);
        if (res.data) {
          // Map API response to our UI format
          setOpportunity({
            ...res.data,
            campaignTitle: res.data.title || res.data.campaignTitle,
            brandName: res.data.brand?.username || res.data.brandName || 'Brand',
            budgetAmount: res.data.budget_amount || res.data.budgetAmount || 0,
            budgetType: res.data.budget_type || res.data.budgetType || 'Paid',
            city: res.data.niche || ['Remote'], // Fallback
            applicationDeadline: res.data.created_at || new Date().toISOString(),
            contentDeadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            extraRequirements: { rawFilesNeeded: true, revisions: 1, usageRights: ['Instagram'] },
            deliverables: { photos: 2, reels: 1, stories: 1 }
          });
          setLoading(false);
          return;
        }
      } catch (e) {
        console.log('API fetch failed, trying fallbacks...');
      }

      // Check if it's from the dashboard fallback (e.g. o1, o2)
      if (id.startsWith('o')) {
        const dashboardOpps = [
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

        const fallback = dashboardOpps.find(opp => opp.id === id);
        if (fallback) {
          setOpportunity({
            id: fallback.id,
            campaignTitle: fallback.title,
            brandName: fallback.brand.username,
            brandIntroduction: `Leading brand looking for creators for ${fallback.title}.`,
            campaignGoal: `Create engaging content for ${fallback.brand.username}'s upcoming campaign.`,
            city: ["Mumbai", "Delhi", "Bangalore"], // dummy
            language: ["English", "Hindi"],
            niche: fallback.niche,
            followersRange: { min: 10000, max: 100000 },
            genderPreference: "Any",
            deliverables: { photos: 2, reels: 1, stories: 2 },
            budgetType: fallback.budget_type,
            budgetAmount: fallback.budget_amount,
            applicationDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            contentDeadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
            extraRequirements: {
              rawFilesNeeded: false,
              revisions: 1,
              usageRights: ["Instagram", "YouTube"],
            },
          });
          setLoading(false);
          return;
        }
      }

      // Finally, check demoPhotographyOpportunities
      const found = demoPhotographyOpportunities.find(opp => opp.id === id);
      setOpportunity(found);
      setLoading(false);
    };

    fetchOpportunity();
  }, [id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('en-GB', { month: 'short' }).toUpperCase();
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const handleApply = (e) => {
    e.preventDefault();
    if (!bidAmount || parseInt(bidAmount) <= 0) {
      setBidError('Please enter a valid bid amount greater than zero.');
      return;
    }
    
    // Optional check: bid <= budget
    if (opportunity.budgetAmount > 0 && parseInt(bidAmount) > opportunity.budgetAmount) {
      setBidError(`Bid cannot exceed the campaign budget of ₹${opportunity.budgetAmount.toLocaleString()}`);
      return;
    }

    const applicationData = {
      opportunityId: opportunity.id,
      campaignTitle: opportunity.campaignTitle,
      pitch,
      workLink,
      bidAmount: parseInt(bidAmount)
    };

    console.log('Application Submitted:', applicationData);

    setBidError('');
    setApplySuccess(true);
    setTimeout(() => {
      setShowApplyDrawer(false);
      setApplySuccess(false);
      setPitch('');
      setWorkLink('');
      setBidAmount('');
    }, 2000);
  };

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center"><div className="w-8 h-8 border-4 border-black border-t-transparent animate-spin" /></div>;
  
  if (!opportunity) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-6 px-8 text-center">
        <h1 className="text-4xl font-black uppercase tracking-tighter">Opportunity not found</h1>
        <p className="text-gray-500 uppercase tracking-widest font-bold text-sm">The campaign you are looking for might have expired or doesn't exist.</p>
        <Link to="/opportunities" className="px-8 py-4 bg-black text-white font-black uppercase tracking-widest text-xs">Back to all opportunities</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-[#0F172A]">
      <Helmet>
        <title>{opportunity.campaignTitle} — Driplens</title>
      </Helmet>

      <div className="max-w-6xl mx-auto px-6 py-8 md:py-12">
        {/* Navigation */}
        <button 
          onClick={() => navigate('/opportunities')} 
          className="text-[14px] font-medium uppercase tracking-widest text-[#64748B] hover:text-[#0F172A] transition-colors mb-12"
        >
          BACK TO LIST
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 lg:gap-20 items-start">
          
          {/* Left Column: Main Campaign Info */}
          <div className="space-y-12 max-w-[640px]">
            {/* Header section */}
            <div className="space-y-4">
              <h1 className="text-[40px] md:text-[48px] font-bold tracking-tight leading-[1.1] text-[#0F172A]">
                {opportunity.campaignTitle}
              </h1>
              <div className="space-y-1">
                <p className="text-lg font-bold text-[#0F172A]">{opportunity.brandName}</p>
                <p className="text-[16px] text-[#475569] leading-relaxed">
                  {opportunity.brandIntroduction}
                </p>
              </div>
            </div>

            {/* Campaign Goal */}
            <div className="space-y-3">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#94A3B8]">
                Campaign Goal
              </h3>
              <p className="text-[18px] text-[#334155] leading-relaxed">
                {opportunity.campaignGoal}
              </p>
            </div>

            {/* Deliverables */}
            <div className="space-y-6">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#94A3B8]">
                Required Deliverables
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-6 bg-[#F1F5F9] rounded-sm text-center space-y-1">
                  <p className="text-3xl font-bold text-[#0F172A]">{opportunity.deliverables.reels}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Reels</p>
                </div>
                <div className="p-6 bg-[#F1F5F9] rounded-sm text-center space-y-1">
                  <p className="text-3xl font-bold text-[#0F172A]">{opportunity.deliverables.stories}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Stories</p>
                </div>
                <div className="p-6 bg-[#F1F5F9] rounded-sm text-center space-y-1">
                  <p className="text-3xl font-bold text-[#0F172A]">{opportunity.deliverables.photos}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Photos</p>
                </div>
              </div>
            </div>

            {/* Requirements (Supplementary) */}
            <div className="pt-8 border-t border-[#E2E8F0] space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#94A3B8]">Target</h4>
                  <ul className="space-y-2 text-sm font-medium">
                    <li><span className="text-[#94A3B8]">CITY:</span> {opportunity.city.join(', ')}</li>
                    <li><span className="text-[#94A3B8]">NICHE:</span> {opportunity.niche.join(', ')}</li>
                    <li><span className="text-[#94A3B8]">LANGUAGE:</span> {opportunity.language.join(', ')}</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#94A3B8]">Creator</h4>
                  <ul className="space-y-2 text-sm font-medium">
                    <li><span className="text-[#94A3B8]">FOLLOWERS:</span> {opportunity.followersRange.min.toLocaleString()} - {opportunity.followersRange.max.toLocaleString()}</li>
                    <li><span className="text-[#94A3B8]">GENDER:</span> {opportunity.genderPreference}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Summary Box */}
          <div className="lg:sticky lg:top-8 w-full">
            <div className="bg-white border border-[#E2E8F0] shadow-[0px_4px_20px_rgba(203,213,225,0.3)] p-8 rounded-sm space-y-8">
              {/* Budget */}
              <div className="space-y-2">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#94A3B8]">Campaign Budget</h3>
                <p className="text-[24px] font-bold text-[#1E293B]">
                  {opportunity.budgetType} {opportunity.budgetAmount > 0 && `₹${opportunity.budgetAmount.toLocaleString()}`}
                </p>
              </div>

              <div className="h-[1px] bg-[#E2E8F0]" />

              {/* Deadlines */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#94A3B8]">Application Deadline</h3>
                  <p className="text-[16px] font-bold text-[#1E293B]">{formatDate(opportunity.applicationDeadline)}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#94A3B8]">Content Deadline</h3>
                  <p className="text-[16px] font-bold text-[#1E293B]">{formatDate(opportunity.contentDeadline)}</p>
                </div>
              </div>

              <div className="h-[1px] bg-[#E2E8F0]" />

              {/* Quick Facts */}
              <div className="space-y-3">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#94A3B8]">Quick Specifications</h3>
                <ul className="space-y-2 text-xs font-bold text-[#475569] uppercase tracking-wider">
                  <li>• RAW FILES {opportunity.extraRequirements.rawFilesNeeded ? 'REQUIRED' : 'NOT NEEDED'}</li>
                  <li>• {opportunity.extraRequirements.revisions} REVISION ROUNDS</li>
                  <li>• {opportunity.extraRequirements.usageRights.join(' + ')} USAGE</li>
                </ul>
              </div>

              <button 
                onClick={() => setShowApplyDrawer(true)}
                className="w-full py-4 bg-[#0F172A] text-white text-[14px] font-bold uppercase tracking-widest hover:bg-[#1E293B] transition-all rounded-sm"
              >
                APPLY FOR BRIEF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Drawer */}
      <AnimatePresence>
        {showApplyDrawer && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowApplyDrawer(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ x: '100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-full md:w-[500px] bg-white z-[101] shadow-2xl p-12 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-16">
                <h2 className="text-3xl font-black uppercase tracking-tighter">Apply</h2>
                <button onClick={() => setShowApplyDrawer(false)} className="text-xs font-black uppercase tracking-widest hover:underline">
                  CLOSE
                </button>
              </div>

              {applySuccess ? (
                <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
                  <div className="text-6xl mb-4">✨</div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter">Application Sent</h3>
                  <p className="text-sm font-bold uppercase tracking-widest text-[#94A3B8] leading-relaxed">
                    Your application has been submitted. The brand will review your profile shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleApply} className="space-y-10">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Introduction Pitch</label>
                    <textarea 
                      required
                      placeholder="Why are you the perfect fit?"
                      value={pitch}
                      onChange={(e) => setPitch(e.target.value)}
                      className="w-full p-6 border border-[#E2E8F0] font-medium outline-none focus:border-[#0F172A] resize-none h-40"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Relevant Work Link</label>
                    <input 
                      required
                      type="url"
                      placeholder="Portfolio or Reel link"
                      value={workLink}
                      onChange={(e) => setWorkLink(e.target.value)}
                      className="w-full p-6 border border-[#E2E8F0] font-medium outline-none focus:border-[#0F172A]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Your Bid Amount (₹)</label>
                    <input 
                      required
                      type="number"
                      min="1"
                      placeholder="Enter your bid amount"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      className={`w-full p-6 border ${bidError ? 'border-red-500' : 'border-[#E2E8F0]'} font-medium outline-none focus:border-[#0F172A]`}
                    />
                    {bidError && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">{bidError}</p>}
                  </div>
                  <button 
                    type="submit"
                    className="w-full py-6 bg-[#0F172A] text-white font-bold uppercase tracking-widest hover:bg-black transition-all"
                  >
                    SUBMIT APPLICATION
                  </button>
                </form>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
