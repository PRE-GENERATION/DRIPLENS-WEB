import logger from '../utils/logger.js';
import { AppError } from '../utils/AppError.js';
import fs from 'fs';

// Standardised error response shape — always the same, everywhere
const errorResponse = (res, statusCode, code, message) =>
  res.status(statusCode).json({
    success: false,
    error: { code, message }
  });

export const errorHandler = (err, req, res, _next) => {
  // Log every error with context
  const logEntry = JSON.stringify({
    timestamp: new Date().toISOString(),
    method:  req.method,
    url:     req.originalUrl,
    userId:  req.user?.id,
    code:    err.code,
    message: err.message,
    stack:   err.stack
  }) + '\n';
  
  try {
    fs.appendFileSync('error.log', logEntry);
  } catch (_e) {
    // ignore
  }

  logger.error('Request error', {
    method:  req.method,
    url:     req.originalUrl,
    userId:  req.user?.id,
    code:    err.code,
    message: err.message,
    stack:   process.env.NODE_ENV !== 'production' ? err.stack : undefined
  });

  if (err instanceof AppError && err.isOperational) {
    return errorResponse(res, err.statusCode, err.code, err.message);
  }

  // Unknown / programmer errors — never leak internals
  return errorResponse(res, 500, 'INTERNAL_ERROR',
    process.env.NODE_ENV === 'production'
      ? 'Something went wrong. Please try again.'
      : err.message
  );
};
