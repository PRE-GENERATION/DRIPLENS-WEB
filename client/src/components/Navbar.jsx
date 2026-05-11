import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import { useSession } from '../hooks/useSession';

export default function Navbar() {
  const { data: session, status, logout } = useSession();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const user = session?.user;
  const isLoggedIn = status === 'authenticated';

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  const linkClass = ({ isActive }) =>
    `text-[11px] font-bold uppercase tracking-[0.2em] transition-all flex items-center gap-2 ${
      isActive 
        ? 'text-[var(--color-brand-accent)]' 
        : 'text-[var(--color-brand-body)] opacity-60 hover:opacity-100 hover:text-[var(--color-brand-accent)]'
    }`;

  const Badge = ({ count, color = "bg-indigo-600" }) => {
    if (!count || count <= 0) return null;
    return (
      <span className={`inline-flex items-center justify-center px-1.5 py-0.5 ml-1 text-[9px] font-bold leading-none text-white transform translate-y-[-1px] rounded-full ${color}`}>
        {count}
      </span>
    );
  };

  const NavItem = ({ to, label, badgeCount }) => (
    <NavLink to={to} className={linkClass}>
      <span>{label}</span>
      {badgeCount > 0 && <Badge count={badgeCount} />}
    </NavLink>
  );

  // Condition 1: Landing Page Links
  const publicLinks = [];

  // Condition 2: Brand Links
  const brandLinks = [
    { to: '/dashboard/brand', label: 'Dashboard' },
    { to: '/campaigns', label: 'My Campaigns' },
    { to: '/applications', label: 'Applications', badge: user?.counts?.newApplications },
    { to: '/messages', label: 'Messages', badge: user?.counts?.unreadMessages },
    { to: '/payments', label: 'Payments' },
  ];

  // Condition 3: Creator Links (main nav)
  const creatorLinks = [
    { to: '/opportunities', label: 'Opportunities' },
    { to: '/applied', label: 'Applied' },
    { to: '/dashboard', label: 'Dashboard' },
  ];

  return (
    <nav className="border-b border-[var(--color-brand-border)]/10 bg-[var(--color-brand-bg)]/80 backdrop-blur-md sticky top-0 z-[100]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link to="/" className="font-heading font-bold text-2xl tracking-tighter text-[var(--color-brand-accent)] hover:bg-clip-text hover:text-transparent hover:bg-gradient-to-r hover:from-[var(--color-brand-accent)] hover:to-[var(--color-brand-label)] transition-colors uppercase">
            Driplens
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {!isLoggedIn ? (
              // Condition 1: No user logged in
              publicLinks.map(l => (
                <NavLink key={l.to} to={l.to} className={linkClass}>{l.label}</NavLink>
              ))
            ) : user?.role === 'brand' ? (
              // Condition 2: Brand logged in
              <>
                {brandLinks.map(l => (
                  <NavItem key={l.to} to={l.to} label={l.label} badgeCount={l.badge} />
                ))}
                {user?.verified === false && (
                  <NavItem to="/verify/brand" label="Verify" />
                )}
              </>
            ) : (
              // Condition 3: Creator logged in
              creatorLinks.map(l => (
                <NavItem key={l.to} to={l.to} label={l.label} badgeCount={l.badge} />
              ))
            )}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                {user?.role === 'brand' && (
                  <Link to="/opportunities/new" className="bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold uppercase tracking-[0.2em] px-4 py-2.5 rounded-lg transition-all flex items-center gap-2">
                    Post Opportunity
                  </Link>
                )}

                {/* Messages link (side action for creators) */}
                {user?.role === 'creator' && (
                  <NavLink to="/messages" className={linkClass}>
                    <span>Messages</span>
                    {user?.counts?.unreadMessages > 0 && <Badge count={user.counts.unreadMessages} />}
                  </NavLink>
                )}
                
                <div className="h-6 w-px bg-[var(--color-brand-border)]/20 mx-1" />
                
                <Link to="/profile/edit" className="flex items-center gap-2 group">
                  <div className="w-8 h-8 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold uppercase group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    {user?.username?.[0] || user?.email?.[0]}
                  </div>
                  <span className="text-xs font-bold text-[var(--color-brand-headings)] hidden lg:block opacity-80 group-hover:opacity-100">
                    {user?.username || 'Profile'}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="text-[11px] font-bold uppercase tracking-[0.2em] text-red-500/60 hover:text-red-500 transition-colors p-2"
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/auth" className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-brand-headings)] hover:text-[var(--color-brand-accent)] transition-colors">
                  Log in
                </Link>
                <Link to="/auth?mode=register" className="bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold uppercase tracking-[0.2em] px-6 py-2.5 rounded-lg transition-all">
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-[var(--color-brand-headings)]"
            onClick={() => setMobileOpen(o => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[var(--color-brand-border)]/10 bg-[var(--color-brand-bg)] px-4 py-6 space-y-1 animate-in slide-in-from-top duration-300">
          {!isLoggedIn ? (
            <>
              {publicLinks.map(l => (
                <Link 
                  key={l.to} 
                  to={l.to} 
                  onClick={() => setMobileOpen(false)} 
                  className="block text-sm font-bold uppercase tracking-widest py-3 px-4 hover:bg-indigo-50/50 rounded-lg text-[#999] hover:text-indigo-600 transition-all"
                >
                  {l.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-[var(--color-brand-border)]/10 space-y-3 px-4">
                <Link to="/auth" onClick={() => setMobileOpen(false)} className="block w-full text-center py-3 text-sm font-bold uppercase tracking-widest border border-indigo-100 rounded-lg text-indigo-600">Log in</Link>
                <Link to="/auth?mode=register" onClick={() => setMobileOpen(false)} className="block w-full text-center py-3 text-sm font-bold uppercase tracking-widest bg-indigo-600 text-white rounded-lg shadow-lg shadow-indigo-200">Sign up</Link>
              </div>
            </>
          ) : (
            <>
              {(user?.role === 'brand' ? brandLinks : creatorLinks).map(l => (
                <Link 
                  key={l.to} 
                  to={l.to} 
                  onClick={() => setMobileOpen(false)} 
                  className="flex items-center justify-between text-sm font-bold uppercase tracking-widest py-3 px-4 hover:bg-indigo-50/50 rounded-lg text-[#999] hover:text-indigo-600 transition-all"
                >
                  <div className="flex items-center gap-3">
                    {l.label}
                  </div>
                  {l.badge > 0 && <Badge count={l.badge} />}
                </Link>
              ))}
              
              {/* Creator: Messages link in mobile */}
              {user?.role === 'creator' && (
                <Link 
                  key="/messages"
                  to="/messages" 
                  onClick={() => setMobileOpen(false)} 
                  className="flex items-center justify-between text-sm font-bold uppercase tracking-widest py-3 px-4 hover:bg-indigo-50/50 rounded-lg text-[#999] hover:text-indigo-600 transition-all"
                >
                  <div className="flex items-center gap-3">Messages</div>
                  {user?.counts?.unreadMessages > 0 && <Badge count={user.counts.unreadMessages} />}
                </Link>
              )}

              {user?.role === 'brand' && (
                <Link 
                  to="/opportunities/new" 
                  onClick={() => setMobileOpen(false)} 
                  className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest py-3 px-4 mt-2 bg-indigo-600 text-white rounded-lg shadow-lg shadow-indigo-200"
                >
                  Post Opportunity
                </Link>
              )}

              <div className="pt-4 mt-4 border-t border-[var(--color-brand-border)]/10 space-y-1">
                <Link 
                  to="/profile/edit" 
                  onClick={() => setMobileOpen(false)} 
                  className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest py-3 px-4 hover:bg-indigo-50/50 rounded-lg text-[#999] hover:text-indigo-600 transition-all"
                >
                  Profile
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="flex items-center gap-3 w-full text-left text-sm font-bold uppercase tracking-widest py-3 px-4 hover:bg-red-50 rounded-lg text-red-500 transition-all"
                >
                  Log Out
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </nav>
  );
}


