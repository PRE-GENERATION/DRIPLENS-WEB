import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function ProjectProgressPage() {
  const location = useLocation();
  const [revisionRequested, setRevisionRequested] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [approved, setApproved] = useState(false);
  const { pkg, creator } = location.state || {
    creator: { name: 'Atharv Gadekar', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500' },
    pkg: { title: 'Cinematography Package' }
  };

  return (
    <div className="min-h-[calc(100vh-60px)] bg-[#f8f9fa] font-['Space_Grotesk'] text-black py-12 px-4 md:px-8 flex justify-center">
      <div className="max-w-4xl w-full">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-[3px] border-black shadow-[16px_16px_0px_rgba(0,0,0,1)] rounded-none p-8 md:p-12 relative"
        >
          <Link to="/explore" className="absolute top-8 right-8 text-[10px] font-bold uppercase tracking-widest text-black border-2 border-black px-4 py-2 hover:bg-black hover:text-white transition-colors shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            Go to Dashboard
          </Link>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-16 mt-8 md:mt-0">
            <img src={creator.img} alt={creator.name} className="w-24 h-24 rounded-full object-cover border-[3px] border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] shrink-0" />
            <div>
              <div className="inline-block bg-[#0540F2] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 mb-3 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                Active Project
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-black leading-none tracking-tighter mb-2 uppercase">{creator.name}</h1>
              <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs border-b-2 border-black pb-2 inline-block">{pkg.title}</p>
            </div>
          </div>

          {/* Timeline Wrapper */}
          <div className="relative pl-6 md:pl-10">
            {/* The Vertical Line */}
            <div className="absolute top-4 bottom-4 left-[2.25rem] md:left-[3.25rem] w-1 bg-black z-0"></div>

            {/* Step 1: Complete */}
            <div className="relative flex items-start gap-8 mb-12 group z-10">
              <div className="flex items-center justify-center w-12 h-12 rounded-full border-[3px] border-black bg-black text-white shrink-0 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>
              </div>
              <div className="flex-1 p-6 border-[3px] border-black bg-zinc-100 shadow-[6px_6px_0px_rgba(0,0,0,1)]">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-black text-xl md:text-2xl uppercase">Pre-Production</h3>
                  <span className="bg-black text-white text-[9px] uppercase font-bold tracking-widest px-2 py-1">Completed</span>
                </div>
                <p className="text-sm font-bold text-zinc-600">Brief confirmed, moodboard approved. Concept locked in.</p>
              </div>
            </div>

            {/* Step 2: In Progress */}
            <div className="relative flex items-start gap-8 mb-12 group z-10">
              <div className="flex items-center justify-center w-12 h-12 rounded-full border-[3px] border-black bg-[#0540F2] shrink-0 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse border-2 border-black"></div>
              </div>
              <div className="flex-1 p-6 border-[3px] border-black bg-[#0540F2] text-white shadow-[8px_8px_0px_rgba(0,0,0,1)] -rotate-1 hover:rotate-0 transition-transform">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-black text-xl md:text-2xl uppercase">Shooting & Production</h3>
                  <span className="bg-white text-black border-2 border-black text-[9px] uppercase font-bold tracking-widest px-2 py-1 shadow-[2px_2px_0px_rgba(0,0,0,1)]">In Progress</span>
                </div>
                
                <div className="w-full bg-black/30 border-2 border-black h-4 mb-4 relative overflow-hidden">
                  <div className="absolute top-0 left-0 h-full bg-white w-[60%] border-r-2 border-black"></div>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm font-bold text-white/90 max-w-[80%]">Currently on location capturing main footage. Lighting setup complete.</p>
                  <p className="text-xl font-black">60%</p>
                </div>
              </div>
            </div>

            {/* Step 3: Pending */}
            <div className="relative flex items-start gap-8 mb-12 group z-10">
              <div className="flex items-center justify-center w-12 h-12 rounded-full border-[3px] border-zinc-300 border-dashed bg-white shrink-0">
                <span className="text-zinc-300 font-black">3</span>
              </div>
              <div className="flex-1 p-6 border-[3px] border-zinc-300 border-dashed bg-zinc-50">
                <h3 className="font-black text-xl md:text-2xl uppercase text-zinc-400 mb-2">Post-Production</h3>
                <p className="text-sm font-bold text-zinc-400">Color grading and VFX pending completion of shoot.</p>
              </div>
            </div>

            {/* Step 4: Interactive Final Delivery */}
            <div className="relative flex items-start gap-8 group z-10 mt-12">
              <div className={`flex items-center justify-center w-12 h-12 rounded-full border-[3px] border-black shrink-0 ${submitted ? 'bg-black text-white' : 'bg-white'}`}>
                {submitted ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>
                ) : <span className="font-black text-zinc-400">4</span>}
              </div>
              <div className="flex-1 p-6 border-[3px] border-black bg-white shadow-[6px_6px_0px_rgba(0,0,0,1)]">
                <h3 className="font-black text-xl uppercase mb-2">Final Delivery</h3>

                {/* Creator submits */}
                {!submitted && (
                  <button
                    onClick={() => setSubmitted(true)}
                    className="mt-2 bg-black text-white font-black uppercase tracking-widest px-6 py-3 border-2 border-black hover:-translate-y-0.5 transition-transform shadow-[4px_4px_0px_rgba(0,0,0,0.3)]"
                  >
                    Submit Project →
                  </button>
                )}

                {/* Brand reviews */}
                {submitted && !approved && !revisionRequested && (
                  <div className="space-y-3 mt-2">
                    <p className="text-sm font-bold text-zinc-600">Project submitted. Awaiting brand approval.</p>
                    <div className="flex gap-3 flex-wrap">
                      <button
                        onClick={() => setApproved(true)}
                        className="bg-green-500 text-white font-black uppercase tracking-widest px-5 py-2 border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform"
                      >
                        Approve & Release Payment
                      </button>
                      <button
                        onClick={() => setRevisionRequested(true)}
                        className="bg-yellow-400 text-black font-black uppercase tracking-widest px-5 py-2 border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform"
                      >
                        Request Revision
                      </button>
                    </div>
                  </div>
                )}

                {/* Revision requested */}
                {revisionRequested && !approved && (
                  <div className="mt-2 p-4 bg-yellow-50 border-2 border-yellow-400">
                    <p className="text-sm font-black text-yellow-700 uppercase">Revision Requested</p>
                    <p className="text-xs text-zinc-600 mt-1">Brand has requested changes. Creator will update and resubmit.</p>
                    <button
                      onClick={() => { setRevisionRequested(false); setSubmitted(false); }}
                      className="mt-3 bg-[#0540F2] text-white font-black uppercase text-xs px-4 py-2 border-2 border-black"
                    >
                      Resubmit After Changes
                    </button>
                  </div>
                )}

                {/* Approved — payment released */}
                {approved && (
                  <div className="mt-2 p-4 bg-green-50 border-2 border-green-500">
                    <p className="text-sm font-black text-green-700 uppercase">✅ Approved! Payment Released.</p>
                    <p className="text-xs text-zinc-600 mt-1">Funds have been released to the creator. Project complete!</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
}
