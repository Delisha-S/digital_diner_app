 // middleware/errorHandler.js - centralized error handling
 const logger = require('../lib/logger');

 function errorHandler(err, req, res, next) {
   logger.error('Unhandled error', { message: err?.message, stack: err?.stack, code: err?.code, status: err?.status });

   // If it's a provider error with a status property
   if (err && err.status) {
     const status = err.status || 500;
     const code = err.code || 'server_error';
     const message = err.message || 'Server error';
     return res.status(status).json({ error: { code, message } });
   }

   // Generic fallback
   res.status(500).json({ error: { code: 'server_error', message: 'Internal server error' } });
 }

 module.exports = { errorHandler };
