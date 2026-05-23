import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Plus, 
  CreditCard, 
  Clock,
  Zap,
  MessageSquare,
  BadgeCheck,
  CheckCircle2,
  FolderKanban,
  Search,
  Send,
  X,
  Sparkles,
  TrendingUp,
  Filter,
  DollarSign,
  Briefcase
} from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

// ─────────────────────────────────────────────────────────────────────────────
// Subcomponents (Structured to avoid focus loss and recreation)
// ─────────────────────────────────────────────────────────────────────────────

const DashboardOverview = ({ stats, deals }) => {
  return (
    <div className="space-y-12">
      {/* Overview Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Spend</span>
            <DollarSign size={16} className="text-[#0044ff]" />
          </div>
          <p className="text-3xl font-black mt-4">₹{stats.spend.toLocaleString()}</p>
        </div>
        <div className="p-6 border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Deals Closed</span>
            <CheckCircle2 size={16} className="text-green-500" />
          </div>
          <p className="text-3xl font-black mt-4">{deals.length}</p>
        </div>
        <div className="p-6 border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Active Workflows</span>
            <Briefcase size={16} className="text-[#0044ff]" />
          </div>
          <p className="text-3xl font-black mt-4">{stats.activeProjects}</p>
        </div>
        <div className="p-6 border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Success Rate</span>
            <TrendingUp size={16} className="text-purple-500" />
          </div>
          <p className="text-3xl font-black mt-4">{stats.completionRate}%</p>
        </div>
      </div>

      {/* Deals Done So Far List */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-black uppercase tracking-tight">Deals Done So Far</h3>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Verified partnerships on Driplens</p>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-[#0044ff] text-white border-2 border-black">
            Closed Contracts
          </span>
        </div>

        <div className="border-2 border-black bg-white divide-y-2 divide-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          {deals.map(deal => (
            <div key={deal.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img src={deal.creator.avatar_url} className="w-12 h-12 rounded-full border-2 border-black object-cover" alt="" />
                <div>
                  <h4 className="text-lg font-bold">{deal.title}</h4>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Hired: {deal.creator.name} • {deal.creator.niche}</p>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-8">
                <div className="text-right">
                  <p className="text-lg font-black">₹{deal.amount.toLocaleString()}</p>
                  <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Payout</p>
                </div>
                <span className="px-3 py-1 bg-green-400 text-black border-2 border-black text-[9px] font-black uppercase tracking-widest">
                  Verified Deal
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const DashboardExplore = ({ creators, activeIndustry, setActiveIndustry }) => {
  const industries = ['All', 'Fashion', 'Tech', 'Beauty', 'Gaming', 'Food'];
  const filteredCreators = activeIndustry === 'All' 
    ? creators 
    : creators.filter(c => c.niche.toLowerCase() === activeIndustry.toLowerCase());

  return (
    <div className="space-y-8">
      {/* Industry Filter Pills */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1.5 mr-2">
          <Filter size={12} /> Filter by Industry:
        </span>
        {industries.map(ind => (
          <button
            key={ind}
            onClick={() => setActiveIndustry(ind)}
            className={`px-4 py-2 border-2 border-black text-[10px] font-black uppercase tracking-widest transition-all ${
              activeIndustry === ind
                ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                : 'bg-white text-black hover:bg-gray-50'
            }`}
          >
            {ind}
          </button>
        ))}
      </div>

      {/* Creators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCreators.map(creator => (
          <div key={creator.id} className="border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all flex flex-col justify-between">
            <div>
              {/* Creator Photo Banner */}
              <div className="h-44 border-b-2 border-black relative">
                <img src={creator.portfolioPhoto} className="w-full h-full object-cover" alt="" />
                <div className="absolute top-4 left-4 bg-white border-2 border-black px-2.5 py-1 text-[8px] font-black uppercase tracking-widest">
                  {creator.niche}
                </div>
              </div>

              {/* Creator Bio & Info */}
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <img src={creator.avatar_url} className="w-10 h-10 rounded-full border-2 border-black object-cover" alt="" />
                  <div>
                    <h3 className="font-black text-base">{creator.name}</h3>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">@{creator.username}</p>
                  </div>
                </div>

                <p className="text-xs text-gray-500 font-medium leading-relaxed mb-4">{creator.bio}</p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 border-t-2 border-gray-100 pt-4">
                  <div>
                    <p className="text-sm font-black">{creator.followers}</p>
                    <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Followers</p>
                  </div>
                  <div>
                    <p className="text-sm font-black">{creator.engagementRate}%</p>
                    <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Engagement</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action */}
            <div className="p-6 pt-0 mt-4">
              <button 
                onClick={() => alert(`Chat initiated with ${creator.name}! Click the DL logo floating on the left to talk directly.`)}
                className="w-full py-3.5 bg-black text-white font-black uppercase text-[10px] tracking-widest border-2 border-black hover:bg-[#0044ff] hover:border-[#0044ff] transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none"
              >
                Hire & Message
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const DashboardProjects = ({ projects, handleAddProject }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCreator, setNewCreator] = useState('Aanya Sharma');
  const [newBudget, setNewBudget] = useState('');

  const submitProject = (e) => {
    e.preventDefault();
    if (!newTitle || !newBudget) return;
    handleAddProject({
      id: Date.now().toString(),
      progress: 0,
      status: 'in_progress',
      creator: { 
        username: newCreator.toLowerCase().replace(' ', '_'), 
        avatar_url: newCreator === 'Aanya Sharma' 
          ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' 
          : newCreator === 'Kabir Mehta'
          ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
          : newCreator === 'Neha Patel'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
          : 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
      },
      hiring_request: { project_title: newTitle, budget: Number(newBudget) }
    });
    setNewTitle('');
    setNewBudget('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* Header and Floating Action below nav */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-black uppercase tracking-tight">Active Deliverables</h3>
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Campaigns listed by your brand</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-3 bg-black text-white text-[10px] font-black uppercase tracking-widest border-2 border-black hover:bg-[#0044ff] hover:border-[#0044ff] transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none"
        >
          <Plus size={12} /> Add New Project
        </button>
      </div>

      {/* Projects list */}
      <div className="border-2 border-black bg-white divide-y-2 divide-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        {projects.map(p => (
          <div key={p.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-gray-50/30 transition-all">
            <div className="flex gap-4 items-center">
              <img src={p.creator.avatar_url} className="w-12 h-12 rounded-full border-2 border-black object-cover" alt="" />
              <div>
                <h3 className="text-lg font-bold tracking-tight">{p.hiring_request?.project_title || 'Creator Campaign'}</h3>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Creator Partner: {p.creator.username}</p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-8 md:gap-12 justify-between md:justify-end">
              {/* Progress bar */}
              <div className="w-36">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[8px] font-black uppercase tracking-widest text-gray-400 font-mono">Progress</span>
                  <span className="text-[10px] font-black font-mono">{p.progress}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 border-2 border-black">
                  <div className="h-full bg-[#0044ff]" style={{ width: `${p.progress}%` }} />
                </div>
              </div>

              {/* Budget */}
              <div className="text-right">
                <p className="text-base font-black">₹{Number(p.hiring_request?.budget || 25000).toLocaleString()}</p>
                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Budget</p>
              </div>

              {/* Status */}
              <span className={`px-3 py-1 border-2 text-[9px] font-black uppercase tracking-widest ${
                p.status === 'submitted' ? 'bg-[#0044ff] text-white border-[#0044ff]' : 'border-black bg-white text-black'
              }`}>
                {p.status.replace('_', ' ')}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white border-2 border-black p-8 w-full max-w-md shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black uppercase tracking-tight">Create New Campaign</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 border border-black hover:bg-black hover:text-white">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={submitProject} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Project Title</label>
                <input 
                  type="text" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Instagram Reels Campaign"
                  className="w-full p-4 border-2 border-black font-bold outline-none text-xs"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Select Creator</label>
                <select 
                  value={newCreator}
                  onChange={(e) => setNewCreator(e.target.value)}
                  className="w-full p-4 border-2 border-black font-bold outline-none text-xs bg-white"
                >
                  <option>Aanya Sharma</option>
                  <option>Kabir Mehta</option>
                  <option>Neha Patel</option>
                  <option>Rohan Das</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Project Budget (INR)</label>
                <input 
                  type="number" 
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                  placeholder="e.g. 50000"
                  className="w-full p-4 border-2 border-black font-bold outline-none text-xs"
                  required
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 border-2 border-black font-black uppercase text-xs tracking-widest hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-grow py-4 bg-[#0044ff] text-white border-2 border-[#0044ff] font-black uppercase text-xs tracking-widest hover:bg-black hover:border-black transition-all"
                >
                  Launch Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const DashboardPayments = ({ payments, handlePay }) => {
  const [payingItem, setPayingItem] = useState(null);
  const [successPaidItem, setSuccessPaidItem] = useState(null);

  const startPayment = (payment) => {
    setPayingItem(payment);
  };

  const processPayment = () => {
    if (!payingItem) return;
    handlePay(payingItem.id);
    setSuccessPaidItem(payingItem);
    setPayingItem(null);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending payments */}
        <div className="space-y-4">
          <h3 className="text-lg font-black uppercase tracking-tight text-red-500">Pending Approvals</h3>
          <div className="border-2 border-black bg-white divide-y-2 divide-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            {payments.filter(p => p.status === 'held').length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No pending payouts</p>
              </div>
            ) : (
              payments.filter(p => p.status === 'held').map(p => (
                <div key={p.id} className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-base">₹{p.amount.toLocaleString()}</h4>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Creator: {p.creator.username} • {p.opportunity.title}</p>
                    </div>
                    <span className="px-2 py-0.5 bg-yellow-300 text-black border border-black text-[7px] font-black uppercase tracking-widest">
                      Escrow Held
                    </span>
                  </div>
                  <button 
                    onClick={() => startPayment(p)}
                    className="w-full py-3 bg-black text-white font-black uppercase text-[10px] tracking-widest border-2 border-black hover:bg-[#0044ff] hover:border-[#0044ff] transition-all"
                  >
                    Release Payout
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Paid / Released payments */}
        <div className="space-y-4">
          <h3 className="text-lg font-black uppercase tracking-tight text-green-500">Transaction History</h3>
          <div className="border-2 border-black bg-white divide-y-2 divide-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            {payments.filter(p => p.status === 'released').map(p => (
              <div key={p.id} className="p-6 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-base">₹{p.amount.toLocaleString()}</h4>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Paid to: {p.creator.username} • {p.opportunity.title}</p>
                </div>
                <span className="px-3 py-1 bg-green-400 text-black border-2 border-black text-[9px] font-black uppercase tracking-widest">
                  Released
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Processing Overlay */}
      {payingItem && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white border-2 border-black p-8 w-full max-w-sm shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center">
            <h3 className="text-2xl font-black uppercase tracking-tight mb-4">Complete Payment</h3>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
              You are releasing <strong>₹{payingItem.amount.toLocaleString()}</strong> from Escrow to <strong>{payingItem.creator.username}</strong> for completing the opportunity.
            </p>
            <div className="flex gap-4">
              <button 
                type="button"
                onClick={() => setPayingItem(null)}
                className="flex-1 py-4 border-2 border-black font-black uppercase text-xs tracking-widest hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={processPayment}
                className="flex-grow py-4 bg-green-500 text-black border-2 border-black font-black uppercase text-xs tracking-widest hover:bg-black hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                Confirm Release
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Paid Dialog */}
      {successPaidItem && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white border-2 border-black p-8 w-full max-w-sm shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center space-y-4">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto border-2 border-green-600 font-bold">
              ✓
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tight">Payment Released!</h3>
            <p className="text-xs text-gray-500">
              Successfully paid <strong>₹{successPaidItem.amount.toLocaleString()}</strong> to <strong>{successPaidItem.creator.username}</strong>. A receipt has been sent to their email.
            </p>
            <button 
              type="button"
              onClick={() => setSuccessPaidItem(null)}
              className="w-full py-4 bg-black text-white border-2 border-black font-black uppercase text-xs tracking-widest hover:bg-gray-800 transition-all"
            >
              Back to Payments
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Page Component
// ─────────────────────────────────────────────────────────────────────────────

export default function BrandDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';
  
  // Custom States
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeChatId, setActiveChatId] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const [activeIndustry, setActiveIndustry] = useState('All');

  // Redesign States
  const [creators] = useState([
    {
      id: 'c1',
      name: 'Aanya Sharma',
      username: 'aanya_creates',
      niche: 'Fashion',
      followers: '125k',
      engagementRate: '4.8',
      bio: 'Fashion designer & content creator specializing in sustainable fashion lookbooks and street style reels.',
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      portfolioPhoto: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&auto=format&fit=crop&q=80'
    },
    {
      id: 'c2',
      name: 'Kabir Mehta',
      username: 'kabir_tech',
      niche: 'Tech',
      followers: '520k',
      engagementRate: '5.2',
      bio: 'Tech enthusiast. Creating clean, aesthetic unboxings, desk setups, and app reviews for modern brands.',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      portfolioPhoto: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=80'
    },
    {
      id: 'c3',
      name: 'Neha Patel',
      username: 'neha_glam',
      niche: 'Beauty',
      followers: '95k',
      engagementRate: '6.1',
      bio: 'Professional makeup artist sharing skincare routines, product reviews, and high-quality beauty tutorials.',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      portfolioPhoto: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&auto=format&fit=crop&q=80'
    },
    {
      id: 'c4',
      name: 'Rohan Das',
      username: 'rohan_gaming',
      niche: 'Gaming',
      followers: '310k',
      engagementRate: '4.5',
      bio: 'Gaming setup reviewer, streamer, and esports coverage specialist. High energy reviews and tech unboxings.',
      avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      portfolioPhoto: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=500&auto=format&fit=crop&q=80'
    },
    {
      id: 'c5',
      name: 'Meera Sen',
      username: 'meera_eats',
      niche: 'Food',
      followers: '180k',
      engagementRate: '5.9',
      bio: 'Home chef & food blogger. Creating visual recipe videos and capturing aesthetic food stories for brands.',
      avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      portfolioPhoto: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=500&auto=format&fit=crop&q=80'
    }
  ]);

  const [deals] = useState([
    {
      id: 'd1',
      title: 'Aesthetic Tech Desk Setup Review',
      amount: 45000,
      creator: {
        name: 'Kabir Mehta',
        niche: 'Tech',
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
      }
    },
    {
      id: 'd2',
      title: 'Summer Fashion Lookbook Reel',
      amount: 25000,
      creator: {
        name: 'Aanya Sharma',
        niche: 'Fashion',
        avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
      }
    },
    {
      id: 'd3',
      title: 'Glass Skin Skincare Routine Video',
      amount: 30000,
      creator: {
        name: 'Neha Patel',
        niche: 'Beauty',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      }
    }
  ]);

  const [projects, setProjects] = useState([
    { id: 'pr1', progress: 75, status: 'in_progress', creator: { username: 'aanya_creates', avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' }, hiring_request: { project_title: 'Summer Collection Reel', budget: 25000 } },
    { id: 'pr2', progress: 30, status: 'in_progress', creator: { username: 'samantha_vlogs', avatar_url: 'https://i.pravatar.cc/150?u=2' }, hiring_request: { project_title: 'Winter Lookbook', budget: 15000 } },
    { id: 'pr3', progress: 90, status: 'in_progress', creator: { username: 'kabir_tech', avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' }, hiring_request: { project_title: 'Tech Unboxing', budget: 45000 } },
    { id: 'pr4', progress: 100, status: 'submitted', creator: { username: 'eco_warrior_jane', avatar_url: 'https://i.pravatar.cc/150?u=6' }, hiring_request: { project_title: 'Eco Friendly Home', budget: 20000 } }
  ]);

  const [paymentsData, setPaymentsData] = useState([
    { id: 'p1', amount: 25000, status: 'released', creator: { username: 'aanya_creates' }, opportunity: { title: 'Summer Reel' } },
    { id: 'p2', amount: 15000, status: 'held', creator: { username: 'samantha_vlogs' }, opportunity: { title: 'Winter Essentials' } },
    { id: 'p3', amount: 50000, status: 'released', creator: { username: 'kabir_tech' }, opportunity: { title: 'App Walkthrough' } },
    { id: 'p4', amount: 12000, status: 'held', creator: { username: 'rohan_gaming' }, opportunity: { title: 'Fitness Post' } }
  ]);

  // Chat Data
  const [chatThreads, setChatThreads] = useState([
    {
      id: 't1',
      creator: {
        name: 'Aanya Sharma',
        avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
      },
      lastMessage: 'Hey, I just uploaded the draft for the Winter Lookbook project. Let me know what you think!',
      time: '10:45 AM',
      unread: true
    },
    {
      id: 't2',
      creator: {
        name: 'Kabir Mehta',
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
      },
      lastMessage: 'The script looks good. I will record the video tomorrow morning.',
      time: 'Yesterday',
      unread: false
    },
    {
      id: 't3',
      creator: {
        name: 'Rohan Das',
        avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
      },
      lastMessage: 'Could we extend the delivery deadline by 2 days?',
      time: 'May 20',
      unread: true
    }
  ]);

  const [chatMessages, setChatMessages] = useState({
    t1: [
      { sender: 'creator', text: 'Hi! Let me know if you need any adjustments to the brand deliverables outline.', time: '10:30 AM' },
      { sender: 'brand', text: 'Yes, please include a 5-second close-up shot of the brand logo in the beginning.', time: '10:40 AM' },
      { sender: 'creator', text: 'Hey, I just uploaded the draft for the Winter Lookbook project. Let me know what you think!', time: '10:45 AM' }
    ],
    t2: [
      { sender: 'brand', text: 'Hey Kabir, did you get a chance to look at the desk organizer script?', time: '2:15 PM' },
      { sender: 'creator', text: 'Yes, reading it now! Will send feedback in 10 mins.', time: '2:18 PM' },
      { sender: 'creator', text: 'The script looks good. I will record the video tomorrow morning.', time: 'Yesterday' }
    ],
    t3: [
      { sender: 'creator', text: 'Hi, the package just arrived today! The peripheral looks absolutely beautiful.', time: 'May 19' },
      { sender: 'brand', text: 'Awesome! Excited to see the setup showcase video.', time: 'May 19' },
      { sender: 'creator', text: 'Could we extend the delivery deadline by 2 days?', time: 'May 20' }
    ]
  });

  const unreadMessages = chatThreads.filter(t => t.unread).length;

  const handleSendMessage = (threadId, text) => {
    const newMsg = { sender: 'brand', text, time: 'Just now' };
    setChatMessages(prev => ({
      ...prev,
      [threadId]: [...(prev[threadId] || []), newMsg]
    }));
    
    setChatThreads(prev => prev.map(t => 
      t.id === threadId 
        ? { ...t, lastMessage: text, time: 'Just now', unread: false } 
        : t
    ));
    setChatInput('');

    // Simulated Creator Response
    setTimeout(() => {
      const autoReplies = [
        "Perfect! I'll get started on those updates right away.",
        "Got it, thanks for the feedback! I'll keep you posted.",
        "Sounds like a plan. I will check the details and send over the updated draft.",
        "Awesome! Looking forward to working on this next stage.",
        "Sure, that works for me. Let me coordinate and get back to you."
      ];
      const randomReply = autoReplies[Math.floor(Math.random() * autoReplies.length)];
      const replyMsg = { sender: 'creator', text: randomReply, time: 'Just now' };
      
      setChatMessages(p => ({
        ...p,
        [threadId]: [...(p[threadId] || []), replyMsg]
      }));

      setChatThreads(p => p.map(t => 
        t.id === threadId 
          ? { ...t, lastMessage: randomReply, time: 'Just now', unread: false } 
          : t
      ));
    }, 1500);
  };

  const handlePay = (paymentId) => {
    setPaymentsData(prev => prev.map(p => p.id === paymentId ? { ...p, status: 'released' } : p));
  };

  const handleAddProject = (newProject) => {
    setProjects(prev => [newProject, ...prev]);
  };

  const setActiveTab = (tab) => {
    setSearchParams({ tab });
  };

  // Temporarily commented out verification check so you can view/test dashboard immediately
  // useEffect(() => {
  //   if (user && !user.is_verified) {
  //     navigate('/verify/brand', { replace: true });
  //   }
  // }, [user, navigate]);

  const tabs = [
    { id: 'overview', label: 'Dashboard' },
    { id: 'explore', label: 'Explore' },
    { id: 'projects', label: 'Projects' },
    { id: 'payments', label: 'Payments' }
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <Helmet>
        <title>Brand Dashboard — Driplens</title>
      </Helmet>

      {/* Floating Logo (Left Side) - Doubles as Message Chat Drawer Toggle */}
      <div className="fixed left-6 top-6 z-50 flex items-center gap-2">
        <button 
          onClick={() => {
            setIsChatOpen(!isChatOpen);
            // Auto select first thread if none is active
            if (!activeChatId && chatThreads.length > 0) {
              setActiveChatId(chatThreads[0].id);
            }
          }}
          className="w-12 h-12 bg-black text-white border-2 border-black rounded-full flex items-center justify-center font-black text-sm tracking-tighter hover:scale-105 transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-[#0044ff] hover:border-[#0044ff] active:scale-95 group relative"
        >
          <span>DL</span>
          {unreadMessages > 0 && (
            <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center animate-bounce border-2 border-white">
              {unreadMessages}
            </span>
          )}
        </button>
        <span className="hidden md:inline-block text-[9px] font-black uppercase tracking-widest text-black bg-white border-2 border-black px-3 py-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          Messages
        </span>
      </div>

      {/* Floating Glassmorphic Top Navbar */}
      <div className="fixed top-6 left-0 right-0 z-40 flex justify-center px-4">
        <nav className="backdrop-blur-md bg-white/75 border-2 border-black rounded-full py-2 px-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex gap-1 items-center max-w-lg w-full">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 text-center py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all ${
                activeTab === tab.id
                  ? 'bg-black text-white'
                  : 'text-black hover:bg-black/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Chat Drawer Side Panel */}
      <AnimatePresence>
        {isChatOpen && (
          <>
            {/* Backdrop filter overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsChatOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-full sm:w-[380px] bg-white border-r-2 border-black shadow-2xl flex flex-col pt-24"
            >
              {/* Chat Panel Header */}
              <div className="p-6 border-b-2 border-black flex justify-between items-center bg-gray-50">
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                    <MessageSquare size={18} className="text-[#0044ff]" /> Messages
                  </h3>
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Chatting with active creators</p>
                </div>
                <button 
                  onClick={() => setIsChatOpen(false)}
                  className="p-2 border-2 border-black hover:bg-black hover:text-white transition-all text-[9px] font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none bg-white"
                >
                  Close
                </button>
              </div>

              {/* Chat Thread Selector / Thread List */}
              <div className="flex-1 flex flex-col min-h-0">
                {/* Conversations List */}
                <div className="p-4 bg-gray-50/50 border-b border-gray-100 flex gap-2 overflow-x-auto py-3">
                  {chatThreads.map(thread => (
                    <button
                      key={thread.id}
                      onClick={() => {
                        setActiveChatId(thread.id);
                        // Mark as read
                        setChatThreads(p => p.map(t => t.id === thread.id ? { ...t, unread: false } : t));
                      }}
                      className={`relative flex items-center gap-2 px-3 py-1.5 border-2 rounded-full text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                        activeChatId === thread.id 
                          ? 'bg-black text-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' 
                          : 'bg-white text-black border-gray-200 hover:border-black'
                      }`}
                    >
                      <img src={thread.creator.avatar_url} className="w-5 h-5 rounded-full object-cover border border-black" alt="" />
                      <span>{thread.creator.name.split(' ')[0]}</span>
                      {thread.unread && (
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Active Chat Conversation History */}
                {activeChatId ? (
                  <div className="flex-grow flex flex-col min-h-0 bg-gray-50/20">
                    <div className="flex-grow overflow-y-auto p-6 space-y-4">
                      {chatMessages[activeChatId]?.map((msg, index) => (
                        <div 
                          key={index}
                          className={`flex flex-col max-w-[85%] ${msg.sender === 'brand' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                        >
                          <div 
                            className={`p-4 border-2 border-black font-black text-xs leading-relaxed shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                              msg.sender === 'brand' 
                                ? 'bg-[#0044ff] text-white' 
                                : 'bg-white text-black'
                            }`}
                          >
                            {msg.text}
                          </div>
                          <span className="text-[8px] font-bold text-gray-400 mt-1.5 uppercase tracking-wider">{msg.time}</span>
                        </div>
                      ))}
                    </div>

                    {/* Chat Text Input Field */}
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!chatInput.trim()) return;
                        handleSendMessage(activeChatId, chatInput);
                      }}
                      className="p-4 border-t-2 border-black bg-white flex gap-2"
                    >
                      <input 
                        type="text" 
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-grow p-4 border-2 border-black font-black text-xs outline-none focus:border-[#0044ff]"
                      />
                      <button 
                        type="submit"
                        className="px-5 bg-black text-white font-black uppercase text-xs tracking-wider border-2 border-black hover:bg-[#0044ff] hover:border-[#0044ff] transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none"
                      >
                        <Send size={14} />
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-gray-50/20">
                    <MessageSquare size={36} className="text-gray-300 mb-2" />
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Select a creator conversation to begin chatting</p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 sm:px-8 mt-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-12"
          >
            {activeTab === 'overview' && (
              <DashboardOverview 
                stats={{ spend: 100000, activeProjects: projects.length, completionRate: 98 }} 
                deals={deals} 
              />
            )}
            {activeTab === 'explore' && (
              <DashboardExplore 
                creators={creators} 
                activeIndustry={activeIndustry} 
                setActiveIndustry={setActiveIndustry} 
              />
            )}
            {activeTab === 'projects' && (
              <DashboardProjects 
                projects={projects} 
                handleAddProject={handleAddProject} 
              />
            )}
            {activeTab === 'payments' && (
              <DashboardPayments 
                payments={paymentsData} 
                handlePay={handlePay} 
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
