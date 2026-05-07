import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

// ── helpers ───────────────────────────────────────────────────────────────────
const InvoiceId = `DL-${Math.floor(Math.random() * 900_000) + 100_000}`;

const CheckIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
  </svg>
);

const Spinner = () => (
  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

// ── main component ────────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id: creatorId } = useParams();
  const { user } = useAuth();

  const { pkg, creator, hiring_request_id } = location.state || {};

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [agreed, setAgreed] = useState(false);

  // Guard — must arrive via navigate with state and valid data
  if (!pkg?.title || !pkg?.price || !creator) {
    return (
      <div className="min-h-[calc(100vh-60px)] flex flex-col items-center justify-center gap-6 bg-[#f8f9fa] font-sans">
        <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-2">
          <svg className="w-8 h-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-black mb-2">No Package Selected</h2>
          <p className="text-zinc-500 max-w-xs mx-auto mb-8">It looks like you haven't selected a package yet. Please return to the creator's profile to choose one.</p>
          <button
            onClick={() => navigate(creatorId ? `/profile/${creatorId}` : -1)}
            className="bg-[#0033CC] text-white px-10 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#002699] transition-all shadow-xl"
          >
            ← Back to Profile
          </button>
        </div>
      </div>
    );
  }

  const handlePay = async () => {
    if (!agreed) {
      setError('Please agree to the Terms of Service to continue.');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      if (hiring_request_id && user) {
        const res = await api.post('/projects', {
          hiring_request_id,
          package_title: pkg.title,
          package_price_str: pkg.price,
        });
        const projectId = res.data.project.id;
        navigate(`/progress/${projectId}`, { replace: true });
      } else {
        navigate('/progress', { state: { pkg, creator }, replace: true });
      }
    } catch (err) {
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-inter flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl w-full bg-white rounded-none shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[700px]"
      >
        {/* ── Left Column: Booking Details ───────────────────────────── */}
        <div className="flex-1 p-8 md:p-16 flex flex-col">
          <header className="mb-12">
            <h1 className="font-heading text-[32px] font-bold text-brand-headings tracking-tight uppercase mb-1">
              Checkout
            </h1>
            <p className="text-sm font-medium text-zinc-400 tracking-widest">
              INVOICE #{InvoiceId}
            </p>
          </header>

          {/* Booking Creator Section */}
          <section className="mb-10">
            <div className="flex items-center gap-5 p-6 rounded-none border border-zinc-100 bg-white shadow-soft">
              <div className="relative">
                <img
                  src={creator.img || creator.avatar_url || 'https://via.placeholder.com/64'}
                  alt={creator.name || creator.username}
                  className="w-16 h-16 rounded-full object-cover border-4 border-[#0033CC]/10"
                />
              </div>
              <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">
                  Booking Creator
                </p>
                <h3 className="text-xl font-bold text-brand-headings">
                  {creator.display_name || creator.name || creator.username}
                </h3>
              </div>
            </div>
          </section>

          {/* Package Details */}
          <section className="flex-1">
            <div className="flex justify-between items-end mb-6 border-b border-zinc-100 pb-6">
              <div>
                <h2 className="text-2xl font-bold text-brand-headings mb-1">{pkg.title}</h2>
                {pkg.subtitle && (
                  <p className="text-sm text-zinc-500 font-medium">{pkg.subtitle}</p>
                )}
              </div>
              <div className="text-2xl font-bold text-brand-headings">
                {pkg.price}
              </div>
            </div>

            {pkg.features?.length > 0 && (
              <ul className="space-y-4 mb-10">
                {pkg.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-zinc-600">
                    <CheckIcon className="w-5 h-5 text-[#0033CC] mt-0.5 shrink-0" />
                    <span className="text-sm font-medium leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Cost Breakdown */}
            <div className="mt-auto space-y-4 pt-8 border-t border-zinc-100">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-zinc-500">Subtotal</span>
                <span className="font-bold text-brand-headings">{pkg.price}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-zinc-500">Platform Fee (2.5%)</span>
                <span className="font-bold text-[#0033CC]">Included</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-zinc-500">GST (18%)</span>
                <span className="font-bold text-[#0033CC]">Included</span>
              </div>
            </div>
          </section>
        </div>

        {/* ── Right Column: Payment Summary ─────────────────────────── */}
        <div className="w-full md:w-[420px] bg-[#0033CC] p-8 md:p-16 flex flex-col justify-between text-white">
          <div>
            <div className="mb-12">
              <p className="text-sm font-bold text-white/70 uppercase tracking-widest mb-3">
                Total Due Today
              </p>
              <h2 className="text-4xl font-bold tracking-tighter leading-none">
                {pkg.price}
              </h2>
            </div>

            <div className="w-full h-px bg-white/10 mb-10" />

            <div className="space-y-6 mb-12">
              {[
                'Funds held securely in escrow',
                'Released only upon approval',
                'Revisions allowed',
                'Tracking board access',
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                    <CheckIcon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium tracking-wide">{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            {/* Terms & Conditions */}
            <label className="flex items-start gap-4 mb-8 cursor-pointer group">
              <div className="relative mt-1">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="peer sr-only"
                />
                <div className="w-6 h-6 border-2 border-white/30 rounded-none transition-all peer-checked:bg-white peer-checked:border-white group-hover:border-white/60 flex items-center justify-center">
                  {agreed && <CheckIcon className="w-4 h-4 text-[#0033CC]" />}
                </div>
              </div>
              <span className="text-xs font-medium text-white/80 leading-relaxed">
                I agree to the{' '}
                <a href="/terms" target="_blank" className="text-white underline font-bold underline-offset-4">
                  Terms of Service
                </a>{' '}
                and understand that payment is held in escrow.
              </span>
            </label>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-6"
                >
                  <p className="text-xs font-bold text-red-200">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Confirm Button */}
            <button
              onClick={handlePay}
              disabled={loading || !agreed}
              className="w-full bg-[#6C84FF] hover:bg-[#5A70E0] disabled:bg-[#6C84FF]/40 disabled:cursor-not-allowed text-black font-bold uppercase tracking-[0.1em] py-5 px-8 rounded-none flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] shadow-lg shadow-black/20 group"
            >
              {loading ? (
                <Spinner />
              ) : (
                <>
                  <span>Confirm & Pay</span>
                  <div className="transition-transform group-hover:translate-x-1">
                    <ArrowRightIcon />
                  </div>
                </>
              )}
            </button>

            {/* Security Note */}
            <div className="mt-8 text-center space-y-2">
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                256-bit SSL encrypted
              </p>
              <p className="text-[10px] font-medium text-white/30 italic">
                Escrow powered by Driplens Payments
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
