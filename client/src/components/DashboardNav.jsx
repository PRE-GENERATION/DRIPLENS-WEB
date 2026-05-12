import React from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import StaggeredMenu from './StaggeredMenu/StaggeredMenu';

const DashboardNav = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  if (!user) return null;

  const setActiveTab = (tab) => {
    // If we are on a dashboard page, just update the search params
    if (window.location.pathname.includes('/dashboard')) {
        setSearchParams({ tab });
    } else {
        // Otherwise, navigate to the dashboard with the tab
        const path = user.role === 'brand' ? '/dashboard/brand' : '/dashboard/creator';
        navigate(`${path}?tab=${tab}`);
    }
  };

  const activeTabFromUrl = searchParams.get('tab') || 'overview';
  const brandItems = [
    { label: 'Overview', active: activeTabFromUrl === 'overview', onClick: () => setActiveTab('overview') },
    { label: 'Post Brief', active: window.location.pathname === '/opportunities/new', onClick: () => navigate('/opportunities/new') },
    { label: 'Campaigns', active: activeTabFromUrl === 'campaigns', onClick: () => setActiveTab('campaigns') },
    { label: 'Projects', active: activeTabFromUrl === 'projects', onClick: () => setActiveTab('projects') },
    { label: 'Applications', active: activeTabFromUrl === 'applications', onClick: () => setActiveTab('applications') },
    { label: 'Payments', active: activeTabFromUrl === 'payments', onClick: () => setActiveTab('payments') },
    { label: 'Analytics', active: activeTabFromUrl === 'analytics', onClick: () => setActiveTab('analytics') },
    { label: 'Messages', active: window.location.pathname === '/messages', onClick: () => navigate('/messages') },
  ];

  const creatorItems = [
    { label: 'Opportunities', active: activeTabFromUrl === 'opportunities', onClick: () => setActiveTab('opportunities') },
    { label: 'Applied', active: activeTabFromUrl === 'applied', onClick: () => setActiveTab('applied') },
    { label: 'Projects', active: activeTabFromUrl === 'projects', onClick: () => setActiveTab('projects') },
    { label: 'Messages', active: window.location.pathname === '/messages', onClick: () => navigate('/messages') },
    { label: 'Payments', active: activeTabFromUrl === 'payments', onClick: () => setActiveTab('payments') },
    { label: 'Analytics', active: activeTabFromUrl === 'analytics', onClick: () => setActiveTab('analytics') },
    { label: 'Portfolio', active: activeTabFromUrl === 'portfolio', onClick: () => setActiveTab('portfolio') },
  ];

  const socialItems = [
    { label: 'Twitter', link: 'https://twitter.com/driplens' },
    { label: 'Instagram', link: 'https://instagram.com/driplens' },
    { label: 'LinkedIn', link: 'https://linkedin.com/company/driplens' }
  ];

  const items = user.role === 'brand' ? brandItems : creatorItems;

  return (
    <StaggeredMenu 
      items={items}
      socialItems={socialItems}
      isFixed={true}
      accentColor="#0044ff"
      colors={['#000000', '#0044ff']}
      logoUrl={<Link to="/" className="text-2xl font-black tracking-tighter text-black uppercase">DRIPLENS</Link>}
      menuButtonColor="#000"
      openMenuButtonColor="#fff"
    />
  );
};

export default DashboardNav;
