// routes/ai.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const AIService = require('../services/aiProvider');
const auth = require('../middleware/auth'); // optional; uncomment to enforce auth
const rateLimiter = require('../middleware/rateLimiter');
const contentFilter = require('../utils/contentFilter');
const logger = require('../lib/logger');

const router = express.Router();

const useRealAI = process.env.FEATURE_AI === 'true';

router.post('/',
  rateLimiter,
  // auth,
  body('prompt').isString().isLength({ min: 1, max: 5000 }),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: { code: 'invalid_request', message: 'Invalid request', details: errors.array() } });
      }

      const { prompt, userId, extra } = req.body;

      const violation = contentFilter.checkPrompt(prompt);
      if (violation) {
        logger.warn('Prompt blocked by content filter', { userId, violation });
        return res.status(400).json({ error: { code: 'content_blocked', message: 'Prompt violates policy', details: violation } });
      }

      if (!useRealAI) {
        return res.json({ id: 'mock-1', text: `MOCK reply to: ${prompt}`, meta: { mock: true } });
      }

      const aiService = new AIService({
        apiKey: process.env.AI_PROVIDER_KEY,
        providerUrl: process.env.AI_PROVIDER_URL,
        timeoutMs: Number(process.env.AI_TIMEOUT_MS || 30000),
      });

      const result = await aiService.sendPrompt({ prompt, userId, extra });

      logger.info('AI call success', { userId, responseId: result.id, latencyMs: result.meta?.latencyMs });

      return res.json({ id: result.id, text: result.text, meta: result.meta || {} });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
