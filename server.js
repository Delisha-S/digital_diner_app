require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const aiRouter = require('./routes/ai');
const { errorHandler } = require('./middleware/errorHandler');
const logger = require('./lib/logger');

// Configure allowed origins (add any dev origins here)
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:4000',
  'http://10.0.2.2:4000',
  'http://127.0.0.1:4000',
];

const app = express();
app.use(helmet());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('combined', { stream: logger.stream })); // http logging

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error('CORS not allowed'));
  },
  credentials: true,
}));

app.use('/api/ai', aiRouter);

app.get('/health', (req, res) => res.json({ ok: true, env: process.env.NODE_ENV }));

app.use(errorHandler);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  logger.info(`Server started on port ${port} (env=${process.env.NODE_ENV})`);
});
