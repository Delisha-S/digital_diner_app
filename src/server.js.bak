const express = require('express');
const router = express.Router();

// Demo in-memory menu
const menu = [
  { id: '1', name: 'Vegan Tikka Masala', price: 12.5, tags: ['vegan','dinner'], description: 'Creamy chickpea curry with rice.' },
  { id: '2', name: 'Mushroom Risotto', price: 13.0, tags: ['vegetarian','dinner'], description: 'Arborio rice, mushrooms, parmesan.' },
  { id: '3', name: 'Sweet Potato Tacos', price: 10.0, tags: ['vegan','tacos'], description: 'Spiced sweet potato, cabbage slaw.' }
];

// GET /api/menu
router.get('/menu', (req, res) => {
  res.json(menu);
});

// GET /api/menu/:id
router.get('/menu/:id', (req, res) => {
  const item = menu.find(m => m.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Item not found' });
  res.json(item);
});

// POST /api/order  (simple in-memory order handling for demo)
router.post('/order', (req, res) => {
  const { items = [], user = 'guest' } = req.body || {};
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'items array is required' });
  }

  const ordered = items.map(id => menu.find(m => m.id === id)).filter(Boolean);
  const total = ordered.reduce((s, it) => s + (it.price || 0), 0);
  const order = {
    id: `ord_${Date.now()}`,
    user,
    items: ordered,
    total,
    createdAt: new Date().toISOString()
  };

  // For demo we just return the order (no DB)
  res.status(201).json({ ok: true, order });
});

module.exports = router;
