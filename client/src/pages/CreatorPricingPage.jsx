import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  CreditCard,
  MessageSquare,
  ChevronLeft
} from 'lucide-react';
import { api } from '../lib/api';

const DEFAULT_PACKAGES = [
  {
    title: 'Social / Lifestyle',
    price: '₹5,000–₹12,000',
    subtitle: 'Perfect for personal branding & short reels',
    features: ['2–4 hours shoot time', 'Professional lighting setup', 'Basic color grading', '2–3 edited short videos', 'Optimised for Instagram/TikTok', 'Web-ready delivery'],
  },
  {
    title: 'Event Coverage',
    price: '₹15,000–₹25,000',
    subtitle: 'Best for corporate events & parties',
    features: ['6–8 hours event coverage', 'Dual camera setup', 'Candid + staged shots', 'Advanced colour correction', '1–3 min highlight reel', 'Raw footage available'],
    popular: true,
  },
  {
    title: 'Commercial Film',
    price: '₹35,000–₹80,000+',
    subtitle: 'High-end visuals for brands & businesses',
    features: ['Full-day shoot (10–12 h)', 'Pre-production & storyboarding', 'Cinema-grade cameras', 'Professional crew & sound', 'Cinematic colour grading', 'Multiple export formats'],
  },
];

export default function CreatorPricingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCreator = async () => {
      try {
        const res = await api.get(`/creators/${id}`);
        setCreator(res.data.creator);
      } catch (err) {
        console.error('Failed to load creator:', err);
      } finally {
        setLoading(false);
      }
    };
    loadCreator();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!creator) return <div className="p-20 text-center">Creator not found</div>;

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-black pb-20">
      {/* ── Minimal Header ── */}
      <div className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
        <button 
          onClick={() => navigate(`/profile/${id}`)}
          className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#AAAAAA] hover:text-black transition-all flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Profile
        </button>
        <div className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#AAAAAA]">
          Secure Checkout System
        </div>
      </div>


      {/* ── Pricing Grid ── */}
      <div className="max-w-7xl mx-auto px-6 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {DEFAULT_PACKAGES.map((pkg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative flex flex-col p-10 border-2 transition-all duration-500 group ${
                pkg.popular 
                  ? 'border-black bg-white shadow-[12px_12px_0px_rgba(0,0,0,1)]' 
                  : 'border-zinc-100 bg-white hover:border-black hover:shadow-[12px_12px_0px_rgba(0,0,0,1)]'
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-6 bg-black text-white px-4 py-1 text-[9px] font-bold uppercase tracking-[0.2em]">
                  Most Popular Choice
                </div>
              )}
              
              <div className="mb-10">
                <h3 className="text-xl font-black uppercase tracking-tight mb-2">{pkg.title}</h3>
                <p className="text-[#888888] text-[13px] font-medium leading-relaxed">{pkg.subtitle}</p>
              </div>

              <div className="mb-12">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black tracking-tighter">{pkg.price}</span>
                </div>
                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#AAAAAA] mt-2 italic">Est. Project Value</p>
              </div>

              <div className="flex-grow mb-12">
                <ul className="space-y-4">
                  {pkg.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-black shrink-0 mt-0.5" />
                      <span className="text-[12px] font-bold text-zinc-600 leading-tight">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                onClick={() => navigate(`/profile/${creator.id}/checkout`, { state: { pkg, creator } })}
                className={`w-full py-5 text-[11px] font-bold uppercase tracking-[0.3em] transition-all border-2 ${
                  pkg.popular 
                    ? 'bg-black text-white border-black hover:bg-zinc-800' 
                    : 'bg-white text-black border-zinc-900 hover:bg-black hover:text-white'
                }`}
              >
                Select Package
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Trust Section ── */}
      <div className="max-w-7xl mx-auto px-6 py-12 border-t border-zinc-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <ShieldCheck className="w-8 h-8 text-black" />
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em]">Secure Escrow</h4>
            <p className="text-[12px] text-[#888888] leading-relaxed">Funds are held safely in escrow and only released upon your final approval of the work.</p>
          </div>
          <div className="space-y-4">
            <Clock className="w-8 h-8 text-black" />
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em]">Timeline Guarantees</h4>
            <p className="text-[12px] text-[#888888] leading-relaxed">Milestone-based tracking ensures your project stays on schedule and updates are frequent.</p>
          </div>
          <div className="space-y-4">
            <CreditCard className="w-8 h-8 text-black" />
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em]">Split Payments</h4>
            <p className="text-[12px] text-[#888888] leading-relaxed">Flexible payment options including 50/50 splits or full upfront for priority scheduling.</p>
          </div>
          <div className="space-y-4 text-center border-2 border-dashed border-zinc-100 p-8 flex flex-col items-center justify-center">
            <MessageSquare className="w-8 h-8 text-[#AAAAAA] mb-4" />
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em]">Need something else?</h4>
            <button 
              onClick={() => navigate(`/dm/${id}`)}
              className="mt-4 text-[11px] font-bold uppercase tracking-[0.2em] underline underline-offset-8 hover:text-blue-600 transition-all"
            >
              Request Custom Quote
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
