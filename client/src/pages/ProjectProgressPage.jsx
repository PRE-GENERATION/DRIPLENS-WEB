import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, LayoutDashboard, ArrowRight } from 'lucide-react';

export default function ProjectProgressPage() {
  const location = useLocation();
  const [revisionRequested, setRevisionRequested] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [approved, setApproved] = useState(false);

  // Mock data for project details
  const { pkg, creator } = location.state || {
    creator: { 
      name: 'Atharv Gadekar', 
      img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500',
      category: 'Event Coverage'
    },
    pkg: { title: 'Cinematography Package' }
  };

  const steps = [
    {
      id: 1,
      title: 'Pre-Production',
      description: 'Brief confirmed, moodboard approved. Concept locked in.',
      status: 'COMPLETED',
    },
    {
      id: 2,
      title: 'Shooting & Production',
      description: 'Currently on location capturing main footage. Lighting setup complete.',
      status: 'IN PROGRESS',
      progress: 60,
    },
    {
      id: 3,
      title: 'Post-Production',
      description: 'Color grading and VFX pending completion of shoot.',
      status: 'UPCOMING',
    },
    {
      id: 4,
      title: 'Final Delivery',
      description: 'Final export and high-resolution asset delivery.',
      status: 'UPCOMING',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-inter text-[#020617] py-12 px-4 md:px-8 flex justify-center">
      <div className="max-w-4xl w-full">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div className="flex items-center gap-5">
            {/* Project Avatar / Placeholder */}
            <div className="w-16 h-16 bg-[#0033CC]/10 flex items-center justify-center rounded-none border border-[#0033CC]/20 shrink-0">
              <img 
                src={creator.img} 
                alt={creator.name} 
                className="w-full h-full object-cover rounded-none shadow-sm"
              />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-xl font-bold tracking-tight">{creator.name}</h1>
                <span className="bg-[#0033CC] text-white text-[9px] font-extrabold uppercase tracking-widest px-2 py-1 rounded-none shadow-sm">
                  Active Project
                </span>
              </div>
              <p className="text-[#555555] font-medium text-xs">{creator.category || 'Event Coverage'}</p>
            </div>
          </div>
          
          <Link 
            to="/dashboard" 
            className="flex items-center gap-2 text-xs font-semibold text-[#020617] border border-[#E2E8F0] px-4 py-2 rounded-none bg-white hover:bg-[#F8F9FA] hover:border-[#CBD5E1] transition-all duration-200 shadow-sm group"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-[#555555] group-hover:text-[#0033CC] transition-colors" />
            Go to Dashboard
          </Link>
        </div>

        {/* Timeline Content */}
        <div className="relative">
          {/* Central Vertical Line */}
          <div className="absolute left-6 md:left-8 top-0 bottom-0 w-[2px] bg-[#C4C4C4] -z-0"></div>

          <div className="space-y-12 relative z-10">
            {steps.map((step, index) => {
              const isCompleted = step.status === 'COMPLETED';
              const isInProgress = step.status === 'IN PROGRESS';
              const isUpcoming = step.status === 'UPCOMING';

              return (
                <div key={step.id} className="flex gap-8 md:gap-12 group">
                  {/* Step Marker */}
                  <div className="relative flex flex-col items-center">
                    <div className={`
                      w-12 h-12 rounded-full flex items-center justify-center shrink-0 z-20 transition-all duration-300
                      ${isCompleted ? 'bg-[#0033CC] text-white shadow-lg' : ''}
                      ${isInProgress ? 'bg-[#0033CC] text-white ring-4 ring-[#0033CC]/20 shadow-xl scale-110' : ''}
                      ${isUpcoming ? 'bg-white border-2 border-[#C4C4C4] text-[#C4C4C4]' : ''}
                    `}>
                      {isCompleted ? (
                        <Check className="w-6 h-6 stroke-[3px]" />
                      ) : (
                        <span className={`font-bold text-base ${isUpcoming ? 'text-[#C4C4C4]' : 'text-white'}`}>{step.id}</span>
                      )}
                    </div>
                  </div>

                  {/* Step Card */}
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className={`
                      flex-1 p-6 md:p-8 rounded-none transition-all duration-300 border
                      ${isCompleted ? 'bg-[#F0F0F0] border-transparent' : ''}
                      ${isInProgress ? 'bg-[#0033CC] text-white border-[#0033CC] shadow-2xl shadow-blue-900/20' : ''}
                      ${isUpcoming ? 'bg-white border-[#E2E8F0] opacity-60' : ''}
                    `}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className={`text-base md:text-lg font-bold uppercase tracking-wide ${isInProgress ? 'text-white' : 'text-[#020617]'}`}>
                        {step.title}
                      </h3>
                      <span className={`
                        text-[9px] font-black uppercase tracking-[0.15em] px-2 py-0.5 rounded-none
                        ${isCompleted ? 'bg-white/50 text-[#555555]' : ''}
                        ${isInProgress ? 'bg-white text-[#0033CC]' : ''}
                        ${isUpcoming ? 'bg-[#F1F5F9] text-[#94A3B8]' : ''}
                      `}>
                        {step.status}
                      </span>
                    </div>
                    
                    <p className={`
                      text-xs md:text-sm leading-relaxed mb-6 font-medium
                      ${isInProgress ? 'text-white/80' : 'text-[#555555]'}
                    `}>
                      {step.description}
                    </p>

                    {/* Progress Bar for Active Step */}
                    {isInProgress && (
                      <div className="relative">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[9px] font-bold uppercase tracking-widest text-white/60">Phase Progress</span>
                          <span className="text-xs font-black bg-white text-[#0033CC] px-2 py-0.5 rounded-none shadow-sm">
                            {step.progress}%
                          </span>
                        </div>
                        <div className="h-2 w-full bg-white/20 rounded-none overflow-hidden border border-white/10">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${step.progress}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                          />
                        </div>
                      </div>
                    )}

                    {/* Interactive Section for Final Step */}
                    {step.id === 4 && (
                      <div className="mt-6 pt-6 border-t border-[#E2E8F0]">
                        {!submitted ? (
                          <button
                            onClick={() => setSubmitted(true)}
                            className="w-full md:w-auto bg-[#020617] text-white font-bold uppercase tracking-widest px-6 py-3 text-xs rounded-none hover:bg-[#1e293b] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3"
                          >
                            Submit Project
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        ) : (
                          <div className="space-y-4">
                            {approved ? (
                              <div className="bg-[#DCFCE7] border border-[#BBF7D0] p-4 rounded-none flex items-start gap-3">
                                <div className="w-8 h-8 bg-green-500 rounded-none flex items-center justify-center shrink-0">
                                  <Check className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                  <p className="text-green-800 font-bold uppercase text-[9px] tracking-wider mb-1">Project Approved</p>
                                  <p className="text-green-700 text-xs">Payment has been released. Project successfully completed!</p>
                                </div>
                              </div>
                            ) : revisionRequested ? (
                              <div className="bg-[#FEF9C3] border border-[#FEF08A] p-4 rounded-none space-y-4">
                                <div className="flex items-start gap-3">
                                  <div className="w-8 h-8 bg-yellow-500 rounded-none flex items-center justify-center shrink-0">
                                    <span className="text-white font-bold text-lg">!</span>
                                  </div>
                                  <div>
                                    <p className="text-yellow-800 font-bold uppercase text-[9px] tracking-wider mb-1">Revision Requested</p>
                                    <p className="text-yellow-700 text-xs">The brand has requested some adjustments. Please review the notes and resubmit.</p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => { setRevisionRequested(false); setSubmitted(false); }}
                                  className="w-full bg-[#0033CC] text-white font-bold uppercase text-[9px] tracking-widest py-2.5 rounded-none hover:bg-[#0029A3] transition-colors"
                                >
                                  Resubmit After Changes
                                </button>
                              </div>
                            ) : (
                              <div className="bg-[#F8F9FA] border border-[#E2E8F0] p-6 rounded-none">
                                <p className="text-[#555555] font-semibold text-xs mb-4 flex items-center gap-2">
                                  <span className="w-2 h-2 bg-[#0033CC] rounded-full animate-pulse" />
                                  Awaiting brand approval...
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3">
                                  <button
                                    onClick={() => setApproved(true)}
                                    className="flex-1 bg-green-600 text-white font-bold uppercase text-[9px] tracking-widest py-2.5 rounded-none hover:bg-green-700 transition-colors shadow-sm"
                                  >
                                    Approve & Release (Brand View)
                                  </button>
                                  <button
                                    onClick={() => setRevisionRequested(true)}
                                    className="flex-1 bg-white border border-[#E2E8F0] text-[#555555] font-bold uppercase text-[9px] tracking-widest py-2.5 rounded-none hover:bg-[#F8F9FA] transition-colors"
                                  >
                                    Request Revision
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
