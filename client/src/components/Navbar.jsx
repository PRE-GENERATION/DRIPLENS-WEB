import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="border-b border-[#E5E5E5] bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="font-heading font-bold text-2xl tracking-tighter text-black uppercase">
              Driplens
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/explore" className="text-sm font-medium hover:text-black transition-colors">
              Explore
            </Link>
            <Link to="/auth" className="btn-secondary text-sm">
              Log in
            </Link>
            <Link to="/auth?mode=register" className="btn-primary text-sm">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
