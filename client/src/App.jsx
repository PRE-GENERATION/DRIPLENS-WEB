import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import ExplorePage from './pages/ExplorePage';
import CreatorProfilePage from './pages/CreatorProfilePage';
import CreatorDashboard from './pages/CreatorDashboard';
import BrandDashboard from './pages/BrandDashboard';
import MessagingPage from './pages/MessagingPage';
import ClickSpark from './components/ClickSpark';

function App() {
  return (
    <Router>
      <ClickSpark sparkColor="#000000" sparkSize={10} sparkRadius={15} sparkCount={8} duration={400}>
        <div className="min-h-screen flex flex-col bg-white text-[#555555]">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/profile/:id" element={<CreatorProfilePage />} />
              <Route path="/dashboard/creator" element={<CreatorDashboard />} />
              <Route path="/dashboard/brand" element={<BrandDashboard />} />
              <Route path="/messages" element={<MessagingPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </ClickSpark>
    </Router>
  );
}

export default App;
