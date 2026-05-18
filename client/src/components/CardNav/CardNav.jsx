import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import './CardNav.css';

const CardNav = ({
  logo,
  logoAlt = 'Logo',
  onLogoClick,
  items,
  className = '',
  baseColor = '#fff',
  menuColor,
  buttonBgColor,
  buttonTextColor,
  ctaLabel = 'Get Started',
  onCtaClick
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navRef = useRef(null);

  const toggleMenu = () => setIsExpanded(!isExpanded);

  const renderLink = (lnk, i) => {
    const content = (
      <>
        <ArrowUpRight className="nav-card-link-icon" aria-hidden="true" size={16} />
        {lnk.label}
        {lnk.badge > 0 && (
          <span className="ml-2 px-1.5 py-0.5 text-[9px] bg-red-500 text-white rounded-full leading-none">
            {lnk.badge}
          </span>
        )}
      </>
    );

    const handleClick = () => {
      if (lnk.onClick) lnk.onClick();
      setIsExpanded(false);
    };

    if (lnk.onClick) {
      return (
        <button 
          key={`${lnk.label}-${i}`} 
          className="nav-card-link" 
          onClick={handleClick} 
          style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', color: 'inherit' }}
        >
          {content}
        </button>
      );
    }

    if (lnk.href?.startsWith('http') || lnk.href?.startsWith('#')) {
      return (
        <a key={`${lnk.label}-${i}`} className="nav-card-link" href={lnk.href} aria-label={lnk.ariaLabel} onClick={() => setIsExpanded(false)}>
          {content}
        </a>
      );
    }

    return (
      <Link key={`${lnk.label}-${i}`} className="nav-card-link" to={lnk.href} aria-label={lnk.ariaLabel} onClick={() => setIsExpanded(false)}>
        {content}
      </Link>
    );
  };

  return (
    <div className={`card-nav-container ${className}`}>
      <motion.nav 
        ref={navRef} 
        className={`card-nav ${isExpanded ? 'open' : ''}`} 
        initial={false}
        animate={{ 
          height: isExpanded ? 'auto' : 60,
          backgroundColor: baseColor
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="card-nav-top">
          <div
            className="hamburger-menu"
            onClick={toggleMenu}
            role="button"
            aria-label={isExpanded ? 'Close menu' : 'Open menu'}
            tabIndex={0}
            style={{ color: menuColor || '#000' }}
          >
            {isExpanded ? <X size={24} /> : <Menu size={24} />}
          </div>

          <div className="logo-container" onClick={() => { onLogoClick?.(); setIsExpanded(false); }} style={{ cursor: onLogoClick ? 'pointer' : 'default' }}>
            {typeof logo === 'string' ? (
              <img src={logo} alt={logoAlt} className="logo" />
            ) : (
              logo
            )}
          </div>

          <button
            type="button"
            className="card-nav-cta-button"
            onClick={() => { onCtaClick?.(); setIsExpanded(false); }}
            style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
          >
            {ctaLabel}
          </button>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div 
              className="card-nav-content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              {(items || []).slice(0, 3).map((item, idx) => (
                <motion.div
                  key={`${item.label}-${idx}`}
                  className="nav-card"
                  style={{ backgroundColor: item.bgColor, color: item.textColor }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <div className="nav-card-label">{item.label}</div>
                  <div className="nav-card-links">
                    {item.links?.map((lnk, i) => renderLink(lnk, i))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
};

export default CardNav;
