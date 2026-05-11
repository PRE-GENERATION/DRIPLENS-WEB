import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import './agency.css';

export default function VerifyPhonePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState('input'); // 'input', 'otp'
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (timer > 0) {
      const t = setInterval(() => setTimer(prev => prev - 1), 1000);
      return () => clearInterval(t);
    }
  }, [timer]);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!phone.trim()) { setError('Phone number is required'); return; }
    setError('');
    setLoading(true);
    try {
      // Mock sending OTP
      console.log('Sending OTP to', phone);
      await new Promise(r => setTimeout(r, 1000));
      setStep('otp');
      setTimer(60);
    } catch (err) {
      setError('Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) { setError('Enter 6-digit code'); return; }
    
    // Enforce default OTP for testing
    if (code !== '000000') {
      setError('Invalid code. Use 000000 for testing.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      // Mock verification
      console.log('Verifying OTP', code);
      await new Promise(r => setTimeout(r, 1000));
      // Success -> Go to legal verification
      navigate('/auth/legal-verification');
    } catch (err) {
      setError('Invalid code');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  return (
    <div className="agency-auth-page">
      <Helmet>
        <title>Verify Phone — Driplens</title>
      </Helmet>

      <div className="auth-left">
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 900, fontSize: '1.2rem', zIndex: 10 }}>DRIPLENS</Link>
        <div>
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h1 style={{ color: 'white' }}>SECURE YOUR</h1>
            <h1 className="outline-text" style={{ WebkitTextStroke: '2px white' }}>ACCOUNT</h1>
          </motion.div>
        </div>
        <div style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '2px', zIndex: 10 }}>
          THE PROFESSIONAL MERITOCRACY
        </div>
      </div>

      <div className="auth-right">
        <motion.div 
          className="auth-form-wrapper"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="auth-header-minimal">
            <h2>{step === 'input' ? 'Verify Phone' : 'Enter Code'}</h2>
            <p>
              {step === 'input' 
                ? 'Please provide your phone number for security.' 
                : `We've sent a 6-digit code to ${phone}. For testing, use 000000.`}
            </p>
          </div>

          {error && <div style={{ color: '#ff4444', fontWeight: 600, margin: '1rem 0', fontSize: '0.85rem' }}>{error}</div>}

          {step === 'input' ? (
            <form onSubmit={handleSendOTP}>
              <div className="agency-form-group">
                <label>Phone Number</label>
                <div className="phone-input-wrapper">
                  <div className="country-selector">
                    <img src="https://flagcdn.com/w20/us.png" alt="US" width="20" />
                    <span>+1</span>
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <input 
                    name="phone" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    className="agency-input phone-input" 
                    placeholder="Phone Number" 
                  />
                </div>
              </div>
              <button className="agency-btn-submit-blue" disabled={loading} type="submit">
                {loading ? 'SENDING...' : 'SEND OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP}>
              <div className="agency-form-group">
                <label>6-Digit Code</label>
                <div className="otp-input-container">
                  {otp.map((digit, i) => (
                    <input 
                      key={i} 
                      id={`otp-${i}`} 
                      type="text" 
                      maxLength="1" 
                      value={digit} 
                      onChange={(e) => handleOtpChange(i, e.target.value)} 
                      className="otp-box" 
                    />
                  ))}
                </div>
                <div className="otp-timer">
                  {timer > 0 ? `Resend in ${timer}s` : (
                    <button type="button" className="resend-btn" onClick={handleSendOTP}>RESEND OTP</button>
                  )}
                </div>
              </div>
              <button className="agency-btn-submit-blue" disabled={loading} type="submit">
                {loading ? 'VERIFYING...' : 'CONTINUE'}
              </button>
              <button 
                type="button" 
                onClick={() => setStep('input')} 
                style={{ width: '100%', marginTop: '1rem', background: 'none', border: 'none', color: '#999', fontSize: '0.85rem', cursor: 'pointer' }}
              >
                Change Phone Number
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
