import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

// ── helpers ───────────────────────────────────────────────────────────────────
const InvoiceId = `DL-${Math.floor(Math.random() * 900_000) + 100_000}`;

const CheckIcon = () => (
  <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
  </svg>
);

const Spinner = () => (
  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
  </svg>
);

// ── main component ────────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const location       = useLocation();
  const navigate       = useNavigate();
  const { user }       = useAuth();

  const { pkg, creator, hiring_request_id } = location.state || {};

  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [agreed, setAgreed]     = useState(false);

  // Guard — must arrive via navigate with state
  if (!pkg || !creator) {
    return (
      <div className="min-h-[calc(100vh-60px)] flex flex-col items-center justify-center gap-4 bg-[#f8f9fa]">
        <p className="text-black font-bold">Nothing to check out.</p>
        <button
          onClick={() => navigate(-1)}
          className="text-[#0540F2] underline font-bold text-sm"
        >
          ← Go back
        </button>
      </div>
    );
  }

  const handlePay = async () => {
    if (!agreed) { setError('Please agree to the Terms of Service to continue.'); return; }
    setError(null);
    setLoading(true);

    try {
      // If a hiring_request_id was passed, create the project on the backend.
      // Otherwise, navigate to a demo progress page (pre-auth / demo flow).
      if (hiring_request_id && user) {
        const res = await api.post('/projects', {
          hiring_request_id,
          package_title:    pkg.title,
          package_price_str: pkg.price,
          // escrow_amount_paise: 0  ← wire Stripe here when ready
        });
        const projectId = res.data.project.id;
        navigate(`/progress/${projectId}`, { replace: true });
      } else {
        // Demo / unauthenticated flow — still show the progress page with state
        navigate('/progress', { state: { pkg, creator }, replace: true });
      }
    } catch (err) {
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-60px)] flex items-center justify-center bg-[#f8f9fa] font-['Space_Grotesk'] py-12 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-4xl w-full bg-white border-[3px] border-black rounded-none shadow-[16px_16px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row overflow-hidden"
      >

        {/* ── Left: Receipt ──────────────────────────────────────────── */}
        <div className="w-full md:w-3/5 bg-white p-8 md:p-12 flex flex-col">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-black tracking-tighter uppercase mb-1">
                Checkout
              </h1>
              <p className="text-sm font-bold text-zinc-400 tracking-widest uppercase">
                Invoice #{InvoiceId}
              </p>
            </div>
            <div className="bg-green-100 text-green-700 border border-green-700 px-3 py-1 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 shrink-0">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Secure
            </div>
          </div>

          {/* Creator pill */}
          <div className="flex items-center gap-4 mb-8 p-4 border-2 border-black bg-[#f8f9fa]">
            <img
              src={creator.img || creator.avatar_url || 'https://via.placeholder.com/56'}
              alt={creator.name || creator.username}
              className="w-14 h-14 object-cover border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)]"
            />
            <div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5">
                Booking Creator
              </p>
              <h3 className="font-black text-black text-lg leading-none">
                {creator.display_name || creator.name || creator.username}
              </h3>
            </div>
          </div>

          {/* Package breakdown */}
          <div className="mb-8">
            <h3 className="text-xs font-black text-black uppercase tracking-widest mb-4 border-b-2 border-black pb-2">
              Package Details
            </h3>
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-bold text-black">{pkg.title}</p>
                {pkg.subtitle && (
                  <p className="text-xs text-zinc-500 max-w-xs mt-1">{pkg.subtitle}</p>
                )}
              </div>
              <p className="font-bold text-black shrink-0 ml-4">{pkg.price}</p>
            </div>

            {pkg.features?.length > 0 && (
              <ul className="mt-4 space-y-1.5">
                {pkg.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-zinc-600 font-medium">
                    <svg className="w-3.5 h-3.5 mt-0.5 shrink-0 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Line items */}
          <div className="space-y-3 mt-auto border-t-2 border-black pt-6">
            <div className="flex justify-between text-sm font-bold text-zinc-600">
              <span>Subtotal</span>
              <span>{pkg.price}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-zinc-500">
              <span>Platform Fee (2.5%)</span>
              <span>Included</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-zinc-500">
              <span>GST (18%)</span>
              <span>Included</span>
            </div>
          </div>
        </div>

        {/* ── Right: Pay panel ──────────────────────────────────────── */}
        <div className="w-full md:w-2/5 bg-[#0540F2] p-8 md:p-12 flex flex-col justify-between text-white border-t-[3px] md:border-t-0 md:border-l-[3px] border-black">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white/70 mb-2">
              Total Due Today
            </h3>
            <p className="text-5xl font-black tracking-tighter leading-none mb-4">
              {pkg.price}
            </p>
            <div className="w-full h-[2px] bg-white/20 mb-8" />

            <ul className="space-y-4 mb-10">
              {[
                'Funds held securely in escrow',
                'Released only upon your approval',
                'Request revisions at any stage',
                'Dedicated project tracking board',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm font-bold text-white">
                  <CheckIcon /> {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            {/* TOS checkbox */}
            <label className="flex items-start gap-3 mb-5 cursor-pointer group">
              <div
                onClick={() => setAgreed((v) => !v)}
                className={`mt-0.5 w-5 h-5 border-[2px] border-white shrink-0 flex items-center justify-center transition-colors ${agreed ? 'bg-white' : 'bg-transparent'}`}
              >
                {agreed && (
                  <svg className="w-3 h-3 text-[#0540F2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="text-xs font-bold text-white/80 leading-snug group-hover:text-white transition-colors">
                I agree to the{' '}
                <a href="/terms" target="_blank" className="underline hover:text-white">
                  Terms of Service
                </a>{' '}
                and understand that payment will be held in escrow until I approve the deliverables.
              </span>
            </label>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-xs font-bold text-red-200 bg-red-900/30 border border-red-400/30 px-3 py-2 mb-4"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <button
              onClick={handlePay}
              disabled={loading || !agreed}
              className="w-full bg-white text-black font-black uppercase tracking-widest py-5 border-[3px] border-black enabled:hover:-translate-y-1 enabled:hover:-translate-x-1 transition-transform shadow-[8px_8px_0px_rgba(0,0,0,1)] mb-4 flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? <><Spinner /> Processing…</> : <>Confirm & Pay <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg></>}
            </button>

            <p className="text-center text-[10px] font-bold text-white/50 uppercase tracking-widest">
              256-bit SSL encrypted · Powered by Driplens Escrow
            </p>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
