import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { useSession } from '../hooks/useSession';
import CardNav from './CardNav/CardNav';

export default function Navbar() {
  const { data: session, status, logout } = useSession();
  const navigate = useNavigate();

  const user = session?.user;
  const isLoggedIn = status === 'authenticated';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getNavItems = () => {
    if (!isLoggedIn) {
      return [
        {
          label: 'Platform',
          bgColor: '#f9f9f9',
          textColor: '#000',
          links: [
            { label: 'Dashboard', href: isLoggedIn ? (user?.role === 'brand' ? '/dashboard/brand' : '/dashboard/creator') : '/auth' },
            { label: 'Marketplace', href: '/opportunities' }
          ]
        },
        {
          label: 'Explore',
          bgColor: '#ccff00',
          textColor: '#000',
          links: [
            { label: 'Success Stories', href: '/driplens' },
            { label: 'Explore Talent', href: '/explore' }
          ]
        },
        {
          label: 'Company',
          bgColor: '#111',
          textColor: '#fff',
          links: [
            { label: 'About Us', href: '/about' },
            { label: 'Documentation', href: '/documentation' }
          ]
        }
      ];
    }

    if (user?.role === 'brand') {
      return [
        {
          label: 'Platform',
          bgColor: '#f9f9f9',
          textColor: '#000',
          links: [
            { label: 'Dashboard', href: '/dashboard/brand' },
            { label: 'Post Opportunity', href: '/opportunities/new' }
          ]
        },
        {
          label: 'Workflow',
          bgColor: '#ccff00',
          textColor: '#000',
          links: [
            { label: 'Active Campaigns', href: '/dashboard/brand?tab=campaigns' },
            { label: 'Applications', href: '/dashboard/brand?tab=applications', badge: user?.counts?.newApplications },
            { label: 'Messages', href: '/messages', badge: user?.counts?.unreadMessages }
          ]
        },
        {
          label: 'Account',
          bgColor: '#111',
          textColor: '#fff',
          links: [
            { label: 'Public Profile', href: `/brand/${user?.id || ''}` },
            { label: 'Settings', href: '/settings' },
            { label: 'Logout', onClick: handleLogout }
          ]
        }
      ];
    }

    // Creator Workflow
    return [
      {
        label: 'Platform',
        bgColor: '#f9f9f9',
        textColor: '#000',
        links: [
          { label: 'Dashboard', href: '/dashboard/creator' },
          { label: 'Explore Brands', href: '/brands' }
        ]
      },
      {
        label: 'Workflow',
        bgColor: '#ccff00',
        textColor: '#000',
        links: [
          { label: 'My Applications', href: '/applied' },
          { label: 'Active Progress', href: '/progress' },
          { label: 'Messages', href: '/messages', badge: user?.counts?.unreadMessages }
        ]
      },
      {
        label: 'Account',
        bgColor: '#111',
        textColor: '#fff',
        links: [
          { label: 'My Portfolio', href: `/profile/${user?.id || ''}` },
          { label: 'Earnings', href: '/earnings' },
          { label: 'Settings', href: '/settings' },
          { label: 'Logout', onClick: handleLogout }
        ]
      }
    ];
  };

  const getCtaProps = () => {
    if (!isLoggedIn) return { label: 'Get Started', onClick: () => navigate('/auth') };
    if (user?.role === 'brand') return { label: 'Post Job', onClick: () => navigate('/opportunities/new') };
    return { label: 'Dashboard', onClick: () => navigate('/dashboard/creator') };
  };

  const navItems = useMemo(() => getNavItems(), [isLoggedIn, user?.id, user?.counts?.newApplications, user?.counts?.unreadMessages]);
  const cta = useMemo(() => getCtaProps(), [isLoggedIn, user?.role]);

  return (
    <CardNav
      logo={
        <span className="font-heading font-bold text-xl tracking-tighter text-black uppercase">
          Driplens
        </span>
      }
      onLogoClick={() => navigate('/')}
      items={navItems}
      ctaLabel={cta.label}
      onCtaClick={cta.onClick}
      baseColor="rgba(255, 255, 255, 0.9)"
      buttonBgColor="#111"
      buttonTextColor="#fff"
    />
  );
}


