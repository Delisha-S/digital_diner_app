// utils/contentFilter.js - simple local content filter (very basic)
const bannedTokens = ['ssn', 'credit card', 'password', 'kill', 'terror'];

function checkPrompt(prompt) {
  if (!prompt || typeof prompt !== 'string') return null;
  const lowered = prompt.toLowerCase();
  for (const token of bannedTokens) {
    if (lowered.includes(token)) {
      return { reason: 'banned_token', token };
    }
  }
  return null;
}

module.exports = { checkPrompt };
