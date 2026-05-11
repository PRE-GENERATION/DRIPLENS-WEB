import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Sidebar Nav Items
// ─────────────────────────────────────────────────────────────────────────────
const sidebarItems = [
  { label: 'Dashboard', to: '/dashboard', id: 'dashboard' },
  { label: 'Opportunities', to: '/opportunities', id: 'opportunities' },
  { label: 'Applied', to: '/applied', id: 'applied' },
  { label: 'Messages', to: '/messages', id: 'messages' },
  { label: 'Earnings', to: '/earnings', id: 'earnings' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Mock data for dashboard overview
// ─────────────────────────────────────────────────────────────────────────────
const mockRecentActivity = [
  {
    id: 1,
    text: "Applied to 'Summer Collection Shoot' by Urban Threads",
    date: '2 days ago',
    type: 'application',
  },
  {
    id: 2,
    text: 'New message from Skyline Developers',
    date: '3 days ago',
    type: 'message',
  },
  {
    id: 3,
    text: "Shortlisted for 'Urban Fashion Editorial' by MetroStyle",
    date: '5 days ago',
    type: 'status',
  },
  {
    id: 4,
    text: 'Payment of ₹15,000 received from Urban Threads',
    date: '1 week ago',
    type: 'payment',
  },
  {
    id: 5,
    text: "Applied to 'Travel Lifestyle Shoot' by SunSeeker Resorts",
    date: '1 week ago',
    type: 'application',
  },
  {
    id: 6,
    text: 'Profile updated — added new portfolio item',
    date: '2 weeks ago',
    type: 'profile',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Stat Card Component
// ─────────────────────────────────────────────────────────────────────────────
const StatCard = ({ title, value, accent = false }) => (
  <div
    className={`p-6 border transition-all hover:shadow-md ${
      accent ? 'bg-black text-white border-black' : 'border-[#E5E7EB] bg-white'
    }`}
  >
    <p
      className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-3 ${
        accent ? 'text-white/50' : 'text-[#9CA3AF]'
      }`}
    >
      {title}
    </p>
    <p className="text-3xl font-black tracking-tight">{value}</p>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Activity Type Badge Colors
// ─────────────────────────────────────────────────────────────────────────────
const activityDotColor = {
  application: 'bg-[#0540F2]',
  message: 'bg-[#8B5CF6]',
  status: 'bg-[#10B981]',
  payment: 'bg-[#F59E0B]',
  profile: 'bg-[#EC4899]',
};

// ═════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═════════════════════════════════════════════════════════════════════════════

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Redirect to onboarding if needed
  useEffect(() => {
    if (user && !user.onboarding_complete) {
      navigate('/onboarding/step-1', { replace: true });
    }
  }, [user, navigate]);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // ── Profile completion calculation ──
  const profileFields = [
    user?.display_name || user?.username,
    user?.bio,
    user?.avatar_url,
    user?.instagram_handle,
    user?.city,
    user?.tags?.length > 0,
    user?.platforms?.length > 0,
    user?.past_work?.length > 0,
  ];
  const completedFields = profileFields.filter(Boolean).length;
  const completionPercent = Math.round((completedFields / profileFields.length) * 100);

  // Sidebar link styles
  const sidebarLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.18em] transition-all border-l-[3px] ${
      isActive
        ? 'border-[#0540F2] text-[#0540F2] bg-[#EEF2FF]'
        : 'border-transparent text-[#6B7280] hover:text-black hover:bg-[#F9FAFB]'
    }`;

  return (
    <div className="flex min-h-screen bg-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Helmet>
        <title>Dashboard — Driplens</title>
        <meta name="description" content="Your creator dashboard on Driplens — profile overview, stats, and recent activity." />
      </Helmet>

      {/* ── Mobile sidebar overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-[#FAFAFA] border-r border-[#E5E7EB] flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="px-6 py-7 border-b border-[#E5E7EB] flex items-center justify-between">
          <Link to="/" className="text-xl font-black tracking-tighter text-[#0540F2] uppercase">
            Driplens
          </Link>
          <button
            className="lg:hidden p-1 text-gray-500 hover:text-black"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-6 space-y-0.5">
          {sidebarItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.to}
              end={item.to === '/dashboard'}
              className={sidebarLinkClass}
              onClick={() => setSidebarOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User info */}
        <div className="px-6 py-5 border-t border-[#E5E7EB]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#0540F2] text-white flex items-center justify-center text-xs font-bold uppercase shrink-0">
              {user?.username?.[0] || user?.email?.[0] || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-black truncate uppercase tracking-tight">
                {user?.display_name || user?.username || 'Creator'}
              </p>
              <p className="text-[9px] font-semibold text-[#9CA3AF] uppercase tracking-widest truncate">
                {user?.role || 'creator'}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 min-w-0 bg-white">
        {/* Top bar (mobile) */}
        <div className="lg:hidden flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB] sticky top-0 bg-white z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-gray-600 hover:text-black"
            aria-label="Open sidebar"
          >
            <Menu size={22} />
          </button>
          <Link to="/" className="text-lg font-black tracking-tighter text-[#0540F2] uppercase">
            Driplens
          </Link>
          <div className="w-9" />
        </div>

        {/* Page Header */}
        <div className="px-6 md:px-10 pt-8 md:pt-12 pb-6 md:pb-8">
          <h1
            className="text-3xl md:text-4xl font-black tracking-tight text-black"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Dashboard
          </h1>
          <p className="mt-2 text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-[0.2em]">
            Your profile overview &amp; recent activity
          </p>
        </div>

        {isLoading ? (
          /* ── Loading skeleton ── */
          <div className="px-6 md:px-10 pb-12 space-y-8">
            <div className="h-32 bg-gray-50 animate-pulse border border-[#E5E7EB]" />
            <div className="h-6 bg-gray-50 animate-pulse w-1/2" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-28 bg-gray-50 animate-pulse border border-[#E5E7EB]" />
              ))}
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-14 bg-gray-50 animate-pulse border border-[#E5E7EB]" />
              ))}
            </div>
          </div>
        ) : (
          <div className="px-6 md:px-10 pb-16 space-y-10">
            {/* ── Profile Header Card ── */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 md:p-8 border border-[#E5E7EB] bg-[#FAFAFA]" id="profile-header-card">
              {/* Avatar */}
              {user?.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt="Creator avatar"
                  className="w-20 h-20 object-cover shrink-0 border-2 border-[#0540F2]"
                />
              ) : (
                <div className="w-20 h-20 bg-[#0540F2] text-white flex items-center justify-center text-2xl font-black uppercase shrink-0">
                  {user?.username?.[0] || user?.email?.[0] || 'U'}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <h2
                  className="text-2xl font-black tracking-tight text-black"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {user?.display_name || user?.username || 'Creator'}
                </h2>
                {user?.instagram_handle && (
                  <p className="text-[12px] font-semibold text-[#0540F2] mt-0.5">
                    @{user.instagram_handle}
                  </p>
                )}
                {!user?.instagram_handle && user?.email && (
                  <p className="text-[12px] font-semibold text-[#6B7280] mt-0.5">
                    {user.email}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  {user?.city && (
                    <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#9CA3AF]">
                      {user.city}
                    </span>
                  )}
                  {user?.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {user.tags.slice(0, 4).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-[#0540F2] bg-[#EEF2FF] border border-[#0540F2]/10"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <Link
                to="/profile/edit"
                className="shrink-0 px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.18em] border border-black hover:bg-black hover:text-white transition-all"
              >
                Edit Profile
              </Link>
            </div>

            {/* ── Profile Completion ── */}
            <div id="profile-completion-section">
              <div className="flex items-center justify-between mb-3">
                <h3
                  className="text-[13px] font-bold uppercase tracking-[0.1em] text-black"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Profile Completion
                </h3>
                <span className="text-[12px] font-black text-[#0540F2]">{completionPercent}%</span>
              </div>
              <div className="w-full h-2.5 bg-[#E5E7EB] overflow-hidden">
                <div
                  className="h-full bg-[#0540F2] transition-all duration-700 ease-out"
                  style={{ width: `${completionPercent}%` }}
                />
              </div>
              {completionPercent < 100 && (
                <p className="mt-2 text-[11px] text-[#6B7280]">
                  Complete your{' '}
                  {!user?.bio && 'bio, '}
                  {!user?.avatar_url && 'profile photo, '}
                  {!user?.instagram_handle && 'Instagram handle, '}
                  {(!user?.tags || user.tags.length === 0) && 'skills, '}
                  to unlock more opportunities.{' '}
                  <Link to="/profile/edit" className="text-[#0540F2] font-semibold hover:underline">
                    Complete now →
                  </Link>
                </p>
              )}
            </div>

            {/* ── Stats Grid ── */}
            <div id="stats-grid">
              <h3
                className="text-[13px] font-bold uppercase tracking-[0.1em] text-black mb-4"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Quick Stats
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Applied Campaigns" value="12" accent />
                <StatCard title="Total Earnings" value="₹1,20,000" />
                <StatCard title="Average Bid" value="₹18,500" />
                <StatCard title="Ratings" value="4.8 / 5" />
              </div>
            </div>

            {/* ── Recent Activity ── */}
            <div id="recent-activity-section">
              <h3
                className="text-[13px] font-bold uppercase tracking-[0.1em] text-black mb-4"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Recent Activity
              </h3>
              <div className="border border-[#E5E7EB] divide-y divide-[#E5E7EB]">
                {mockRecentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 px-5 py-4 hover:bg-[#F9FAFB] transition-colors"
                    id={`activity-${activity.id}`}
                  >
                    {/* Dot indicator */}
                    <div className="pt-1.5 shrink-0">
                      <div
                        className={`w-2 h-2 ${activityDotColor[activity.type] || 'bg-gray-300'}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] text-black leading-snug">{activity.text}</p>
                    </div>
                    <span className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-widest whitespace-nowrap shrink-0">
                      {activity.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Quick Actions ── */}
            <div id="quick-actions">
              <h3
                className="text-[13px] font-bold uppercase tracking-[0.1em] text-black mb-4"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link
                  to="/opportunities"
                  className="group flex items-center justify-between p-5 border border-[#E5E7EB] hover:border-[#0540F2] transition-all"
                >
                  <div>
                    <p className="text-[14px] font-bold text-black group-hover:text-[#0540F2] transition-colors">
                      Browse Opportunities
                    </p>
                    <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-widest mt-1">
                      Discover new campaigns
                    </p>
                  </div>
                  <span className="text-[#9CA3AF] group-hover:text-[#0540F2] group-hover:translate-x-1 transition-all text-lg">
                    →
                  </span>
                </Link>

                <Link
                  to="/applied"
                  className="group flex items-center justify-between p-5 border border-[#E5E7EB] hover:border-[#0540F2] transition-all"
                >
                  <div>
                    <p className="text-[14px] font-bold text-black group-hover:text-[#0540F2] transition-colors">
                      View Applications
                    </p>
                    <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-widest mt-1">
                      Track your submissions
                    </p>
                  </div>
                  <span className="text-[#9CA3AF] group-hover:text-[#0540F2] group-hover:translate-x-1 transition-all text-lg">
                    →
                  </span>
                </Link>

                <Link
                  to="/messages"
                  className="group flex items-center justify-between p-5 border border-[#E5E7EB] hover:border-[#0540F2] transition-all"
                >
                  <div>
                    <p className="text-[14px] font-bold text-black group-hover:text-[#0540F2] transition-colors">
                      Messages
                    </p>
                    <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-widest mt-1">
                      Chat with brands
                    </p>
                  </div>
                  <span className="text-[#9CA3AF] group-hover:text-[#0540F2] group-hover:translate-x-1 transition-all text-lg">
                    →
                  </span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
