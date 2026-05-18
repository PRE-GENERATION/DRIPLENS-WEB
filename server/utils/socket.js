import { Server } from 'socket.io';
import logger from './logger.js';

let io;

export const initSocket = (server, clientUrl) => {
  io = new Server(server, {
    cors: {
      origin: clientUrl,
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    logger.info(`Socket connection established: ${socket.id}`);
    const userId = socket.handshake.query.userId;
    
    if (userId) {
      socket.join(userId);
      logger.info(`User ${userId} connected and joined room`);
      
      // Notify others of online status
      io.emit('presence_update', { userId, status: 'online' });
    }

    socket.on('typing', ({ recipientId, requestId }) => {
      io.to(recipientId).emit('user_typing', { userId, requestId });
    });

    socket.on('stop_typing', ({ recipientId, requestId }) => {
      io.to(recipientId).emit('user_stop_typing', { userId, requestId });
    });

    socket.on('message_read', ({ recipientId, requestId, messageIds }) => {
      io.to(recipientId).emit('read_receipt', { readerId: userId, requestId, messageIds });
    });

    socket.on('disconnect', () => {
      if (userId) {
        logger.info(`User ${userId} disconnected`);
        io.emit('presence_update', { userId, status: 'offline' });
      }
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

export const emitToUser = (userId, event, data) => {
  if (io) {
    io.to(userId).emit(event, data);
  }
};
