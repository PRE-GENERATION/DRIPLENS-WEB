import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useSession } from '../hooks/useSession';

// Mock data for applied campaigns
const mockAppliedCampaigns = [
  {
    applicationId: 'app_1',
    campaignId: '1',
    campaignTitle: 'Summer Collection Shoot, Mumbai',
    brandName: 'Urban Threads',
    introPitch: "I've worked with several streetwear brands and can deliver a high-energy urban aesthetic that matches your brand's summer collection.",
    portfolioLink: 'https://portfolio.driplens.com/creator123',
    bidAmount: 15000,
    applicationStatus: 'Shortlisted',
    applicationDeadline: '2024-06-15',
    contentDeadline: '2024-06-30'
  },
  {
    applicationId: 'app_2',
    campaignId: '3',
    campaignTitle: 'Real Estate Drone Photography, Bangalore',
    brandName: 'Skyline Developers',
    introPitch: "Expert drone pilot with 4 years experience in architectural photography. I use the latest DJI gear for 4K cinematic shots.",
    portfolioLink: 'https://portfolio.driplens.com/creator123/drone',
    bidAmount: 35000,
    applicationStatus: 'Pending',
    applicationDeadline: '2024-06-20',
    contentDeadline: '2024-07-10'
  },
  {
    applicationId: 'app_3',
    campaignId: '5',
    campaignTitle: 'Food Photography for Gourmet Delights Cafe Pune',
    brandName: 'Gourmet Delights Café',
    introPitch: "I specialize in food styling and high-contrast lighting. My work has been featured in top lifestyle magazines.",
    portfolioLink: 'https://portfolio.driplens.com/creator123/food',
    bidAmount: 22000,
    applicationStatus: 'Pending',
    applicationDeadline: '2024-07-10',
    contentDeadline: '2024-07-30'
  }
];

export default function AppliedCampaignsPage() {
  const { data: session, status } = useSession();
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    const timer = setTimeout(() => {
      setApplications(mockAppliedCampaigns);
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'shortlisted': return 'bg-green-50 text-green-700 border-green-200';
      case 'pending': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'rejected': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-black border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans pb-20">
      <Helmet>
        <title>Applied Campaigns — Driplens</title>
      </Helmet>

      {/* Hero Section */}
      <section className="bg-[#000000] relative py-20 md:py-24 overflow-hidden border-b border-[#111111]">
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ 
            backgroundImage: `linear-gradient(#111111 1px, transparent 1px), linear-gradient(90deg, #111111 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
        
        <div className="max-w-[1400px] mx-auto px-8 md:px-12 relative z-10">
          <div className="flex flex-wrap items-baseline gap-x-4 mb-4">
            <h1 className="text-4xl md:text-[64px] font-black uppercase text-white leading-none tracking-tight">
              APPLIED
            </h1>
            <h1 
              className="text-4xl md:text-[64px] font-black uppercase text-transparent leading-none tracking-[0.1em]"
              style={{ WebkitTextStroke: '1px white' }}
            >
              CAMPAIGNS
            </h1>
          </div>
          <p className="text-[12px] md:text-[13px] font-medium uppercase tracking-[0.2em] text-white/60 max-w-2xl">
            TRACK YOUR SUBMISSIONS, STATUS, AND UPCOMING DEADLINES.
          </p>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-8 py-12">
        {applications.length === 0 ? (
          <div className="py-32 text-center border-2 border-dashed border-gray-100">
            <h2 className="text-xl font-bold uppercase tracking-widest text-gray-400 mb-6">You have not applied to any campaigns yet</h2>
            <Link 
              to="/opportunities" 
              className="inline-block bg-black text-white px-8 py-4 text-xs font-black uppercase tracking-[0.2em] hover:bg-gray-900 transition-colors"
            >
              Browse Opportunities
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Desktop Table Header */}
            <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border border-gray-200 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
              <div className="col-span-4">Campaign & Brand</div>
              <div className="col-span-3">Info Submitted</div>
              <div className="col-span-1 text-right">Bid</div>
              <div className="col-span-2 text-center">Deadlines</div>
              <div className="col-span-2 text-center">Status</div>
            </div>

            {/* List of Applications */}
            <div className="grid grid-cols-1 gap-4">
              {applications.map((app) => (
                <div 
                  key={app.applicationId}
                  className="bg-white border border-gray-200 hover:border-black transition-all group overflow-hidden"
                >
                  {/* Desktop View */}
                  <div className="hidden lg:grid grid-cols-12 gap-4 items-center p-6">
                    <div className="col-span-4">
                      <Link to={`/opportunities/${app.campaignId}`} className="block group-hover:translate-x-1 transition-transform">
                        <h3 className="font-bold text-lg leading-tight mb-1 group-hover:text-[#0540F2] transition-colors">{app.campaignTitle}</h3>
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{app.brandName}</p>
                      </Link>
                    </div>

                    <div className="col-span-3">
                      <p className="text-xs text-gray-600 line-clamp-2 mb-2 leading-relaxed">
                        {app.introPitch}
                      </p>
                      <Link 
                        to={`/opportunities/${app.campaignId}`}
                        className="text-[10px] font-black uppercase tracking-widest text-[#0540F2] hover:underline transition-all"
                        aria-label={`View details for ${app.campaignTitle}`}
                      >
                        View Portfolio
                      </Link>
                    </div>

                    <div className="col-span-1 text-right font-black text-lg">
                      ₹{app.bidAmount.toLocaleString()}
                    </div>

                    <div className="col-span-2 text-center space-y-2">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black uppercase text-gray-400 tracking-tighter">Applied By</span>
                        <span className="text-xs font-bold">{formatDate(app.applicationDeadline)}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black uppercase text-gray-400 tracking-tighter">Content Due</span>
                        <span className="text-xs font-bold text-[#F072F2]">{formatDate(app.contentDeadline)}</span>
                      </div>
                    </div>

                    <div className="col-span-2 flex justify-center">
                      <span className={`px-4 py-1.5 border text-[10px] font-black uppercase tracking-widest ${getStatusColor(app.applicationStatus)}`}>
                        {app.applicationStatus}
                      </span>
                    </div>
                  </div>

                  {/* Mobile View */}
                  <div className="lg:hidden p-6 space-y-6">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <Link to={`/opportunities/${app.campaignId}`} className="block">
                          <h3 className="font-bold text-lg leading-tight mb-1">{app.campaignTitle}</h3>
                          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{app.brandName}</p>
                        </Link>
                      </div>
                      <span className={`px-3 py-1 border text-[9px] font-black uppercase tracking-widest shrink-0 ${getStatusColor(app.applicationStatus)}`}>
                        {app.applicationStatus}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Pitch & Portfolio</h4>
                      <p className="text-sm text-gray-600 leading-relaxed italic border-l-2 border-gray-100 pl-4">
                        "{app.introPitch}"
                      </p>
                      <Link 
                        to={`/opportunities/${app.campaignId}`}
                        className="inline-block text-[10px] font-black uppercase tracking-widest text-[#0540F2] hover:underline transition-all"
                        aria-label={`View details for ${app.campaignTitle}`}
                      >
                        View Portfolio →
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
                      <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Bid Amount</h4>
                        <p className="text-xl font-black">₹{app.bidAmount.toLocaleString()}</p>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Content Deadline</h4>
                          <p className="text-sm font-bold text-[#F072F2]">{formatDate(app.contentDeadline)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
