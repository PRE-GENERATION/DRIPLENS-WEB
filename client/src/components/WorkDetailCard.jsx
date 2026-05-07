import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * WorkDetailCard – redesigned modal
 *
 * Props:
 *   project  – the selected content item (or null when closed)
 *   onClose  – callback to clear selection
 */
export default function WorkDetailCard({ project, onClose }) {
  const panelRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Lock body scroll while open
  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [project]);

  // Derive initials for the avatar
  const initials = (str = 'A') =>
    str
      .split(/[\s_]/)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? '')
      .join('');

  return (
    <AnimatePresence>
      {project && (
        /* ── Backdrop ── */
        <motion.div
          key="wdc-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-8"
          style={{ backgroundColor: 'rgba(2, 6, 23, 0.72)', backdropFilter: 'blur(6px)' }}
          onClick={onClose}
        >
          {/* ── Card ── */}
          <motion.div
            key="wdc-card"
            ref={panelRef}
            initial={{ opacity: 0, scale: 0.97, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 18 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="wdc-card"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ─── Left: Image ─── */}
            <div className="wdc-image-col overflow-y-auto custom-scrollbar">
              <div className="flex flex-col gap-8 p-4 md:p-8">
                {project.items?.map((item, idx) => (
                  <div key={idx} className="relative group/item">
                    {item.mediaType === 'video' ? (
                      <video
                        src={item.mediaUrl}
                        controls
                        className="wdc-media shadow-2xl max-h-[70vh] object-contain mx-auto"
                      />
                    ) : (
                      <img
                        src={item.mediaUrl}
                        alt={`${project.title} - ${idx + 1}`}
                        className="wdc-media shadow-2xl max-h-[70vh] object-contain mx-auto"
                      />
                    )}
                    <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white text-[8px] font-bold px-2 py-1 uppercase tracking-widest opacity-0 group-hover/item:opacity-100 transition-opacity">
                      {idx + 1} / {project.items.length}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Category badge overlay */}
              <span className="wdc-category-badge">
                {project.category || 'Creative'}
              </span>
            </div>

            {/* ─── Divider ─── */}
            <div className="wdc-divider" />

            {/* ─── Right: Content ─── */}
            <div className="wdc-content-col">
              {/* Close button */}
              <button
                id="wdc-close-btn"
                className="wdc-close-btn"
                onClick={onClose}
                aria-label="Close"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>

              {/* Type label */}
              <p className="wdc-type-label">{project.category || 'Cinematography'}</p>

              {/* Title */}
              <h2 className="wdc-title">{project.title}</h2>

              {/* Description */}
              <p className="wdc-description">
                {project.description ||
                  'A meticulously crafted visual piece delivering a cinematic narrative through careful composition, color, and movement.'}
              </p>

              {/* ── Divider ── */}
              <div className="wdc-h-rule" />

              {/* Creator row */}
              <div className="wdc-creator-row">
                {/* Avatar */}
                <div className="wdc-avatar" aria-hidden="true">
                  {project.author?.avatar_url ? (
                    <img
                      src={project.author.avatar_url}
                      alt={project.author.username}
                      className="wdc-avatar-img"
                    />
                  ) : (
                    <span>{initials(project.author?.username || project.author?.display_name || 'AN')}</span>
                  )}
                </div>
                <div className="wdc-creator-info">
                  <p className="wdc-creator-name">
                    {project.author?.display_name || project.author?.username || 'Anonymous'}
                  </p>
                  <p className="wdc-creator-sub">Independent Creator</p>
                </div>
              </div>

              {/* ── Divider ── */}
              <div className="wdc-h-rule" />

              {/* Meta grid */}
              <div className="wdc-meta-grid">
                {[
                  { label: 'Category',  value: project.category  || 'Creative'     },
                  { label: 'Source',    value: project.source    || 'Driplens'      },
                  { label: 'Format',    value: project.mediaType === 'video' ? 'Video' : 'Photo' },
                  { label: 'Status',    value: 'Available'                          },
                ].map(({ label, value }) => (
                  <div key={label} className="wdc-meta-item">
                    <p className="wdc-meta-label">{label}</p>
                    <p className="wdc-meta-value">{value}</p>
                  </div>
                ))}
              </div>

              {/* ── Divider ── */}
              <div className="wdc-h-rule" />

              {/* CTA */}
              <div className="wdc-cta-area">
                <Link
                  to={`/profile/${project.creator_id || project.user_id || project.id || 'demo'}`}
                  id="wdc-hire-btn"
                  className="wdc-hire-btn"
                >
                  Hire Me
                  <svg className="wdc-hire-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
                <button
                  id="wdc-message-btn"
                  className="wdc-message-btn"
                  onClick={onClose}
                >
                  Message
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
