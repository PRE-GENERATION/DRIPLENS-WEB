import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { OnboardingProvider } from './context/OnboardingContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ClickSpark from './components/ClickSpark';
import ScrollToTop from './components/ScrollToTop';


// Pages
import LandingPage from './pages/LandingPage';

import DriplensLanding from './pages/DriplensLanding';

import AuthPage from './pages/AuthPage';
import OnboardingPage from './pages/OnboardingPage';
import CreatorsPage from './pages/CreatorsPage';
import BrandsPage from './pages/BrandsPage';
import CreatorProfilePage from './pages/CreatorProfilePage';
import BrandProfilePage from './pages/BrandProfilePage';
import ExplorePage from './pages/ExplorePage';
import UploadPage from './pages/UploadPage';
import CreatorDashboard from './pages/CreatorDashboard';
import BrandDashboard from './pages/BrandDashboard';

import DirectMessagePage from './pages/DirectMessagePage';
// MessagingPage removed — use DirectMessagePage at /dm/:id
import CheckoutPage from './pages/CheckoutPage';
import ProjectProgressPage from './pages/ProjectProgressPage';

import EditProfilePage from './pages/EditProfilePage';
import NotFoundPage from './pages/NotFoundPage';

// Footer Pages - Product
import FeaturesPage from './pages/FeaturesPage';
import PricingPage from './pages/PricingPage';
import IntegrationsPage from './pages/IntegrationsPage';
import ChangelogPage from './pages/ChangelogPage';

// Footer Pages - Resources
import DocumentationPage from './pages/DocumentationPage';
import TutorialsPage from './pages/TutorialsPage';
import BlogPage from './pages/BlogPage';
import SupportPage from './pages/SupportPage';

// Footer Pages - Company
import AboutPage from './pages/AboutPage';
import CareersPage from './pages/CareersPage';
import ContactPage from './pages/ContactPage';

// Legal
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';

const AppLayout = () => {
  const location = useLocation();
  const isDriplens = location.pathname.startsWith('/driplens');
  const isDM = location.pathname.startsWith('/dm');

  return (
    <div className={isDriplens ? "bg-[#050508] min-h-screen text-white" : "min-h-screen flex flex-col bg-[var(--color-brand-bg)] text-[var(--color-brand-body)]"}>
      {!isDriplens && <Navbar />}
      <main className="flex-grow">
        <Routes>
          {/* Driplens Landing */}
          <Route path="/driplens" element={<DriplensLanding />} />

          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/onboarding/step-1" element={
            <ProtectedRoute requiredRole="creator"><OnboardingPage /></ProtectedRoute>
          } />
          <Route path="/creators" element={<CreatorsPage />} />
          <Route path="/brands" element={<BrandsPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/profile/:id" element={<CreatorProfilePage />} />
          <Route path="/brand/:id" element={<BrandProfilePage />} />

          {/* Footer Pages - Product */}
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/integrations" element={<IntegrationsPage />} />
          <Route path="/changelog" element={<ChangelogPage />} />

          {/* Footer Pages - Resources */}
          <Route path="/documentation" element={<DocumentationPage />} />
          <Route path="/tutorials" element={<TutorialsPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/support" element={<SupportPage />} />

          {/* Footer Pages - Company */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Legal */}
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />

          {/* Protected — any logged-in user */}
          <Route path="/dm/:id" element={<DirectMessagePage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/progress" element={<ProjectProgressPage />} />
          <Route path="/profile/edit" element={
            <ProtectedRoute><EditProfilePage /></ProtectedRoute>
          } />

          {/* Protected — role-specific */}
          <Route path="/upload" element={
            <ProtectedRoute requiredRole="creator"><UploadPage /></ProtectedRoute>
          } />
          <Route path="/dashboard/creator" element={
            <ProtectedRoute requiredRole="creator"><CreatorDashboard /></ProtectedRoute>
          } />
          <Route path="/dashboard/brand" element={
            <ProtectedRoute requiredRole="brand"><BrandDashboard /></ProtectedRoute>
          } />

          {/* 404 catch-all */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      {!isDriplens && !isDM && <Footer />}
    </div>
  );
};

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <SocketProvider>
          <Router>
            <ScrollToTop />
            <OnboardingProvider>
              <ClickSpark sparkColor="var(--color-brand-accent)" sparkSize={10} sparkRadius={15} sparkCount={8} duration={400}>
                <div className="min-h-screen flex flex-col bg-[var(--color-brand-bg)] text-[var(--color-brand-body)]">
                  <Navbar />
                  <main className="flex-grow">
                    <Routes>
                      {/* Public */}
                      <Route path="/" element={<LandingPage />} />
                      <Route path="/auth" element={<AuthPage />} />
                      <Route path="/onboarding/step-1" element={
                        <ProtectedRoute requiredRole="creator"><OnboardingPage /></ProtectedRoute>
                      } />
                      <Route path="/creators" element={<CreatorsPage />} />
                      <Route path="/brands" element={<BrandsPage />} />
                      <Route path="/explore" element={<ExplorePage />} />
                      <Route path="/profile/:id" element={<CreatorProfilePage />} />
                      <Route path="/brand/:id" element={<BrandProfilePage />} />

                      {/* Footer Pages - Product */}
                      <Route path="/features" element={<FeaturesPage />} />
                      <Route path="/pricing" element={<PricingPage />} />
                      <Route path="/integrations" element={<IntegrationsPage />} />
                      <Route path="/changelog" element={<ChangelogPage />} />

                      {/* Footer Pages - Resources */}
                      <Route path="/documentation" element={<DocumentationPage />} />
                      <Route path="/tutorials" element={<TutorialsPage />} />
                      <Route path="/blog" element={<BlogPage />} />
                      <Route path="/support" element={<SupportPage />} />

                      {/* Footer Pages - Company */}
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="/careers" element={<CareersPage />} />
                      <Route path="/contact" element={<ContactPage />} />

                      {/* Legal */}
                      <Route path="/privacy" element={<PrivacyPage />} />
                      <Route path="/terms" element={<TermsPage />} />

                      {/* Protected — any logged-in user */}
                      <Route path="/dm/:id" element={<DirectMessagePage />} />
                      <Route path="/profile/edit" element={
                        <ProtectedRoute><EditProfilePage /></ProtectedRoute>
                      } />

                      {/* Protected — role-specific */}
                      <Route path="/upload" element={
                        <ProtectedRoute requiredRole="creator"><UploadPage /></ProtectedRoute>
                      } />
                      <Route path="/dashboard/creator" element={
                        <ProtectedRoute requiredRole="creator"><CreatorDashboard /></ProtectedRoute>
                      } />
                      <Route path="/dashboard/brand" element={
                        <ProtectedRoute requiredRole="brand"><BrandDashboard /></ProtectedRoute>
                      } />

                      {/* 404 catch-all */}
                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>

              </ClickSpark>
            </OnboardingProvider>
          </Router>
        </SocketProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
