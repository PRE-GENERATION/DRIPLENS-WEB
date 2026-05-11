import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import './agency.css';

export default function LegalVerificationPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (!file) { setError('Please upload a legal proof document'); return; }
    
    setLoading(true);
    try {
      // Mock upload
      if (file) {
        console.log('Uploading legal proof:', file.name);
      } else {
        console.log('Proceeding without legal proof');
      }
      await new Promise(r => setTimeout(r, 1500));
      // Success -> Go to onboarding
      navigate('/onboarding/step-1');
    } catch (err) {
      setError('Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="agency-auth-page">
      <Helmet>
        <title>Legal Verification — Driplens</title>
      </Helmet>

      <div className="auth-left">
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 900, fontSize: '1.2rem', zIndex: 10 }}>DRIPLENS</Link>
        <div>
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h1 style={{ color: 'white' }}>IDENTITY</h1>
            <h1 className="outline-text" style={{ WebkitTextStroke: '2px white' }}>VERIFIED</h1>
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
            <h2>Legal Proof</h2>
            <p>To maintain platform integrity, please upload a copy of your Aadhaar card or government ID.</p>
          </div>

          {error && <div style={{ color: '#ff4444', fontWeight: 600, margin: '1rem 0', fontSize: '0.85rem' }}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div 
              className="agency-form-group"
              onClick={() => fileInputRef.current.click()}
              style={{
                border: '2px dashed #eee',
                borderRadius: '12px',
                padding: '3rem 1rem',
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: '#fcfcfc',
                transition: 'all 0.2s ease',
                marginBottom: '2rem'
              }}
              onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = '#001a72'; }}
              onDragLeave={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = '#eee'; }}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.style.borderColor = '#eee';
                if (e.dataTransfer.files[0]) handleFileChange({ target: { files: e.dataTransfer.files } });
              }}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                style={{ display: 'none' }} 
                accept=".jpg,.jpeg,.png,.pdf"
              />
              
              {!file ? (
                <>
                  <div style={{ fontSize: '2rem', marginBottom: '1rem' }}></div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#111' }}>Click to upload or drag & drop</div>
                  <div style={{ fontSize: '0.8rem', color: '#999', marginTop: '0.5rem' }}>Aadhaar Card, PAN Card, or Passport (Max 5MB)</div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: '2rem', marginBottom: '1rem' }}></div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#001a72' }}>{file.name}</div>
                  <div style={{ fontSize: '0.8rem', color: '#999', marginTop: '0.5rem' }}>File selected. Click to change.</div>
                </>
              )}
            </div>

            <button className="agency-btn-submit-blue" disabled={loading} type="submit">
              {loading ? 'UPLOADING...' : 'CONTINUE'}
            </button>
            
            <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#999', marginTop: '1.5rem' }}>
              Your document is encrypted and stored securely. We only use it for identity verification.
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
