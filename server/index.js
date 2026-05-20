import './config/env.js';                     // Validate env vars before anything else

import express    from 'express';
import helmet     from 'helmet';
import cors       from 'cors';
import v1Routes   from './routes/v1/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { supabase }     from './utils/supabase.js';
import logger           from './utils/logger.js';
import { createServer } from 'http';
import { initSocket }  from './utils/socket.js';
import { env, envError } from './config/env.js';

const app = express();

// Intercept all requests if environment variables are misconfigured
app.use((req, res, next) => {
  if (envError) {
    return res.status(500).json({
      success: false,
      error: {
        code: 'MISCONFIGURED_ENVIRONMENT',
        message: 'The server environment variables are missing or misconfigured on Vercel. Please configure them in your Vercel Project Settings.',
        details: envError
      }
    });
  }
  next();
});

const httpServer = createServer(app);

// Initialize Socket.io
initSocket(httpServer, env.CLIENT_URL);

// ── Security headers ──────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

// ── CORS — whitelist only your client URL ─────────────────────
app.use(cors({
  origin: env.CLIENT_URL === '*' ? true : [env.CLIENT_URL, 'http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ── Body parsing ──────────────────────────────────────────────
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ extended: true, limit: '500mb' }));
import path from 'path';
app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

// ── API routes ────────────────────────────────────────────────
app.use('/api/v1', v1Routes);

// ── Health check — actually tests Supabase connectivity ───────
app.get('/api/health', async (req, res) => {
  try {
    await supabase.from('profiles').select('id').limit(1);
    res.json({ status: 'ok', db: 'connected', timestamp: new Date().toISOString() });
  } catch {
    res.status(503).json({ status: 'degraded', db: 'unreachable', timestamp: new Date().toISOString() });
  }
});

// ── 404 handler ───────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: `Route ${req.method} ${req.path} not found` } });
});

// ── Global error handler (must be last) ──────────────────────
app.use(errorHandler);

// ── Boot ──────────────────────────────────────────────────────
const PORT = env.PORT;
if (!process.env.VERCEL && process.env.NODE_ENV !== 'test') {
  httpServer.listen(PORT, () => {
    logger.info(`Server started`, { port: PORT, env: env.NODE_ENV });
  });
}


export default app; // needed for supertest in tests and Vercel serverless functions

process.on('exit', (code) => {
  console.log(`Process exiting with code: ${code}`);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});


process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Workaround for mysterious exit with code 0 (only local dev)
if (!process.env.VERCEL) {
  setInterval(() => {}, 1000);
}


