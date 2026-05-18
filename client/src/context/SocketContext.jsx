import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { user, token } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (user && token) {
      const socketUrl = import.meta.env.PROD ? window.location.origin : (import.meta.env.VITE_API_URL || 'http://localhost:5001');
      console.log('Connecting to socket at:', socketUrl);
      
      const newSocket = io(socketUrl, {
        query: { userId: user.id },
        auth: { token },
        transports: ['websocket', 'polling'] // Ensure websocket is tried first
      });

      newSocket.on('connect', () => {
        console.log('Socket connected:', newSocket.id);
      });

      newSocket.on('connect_error', (error) => {
        console.log('Socket connection info (serverless fallback):', error.message);
      });

      setSocket(newSocket);

      return () => {
        console.log('Closing socket connection');
        newSocket.close();
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [user, token]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => {
  return useContext(SocketContext);
};
