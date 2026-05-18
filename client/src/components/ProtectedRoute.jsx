import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, requiredRole }) {
  const { isLoggedIn, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Not logged in → send to auth, remember where they came from
  if (!isLoggedIn) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Logged in but onboarding not done → send to onboarding
  // (skip this check if they're already on the onboarding page)
  if (
    user?.role === 'creator' &&
    !user?.onboarding_complete &&
    !location.pathname.startsWith('/onboarding')
  ) {
    return <Navigate to="/onboarding/step-1" replace />;
  }

  // Wrong role for this route → send to their dashboard
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to={`/dashboard/${user?.role}`} replace />;
  }

  return children;
}
