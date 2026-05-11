import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Mock Earnings Data
// ─────────────────────────────────────────────────────────────────────────────
const mockTransactions = [
  {
    id: 'txn_1',
    campaignTitle: 'Summer Collection Shoot',
    brandName: 'Urban Threads',
    amount: 15000,
    status: 'Completed',
    date: '2024-06-28',
    type: 'Campaign Payout',
  },
  {
    id: 'txn_2',
    campaignTitle: 'Real Estate Drone Photography',
    brandName: 'Skyline Developers',
    amount: 35000,
    status: 'Completed',
    date: '2024-07-08',
    type: 'Campaign Payout',
  },
  {
    id: 'txn_3',
    campaignTitle: 'Food Photography Shoot',
    brandName: 'Gourmet Delights Café',
    amount: 22000,
    status: 'Processing',
    date: '2024-07-25',
    type: 'Campaign Payout',
  },
  {
    id: 'txn_4',
    campaignTitle: 'Urban Fashion Editorial',
    brandName: 'MetroStyle Clothing',
    amount: 28000,
    status: 'Completed',
    date: '2024-08-20',
    type: 'Campaign Payout',
  },
  {
    id: 'txn_5',
    campaignTitle: 'Travel Lifestyle Shoot',
    brandName: 'SunSeeker Resorts',
    amount: 42000,
    status: 'Pending',
    date: '2024-09-15',
    type: 'Campaign Payout',
  },
  {
    id: 'txn_6',
    campaignTitle: 'Referral Bonus',
    brandName: 'Driplens',
    amount: 2000,
    status: 'Completed',
    date: '2024-08-01',
    type: 'Bonus',
  },
];

const mockWithdrawals = [
  {
    id: 'wd_1',
    amount: 50000,
    status: 'Completed',
    date: '2024-07-15',
    method: 'UPI — annanya@okicici',
  },
  {
    id: 'wd_2',
    amount: 28000,
    status: 'Completed',
    date: '2024-08-25',
    method: 'UPI — annanya@okicici',
  },
];

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
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
const formatDate = (dateString) => {
  const d = new Date(dateString);
  const day = String(d.getDate()).padStart(2, '0');
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
};

const formatCurrency = (amount) => `₹${amount.toLocaleString('en-IN')}`;

// ─────────────────────────────────────────────────────────────────────────────
// Status Badge
// ─────────────────────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const colors = {
    completed: 'bg-[#D1FAE5] text-[#065F46]',
    processing: 'bg-[#FEF3C7] text-[#92400E]',
    pending: 'bg-[#DBEAFE] text-[#2563EB]',
  };
  return (
    <span
      className={`inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap ${
        colors[status.toLowerCase()] || 'bg-gray-100 text-gray-600'
      }`}
    >
      {status}
    </span>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═════════════════════════════════════════════════════════════════════════════

export default function EarningsPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState('transactions'); // transactions | withdrawals

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Computed stats
  const totalEarned = mockTransactions
    .filter((t) => t.status === 'Completed')
    .reduce((sum, t) => sum + t.amount, 0);
  const pendingAmount = mockTransactions
    .filter((t) => t.status !== 'Completed')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalWithdrawn = mockWithdrawals
    .filter((w) => w.status === 'Completed')
    .reduce((sum, w) => sum + w.amount, 0);
  const availableBalance = totalEarned - totalWithdrawn;

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
        <title>Earnings — Driplens</title>
        <meta name="description" content="Track your earnings, payment history, and withdrawals on Driplens." />
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
            Earnings
          </h1>
          <p className="mt-2 text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-[0.2em]">
            Payment history, balance &amp; withdrawals
          </p>
        </div>

        {/* ── Stats Cards ── */}
        <div className="px-6 md:px-10 pb-8">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-50 animate-pulse border border-[#E5E7EB]" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Earned */}
              <div className="p-6 bg-black text-white border border-black">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 mb-3">
                  Total Earned
                </p>
                <p className="text-3xl font-black tracking-tight">{formatCurrency(totalEarned)}</p>
                <p className="text-[10px] font-semibold text-white/40 mt-2 uppercase tracking-widest">
                  Lifetime
                </p>
              </div>

              {/* Available Balance */}
              <div className="p-6 border-2 border-[#0540F2] bg-[#EEF2FF]">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0540F2]/60 mb-3">
                  Available Balance
                </p>
                <p className="text-3xl font-black tracking-tight text-[#0540F2]">
                  {formatCurrency(availableBalance)}
                </p>
                <button className="mt-3 text-[10px] font-black uppercase tracking-widest text-[#0540F2] underline underline-offset-4 hover:text-[#0332C2] transition-colors">
                  Withdraw
                </button>
              </div>

              {/* Pending */}
              <div className="p-6 border border-[#E5E7EB]">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9CA3AF] mb-3">
                  Pending
                </p>
                <p className="text-3xl font-black tracking-tight text-[#F59E0B]">
                  {formatCurrency(pendingAmount)}
                </p>
                <p className="text-[10px] font-semibold text-[#9CA3AF] mt-2 uppercase tracking-widest">
                  Awaiting approval
                </p>
              </div>

              {/* Total Withdrawn */}
              <div className="p-6 border border-[#E5E7EB]">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9CA3AF] mb-3">
                  Total Withdrawn
                </p>
                <p className="text-3xl font-black tracking-tight text-[#10B981]">
                  {formatCurrency(totalWithdrawn)}
                </p>
                <p className="text-[10px] font-semibold text-[#9CA3AF] mt-2 uppercase tracking-widest">
                  To bank/UPI
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ── UPI Card ── */}
        <div className="px-6 md:px-10 pb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 border border-[#E5E7EB] bg-[#FAFAFA] gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#9CA3AF] mb-1">
                Connected Payment Method
              </p>
              <p className="text-[15px] font-bold text-black">UPI — annanya@okicici</p>
            </div>
            <button className="px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.18em] border border-black hover:bg-black hover:text-white transition-all">
              Edit UPI
            </button>
          </div>
        </div>

        {/* ── Toggle: Transactions / Withdrawals ── */}
        <div className="px-6 md:px-10 pb-4">
          <div className="flex gap-0 border-b-2 border-[#E5E7EB]">
            <button
              onClick={() => setActiveView('transactions')}
              className={`px-6 py-3 text-[11px] font-bold uppercase tracking-[0.18em] transition-all border-b-2 -mb-[2px] ${
                activeView === 'transactions'
                  ? 'border-[#0540F2] text-[#0540F2]'
                  : 'border-transparent text-[#9CA3AF] hover:text-black'
              }`}
            >
              Transactions
            </button>
            <button
              onClick={() => setActiveView('withdrawals')}
              className={`px-6 py-3 text-[11px] font-bold uppercase tracking-[0.18em] transition-all border-b-2 -mb-[2px] ${
                activeView === 'withdrawals'
                  ? 'border-[#0540F2] text-[#0540F2]'
                  : 'border-transparent text-[#9CA3AF] hover:text-black'
              }`}
            >
              Withdrawals
            </button>
          </div>
        </div>

        {/* ── Transaction / Withdrawal List ── */}
        <div className="px-6 md:px-10 pb-16">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-gray-50 animate-pulse border border-[#E5E7EB]" />
              ))}
            </div>
          ) : activeView === 'transactions' ? (
            <div className="divide-y divide-[#E5E7EB]">
              {mockTransactions.map((txn) => (
                <div
                  key={txn.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between py-5 gap-3 hover:bg-[#F9FAFB] px-2 -mx-2 transition-colors"
                  id={`transaction-${txn.id}`}
                >
                  <div className="min-w-0">
                    <p className="text-[14px] font-bold text-black leading-snug">{txn.campaignTitle}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#9CA3AF]">
                        {txn.brandName}
                      </span>
                      <span className="text-[10px] font-semibold text-[#9CA3AF]">·</span>
                      <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#9CA3AF]">
                        {txn.type}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 shrink-0">
                    <div className="text-right">
                      <p
                        className={`text-lg font-black ${
                          txn.status === 'Completed' ? 'text-[#10B981]' : 'text-black'
                        }`}
                      >
                        {txn.status === 'Completed' ? '+ ' : ''}
                        {formatCurrency(txn.amount)}
                      </p>
                      <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-widest">
                        {formatDate(txn.date)}
                      </p>
                    </div>
                    <StatusBadge status={txn.status} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="divide-y divide-[#E5E7EB]">
              {mockWithdrawals.length === 0 ? (
                <div className="py-20 text-center">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-[#9CA3AF]">
                    No withdrawals yet
                  </p>
                </div>
              ) : (
                mockWithdrawals.map((wd) => (
                  <div
                    key={wd.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between py-5 gap-3 hover:bg-[#F9FAFB] px-2 -mx-2 transition-colors"
                    id={`withdrawal-${wd.id}`}
                  >
                    <div>
                      <p className="text-[14px] font-bold text-black">Withdrawal to Bank</p>
                      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#9CA3AF] mt-1">
                        {wd.method}
                      </p>
                    </div>
                    <div className="flex items-center gap-6 shrink-0">
                      <div className="text-right">
                        <p className="text-lg font-black text-[#EF4444]">
                          − {formatCurrency(wd.amount)}
                        </p>
                        <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-widest">
                          {formatDate(wd.date)}
                        </p>
                      </div>
                      <StatusBadge status={wd.status} />
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
