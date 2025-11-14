// services/aiProvider.js
const axios = require('axios');

class AIService {
  constructor({ apiKey, providerUrl, timeoutMs = 30000 }) {
    if (!apiKey) {
      if (process.env.NODE_ENV === 'production') {
        throw new Error('AI provider key missing');
      }
    }
    this.apiKey = apiKey;
    this.providerUrl = providerUrl || 'https://api.openai.com/v1/chat/completions';
    this.timeoutMs = timeoutMs;
  }

  async sendPrompt({ prompt, userId, extra }) {
    const start = Date.now();
    try {
      const body = {
        model: process.env.AI_MODEL || 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        ...extra,
      };

      const headers = {
        'Content-Type': 'application/json',
      };
      if (this.apiKey) headers['Authorization'] = `Bearer ${this.apiKey}`;

      const res = await axios.post(this.providerUrl, body, { headers, timeout: this.timeoutMs });

      const text = this._extractTextFromProviderResponse(res.data);
      const meta = {
        provider: 'openai',
        provider_response: { status: res.status },
        latencyMs: Date.now() - start,
      };
      const id = res.data.id || `r-${Date.now()}`;

      return { id, text, meta };
    } catch (err) {
      if (err.response) {
        const status = err.response.status;
        const body = err.response.data;
        const message = body?.error?.message || err.message;
        const code = this._mapStatusToCode(status);
        const e = new ProviderError(code, message, status);
        e.providerBody = body;
        throw e;
      } else if (err.code === 'ECONNABORTED') {
        throw new ProviderError('timeout', 'Provider timeout', 504);
      } else {
        throw new ProviderError('network_error', err.message || 'Network error', 502);
      }
    }
  }

  _mapStatusToCode(status) {
    if (status === 401 || status === 403) return 'auth_error';
    if (status === 429) return 'rate_limited';
    if (status >= 500) return 'provider_error';
    return 'provider_error';
  }

  _extractTextFromProviderResponse(data) {
    try {
      if (data?.choices && data.choices.length > 0) {
        const choice = data.choices[0];
        if (choice.message?.content) return choice.message.content;
        if (choice.text) return choice.text;
      }
      if (typeof data === 'string') return data;
      return JSON.stringify(data);
    } catch {
      return '';
    }
  }
}

class ProviderError extends Error {
  constructor(code, message, status = 500) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

module.exports = AIService;
