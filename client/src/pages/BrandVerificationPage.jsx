import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Check, Shield, FileText, Globe, Smartphone, ArrowRight, Upload } from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

// ─────────────────────────────────────────────────────────────────────────────
// Helper Components (Outside main component to prevent focus loss)
// ─────────────────────────────────────────────────────────────────────────────

const BuildingIcon = () => <Shield size={18} />;

const StepIndicator = ({ step, steps }) => (
  <div className="relative mb-20 flex justify-between items-center">
    <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gray-100 -translate-y-1/2 z-0" />
    {steps.map((s) => (
      <div key={s.id} className="relative z-10 flex flex-col items-center">
        <div 
          className={`w-10 h-10 flex items-center justify-center border-2 transition-all duration-500 ${
            step >= s.id ? 'bg-black border-black text-white' : 'bg-white border-gray-200 text-gray-300'
          }`}
          style={{ borderRadius: '2px' }}
        >
          {step > s.id ? <Check size={18} /> : <s.icon size={18} />}
        </div>
        <span className={`mt-2 text-[10px] font-black uppercase tracking-widest ${step >= s.id ? 'text-black' : 'text-gray-300'}`}>
          {s.title}
        </span>
      </div>
    ))}
  </div>
);

export default function BrandVerificationPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  // Redirect if already verified
  useEffect(() => {
    if (user?.is_verified) {
      navigate('/dashboard/brand', { replace: true });
    }
  }, [user, navigate]);

  const [formData, setFormData] = useState({
    otp: '',
    gstNumber: '',
    companyProof: null,
    socialLink: ''
  });

  const nextStep = () => setStep(p => p + 1);
  const prevStep = () => setStep(p => p - 1);

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      setFormData(p => ({ ...p, companyProof: e.target.files[0] }));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      // 1. Upload file if exists
      let proofUrl = '';
      if (formData.companyProof) {
        const uploadData = new FormData();
        uploadData.append('media', formData.companyProof);
        uploadData.append('title', 'Company Proof');
        uploadData.append('category', 'Design'); // Required by upload schema
        const uploadRes = await api.post('/upload/portfolio', uploadData); 
        proofUrl = uploadRes.data.url;
      }

      // 2. Update profile verification status
      const updatedProfile = await api.patch(`/creators/profile`, { 
        is_verified: true,
        gst_number: formData.gstNumber || undefined,
        company_proof_url: proofUrl || undefined,
        website: formData.socialLink || undefined
      });

      // Update local state
      updateUser({ is_verified: true });

      // Redirect to dashboard
      navigate('/dashboard/brand');
    } catch (err) {
      setError(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 1, title: 'Identity', icon: Smartphone },
    { id: 2, title: 'Business', icon: BuildingIcon }, 
    { id: 3, title: 'Proof', icon: FileText },
    { id: 4, title: 'Social (Opt)', icon: Globe }
  ];

  return (
    <div className="min-h-screen bg-white py-20 px-4">
      <Helmet>
        <title>Brand Verification — Driplens</title>
      </Helmet>

      <div className="max-w-xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">Brand Verification</h1>
          <p className="text-sm text-gray-500 font-medium uppercase tracking-widest">Complete these steps to earn your badge</p>
        </div>

        <StepIndicator step={step} steps={steps} />

        {/* Form Area */}
        <div className="min-h-[300px]">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">OTP Verification</label>
                  <p className="text-sm text-gray-600 mb-4">Enter the 6-digit code sent to your registered email/phone.</p>
                  <input 
                    type="text" 
                    maxLength={6}
                    placeholder="000000"
                    value={formData.otp}
                    onChange={(e) => setFormData(p => ({ ...p, otp: e.target.value }))}
                    className="w-full p-5 border-2 border-black font-black text-2xl tracking-[1em] text-center outline-none focus:border-[#0044ff]"
                  />
                </div>
                <button 
                  onClick={nextStep}
                  disabled={formData.otp.length < 6}
                  className="w-full p-5 bg-black text-white font-black uppercase tracking-widest border-2 border-black hover:bg-[#0044ff] hover:border-[#0044ff] transition-all disabled:opacity-50"
                >
                  Verify & Continue
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">GST Number (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="22AAAAA0000A1Z5"
                    value={formData.gstNumber}
                    onChange={(e) => setFormData(p => ({ ...p, gstNumber: e.target.value }))}
                    className="w-full p-5 border-2 border-black font-bold outline-none focus:border-[#0044ff]"
                  />
                </div>
                <button 
                  onClick={nextStep}
                  className="w-full p-5 bg-black text-white font-black uppercase tracking-widest border-2 border-black hover:bg-[#0044ff] hover:border-[#0044ff] transition-all"
                >
                  Next Step
                </button>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Company Proof</label>
                  <p className="text-sm text-gray-600 mb-4">Upload COI, PAN, or any legal document confirming your business.</p>
                  
                  <label className="block w-full border-2 border-dashed border-gray-200 p-12 text-center cursor-pointer hover:border-black transition-colors">
                    <input type="file" className="hidden" onChange={handleFileChange} />
                    {formData.companyProof ? (
                      <div className="flex items-center justify-center gap-2">
                        <FileText className="text-[#0044ff]" />
                        <span className="font-bold">{formData.companyProof.name}</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="text-gray-300" size={32} />
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Click to upload document</span>
                      </div>
                    )}
                  </label>
                </div>
                <div className="flex gap-4">
                  <button onClick={prevStep} className="flex-1 p-5 border-2 border-black font-black uppercase tracking-widest hover:bg-gray-50 transition-all">Back</button>
                  <button onClick={nextStep} className="flex-1 p-5 bg-black text-white font-black uppercase tracking-widest border-2 border-black hover:bg-[#0044ff] hover:border-[#0044ff] transition-all">Continue</button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Social Verification (Optional)</label>
                  <p className="text-sm text-gray-600 mb-4">Paste your official Instagram or Website link.</p>
                  <div className="relative">
                    <Globe className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="url" 
                      placeholder="https://instagram.com/yourbrand"
                      value={formData.socialLink}
                      onChange={(e) => setFormData(p => ({ ...p, socialLink: e.target.value }))}
                      className="w-full p-5 pl-14 border-2 border-black font-bold outline-none focus:border-[#0044ff]"
                    />
                  </div>
                </div>

                {error && <div className="text-red-500 text-xs font-bold uppercase tracking-widest">{error}</div>}

                <div className="flex gap-4">
                  <button 
                    onClick={prevStep} 
                    disabled={loading}
                    className="flex-1 p-5 border-2 border-black font-black uppercase tracking-widest hover:bg-gray-50 transition-all disabled:opacity-50"
                  >
                    Back
                  </button>
                  <button 
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 p-5 bg-[#0044ff] text-white font-black uppercase tracking-widest border-2 border-[#0044ff] hover:bg-black hover:border-black transition-all shadow-xl shadow-blue-500/20 disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : (formData.socialLink ? 'Complete Verification' : 'Skip & Complete')}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
