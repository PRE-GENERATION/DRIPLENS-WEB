import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, User, Briefcase, Instagram, Globe, Phone, Mail, Lock, Building } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './agency.css';

// ───────────────────────────────────────────────────────────────────────────
// Sub-components (Moved outside to prevent focus loss on re-render)
// ───────────────────────────────────────────────────────────────────────────

const RoleSelector = ({ onRoleSelect, mode, setMode }) => (
  <div className="flex flex-col w-full max-w-2xl gap-4 p-4">
    <h2 className="text-3xl font-black mb-8 tracking-tight">I AM A...</h2>
    
    {/* Brand Option */}
    <motion.button
      whileHover={{ x: 10 }}
      onClick={() => onRoleSelect('brand')}
      className="group relative flex items-center justify-between w-full p-8 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors duration-300 text-left"
    >
      <div className="flex items-center gap-6">
        <div className="p-4 border-2 border-current">
          <Briefcase size={32} />
        </div>
        <div>
          <h3 className="text-2xl font-bold uppercase tracking-wider">Client (Brand)</h3>
          <p className="text-sm opacity-70">I want to hire creators for my campaigns</p>
        </div>
      </div>
      <ArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity" size={24} />
    </motion.button>

    {/* Creator Option */}
    <motion.button
      whileHover={{ x: 10 }}
      onClick={() => onRoleSelect('creator')}
      className="group relative flex items-center justify-between w-full p-8 border-2 border-black bg-white hover:bg-[#0044ff] hover:text-white transition-colors duration-300 text-left"
    >
      <div className="flex items-center gap-6">
        <div className="p-4 border-2 border-current">
          <User size={32} />
        </div>
        <div>
          <h3 className="text-2xl font-bold uppercase tracking-wider">I'M A CREATOR</h3>
          <p className="text-sm opacity-70">I want to collaborate with brands</p>
        </div>
      </div>
      <ArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity" size={24} />
    </motion.button>

    <div className="mt-8 text-center">
      <button 
        onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
        className="text-sm font-bold underline underline-offset-4 hover:text-[#0044ff]"
      >
        {mode === 'login' ? "DON'T HAVE AN ACCOUNT? REGISTER" : "ALREADY HAVE AN ACCOUNT? LOGIN"}
      </button>
    </div>
  </div>
);

const AuthForm = ({ mode, selectedRole, formData, handleChange, handleSubmit, errors, apiError, loading, setSelectedRole }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="w-full max-w-md p-4"
  >
    <button 
      onClick={() => {
        setSelectedRole(null);
        const newParams = new URLSearchParams(window.location.search);
        newParams.delete('role');
        window.history.replaceState(null, '', `${window.location.pathname}?${newParams.toString()}`);
      }}
      className="mb-8 text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:text-[#0044ff]"
    >
      ← BACK TO ROLE SELECT
    </button>

    <h2 className="text-3xl font-black mb-2 tracking-tight uppercase">
      {mode === 'login' ? 'Welcome Back' : `Join as ${selectedRole}`}
    </h2>
    <p className="text-sm text-gray-500 mb-8 font-medium">
      {mode === 'login' ? 'Sign in to your account' : 'Create your professional profile'}
    </p>

    {apiError && <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-bold mb-6">{apiError}</div>}

    <form onSubmit={handleSubmit} className="space-y-4">
      {mode === 'register' && selectedRole === 'brand' && (
        <>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Brand Name</label>
            <div className="relative">
              <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                name="brandName"
                value={formData.brandName}
                onChange={handleChange}
                placeholder="e.g. Acme Corp"
                className="w-full p-4 pl-12 border-2 border-black focus:border-[#0044ff] outline-none font-bold placeholder:font-normal"
              />
            </div>
            {errors.brandName && <span className="text-[10px] text-red-500 font-bold">{errors.brandName}</span>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Instagram</label>
              <div className="relative">
                <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  name="instagramHandle"
                  value={formData.instagramHandle}
                  onChange={handleChange}
                  placeholder="@handle"
                  className="w-full p-4 pl-12 border-2 border-black focus:border-[#0044ff] outline-none font-bold"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Website</label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full p-4 pl-12 border-2 border-black focus:border-[#0044ff] outline-none font-bold"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Contact Person</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full p-4 pl-12 border-2 border-black focus:border-[#0044ff] outline-none font-bold"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="+91 ..."
                className="w-full p-4 pl-12 border-2 border-black focus:border-[#0044ff] outline-none font-bold"
              />
            </div>
          </div>
        </>
      )}

      <div className="space-y-1">
        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email Address</label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className="w-full p-4 pl-12 border-2 border-black focus:border-[#0044ff] outline-none font-bold"
          />
        </div>
        {errors.email && <span className="text-[10px] text-red-500 font-bold">{errors.email}</span>}
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Password</label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full p-4 pl-12 border-2 border-black focus:border-[#0044ff] outline-none font-bold"
          />
        </div>
        {errors.password && <span className="text-[10px] text-red-500 font-bold">{errors.password}</span>}
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full p-5 bg-black text-white font-black uppercase tracking-widest border-2 border-black hover:bg-[#0044ff] hover:border-[#0044ff] transition-all disabled:opacity-50"
      >
        {loading ? 'Processing...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
      </button>

      {mode === 'register' && selectedRole === 'creator' && (
        <div className="pt-4 space-y-4">
          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-4 text-[10px] font-bold text-gray-400 uppercase">Or continue with</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button type="button" className="p-4 border-2 border-black font-bold text-xs uppercase hover:bg-gray-50">Google</button>
            <button type="button" className="p-4 border-2 border-black font-bold text-xs uppercase hover:bg-gray-50">Instagram</button>
          </div>
        </div>
      )}
    </form>
  </motion.div>
);

export default function AuthPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, isLoggedIn, user } = useAuth();

  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login';
  const initialRole = searchParams.get('role'); // 'creator' or 'brand'
  const [mode, setMode] = useState(initialMode);
  const [selectedRole, setSelectedRole] = useState(initialRole); 
  
  const [formData, setFormData] = useState({
    // Shared
    email: '',
    password: '',
    // Brand specific
    brandName: '',
    instagramHandle: '',
    website: '',
    contactName: '',
    phoneNumber: '',
    // Creator specific
    username: '', // for fallback
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn && user) {
      if (user.role === 'creator' && !user.onboarding_complete) {
        navigate('/onboarding/step-1', { replace: true });
      } else {
        const dashboardPath = user.role === 'creator' ? '/dashboard' : `/dashboard/${user.role}`;
        const from = location.state?.from?.pathname || dashboardPath;
        navigate(from, { replace: true });
      }
    }
  }, [isLoggedIn, user, navigate, location.state]);

  const handleChange = (e) => {
    setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(p => ({ ...p, [e.target.name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!formData.email.trim()) e.email = 'Required';
    if (formData.password.length < 8) e.password = 'Min 8 characters';
    
    if (mode === 'register') {
      if (selectedRole === 'brand') {
        // Brand fields are now optional as requested
      } else {
        // Creator basic validation
      }
    }
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) { setErrors(validationErrors); return; }

    setLoading(true);
    try {
      if (mode === 'register') {
        let userData;
        if (selectedRole === 'brand') {
          const derivedUsername = formData.brandName
            .toLowerCase()
            .replace(/[^a-z0-9_.]/g, '_')
            .slice(0, 30);
          
          userData = await register(derivedUsername, formData.email, formData.password, 'brand', {
            brand_name:       formData.brandName,
            instagram_handle: formData.instagramHandle,
            website:          formData.website,
            contact_person:   formData.contactName,
            phone_number:     formData.phoneNumber,
          });
        } else {
          const derivedUsername = formData.email.split('@')[0];
          userData = await register(derivedUsername, formData.email, formData.password, 'creator');
        }

        // Redirect after register
        if (userData.role === 'creator') {
          navigate('/onboarding/step-1', { replace: true });
        } else {
          navigate('/dashboard/brand', { replace: true });
        }
      } else {
        const userData = await login(formData.email, formData.password);
        
        // Redirect after login
        if (userData.role === 'creator' && !userData.onboarding_complete) {
          navigate('/onboarding/step-1', { replace: true });
        } else {
          const dashboardPath = userData.role === 'creator' ? '/dashboard' : `/dashboard/${userData.role}`;
          navigate(dashboardPath, { replace: true });
        }
      }
    } catch (err) {
      setApiError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('role', role);
    setSearchParams(newParams);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      <Helmet>
        <title>{mode === 'register' ? 'Join' : 'Sign In'} — Driplens</title>
      </Helmet>

      {/* Hero Section */}
      <div className="md:w-[40%] bg-black text-white p-8 md:p-16 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        <Link to="/" className="text-2xl font-black tracking-tighter relative z-10 text-white">DRIPLENS</Link>
        
        <div className="relative z-10">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl font-black leading-none mb-4 text-white">
              THE<br />
              <span className="text-transparent" style={{ WebkitTextStroke: '2px white' }}>ELITE</span><br />
              CLUB
            </h1>
            <p className="text-xs uppercase tracking-[0.3em] font-bold opacity-60 text-white">Professional Creator Network</p>
          </motion.div>
        </div>

        <div className="text-[10px] font-bold uppercase tracking-widest opacity-40 relative z-10">
          © 2026 DRIPLENS TECHNOLOGY PVT LTD
        </div>
      </div>

      {/* Interaction Area */}
      <div className="flex-1 flex items-center justify-center bg-white">
        <AnimatePresence mode="wait">
          {!selectedRole ? (
            <motion.div
              key="selector"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full flex justify-center"
            >
              <RoleSelector onRoleSelect={handleRoleSelect} mode={mode} setMode={setMode} />
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full flex justify-center"
            >
              <AuthForm 
                mode={mode}
                selectedRole={selectedRole}
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                errors={errors}
                apiError={apiError}
                loading={loading}
                setSelectedRole={setSelectedRole}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
