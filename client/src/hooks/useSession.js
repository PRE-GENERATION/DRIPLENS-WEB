import { useAuth } from '../context/AuthContext';

/**
 * A bridge hook to match the NextAuth-like session structure requested.
 * In a real Next.js app, this would come from next-auth/react.
 */
export function useSession() {
  const { user, loading, logout } = useAuth();
  
  const status = loading ? 'loading' : user ? 'authenticated' : 'unauthenticated';

  // Badge counts — will come from a real-time store or API later
  const counts = {
    newApplications: 0,
    unreadMessages: 0,
    newOpportunities: 0
  };

  const session = user ? {
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      verified: user.verified || false,
      username: user.username,
      image: user.avatar_url,
      counts // Attachment for badges
    }
  } : null;

  return {
    data: session,
    status,
    logout
  };
}
