require('dotenv').config();

const OPENAI_KEY = process.env.OPENAI_API_KEY;
const OPENAI_URL = process.env.OPENAI_API_URL || "https://api.openai.com/v1/chat/completions";
const USE_MOCK = process.env.USE_MOCK_AI === 'true';

if (!USE_MOCK && !OPENAI_KEY) {
  console.warn("OPENAI_API_KEY is not set. Set it in .env for real OpenAI calls or set USE_MOCK_AI=true.");
}

async function callOpenAIChat(messages, options = {}) {
  if (USE_MOCK) {
    // deterministic canned responses for presentation/demo
    const userMsg = (messages.find(m => m.role === 'user') || {}).content || '';
    // simple canned logic: if 'special' mention return specials, else generic reply
    if (/special/i.test(userMsg)) {
      return { answer: "Today's specials: 1) Vegan Tikka Masala 2) Mushroom Risotto 3) Sweet Potato Tacos. Short reasons included.", raw: { mocked: true } };
    }
    if (/recommend/i.test(userMsg)) {
      return { answer: "Recommendation: 3 vegetarian dinners — 1) Chickpea Curry (easy & protein), 2) Veggie Stir-Fry (fast & colorful), 3) Lentil Shepherd's Pie (hearty & warm).", raw: { mocked: true } };
    }
    return { answer: "Mock AI: I received your question and would respond here with a concise helpful answer.", raw: { mocked: true } };
  }

  if (typeof fetch === "undefined") {
    throw new Error("fetch is not available in this Node runtime. Use Node >=18 or install node-fetch.");
  }

  const body = {
    model: options.model || "gpt-4o-mini",
    messages,
    temperature: options.temperature ?? 0.7,
    max_tokens: options.maxTokens ?? 700,
  };

  const res = await fetch(OPENAI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`OpenAI error ${res.status}: ${txt}`);
  }

  const json = await res.json();
  const content =
    (json.choices && json.choices[0] && json.choices[0].message && json.choices[0].message.content) ||
    json?.answer ||
    JSON.stringify(json);
  return { answer: content, raw: json };
}

module.exports = { callOpenAIChat };
