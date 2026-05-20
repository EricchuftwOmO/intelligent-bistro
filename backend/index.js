const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());

const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

const menu = [
  { id: 1, name: 'Spicy Chicken Sandwich', category: 'Mains', price: 12.99, description: 'Crispy chicken with sriracha mayo, pickled jalapeños & slaw', image: '🍔' },
  { id: 2, name: 'Truffle Mushroom Burger', category: 'Mains', price: 15.99, description: 'Wagyu beef, truffle aioli, sautéed mushrooms & gruyère', image: '🍔' },
  { id: 3, name: 'Grilled Salmon Bowl', category: 'Mains', price: 18.99, description: 'Atlantic salmon, quinoa, avocado, edamame & miso dressing', image: '🐟' },
  { id: 4, name: 'Margherita Flatbread', category: 'Mains', price: 11.99, description: 'San Marzano tomato, fresh mozzarella, basil & olive oil', image: '🍕' },
  { id: 5, name: 'Caesar Salad', category: 'Starters', price: 9.99, description: 'Romaine, parmesan crisps, croutons & house-made dressing', image: '🥗' },
  { id: 6, name: 'Truffle Fries', category: 'Starters', price: 7.99, description: 'Hand-cut fries, truffle oil, parmesan & fresh herbs', image: '🍟' },
  { id: 7, name: 'Soup of the Day', category: 'Starters', price: 6.99, description: 'Chef\'s daily creation served with artisan bread', image: '🍲' },
  { id: 8, name: 'Sparkling Water', category: 'Drinks', price: 3.99, description: 'San Pellegrino 500ml', image: '💧' },
  { id: 9, name: 'Fresh Lemonade', category: 'Drinks', price: 4.99, description: 'House-squeezed with mint & honey', image: '🍋' },
  { id: 10, name: 'Espresso', category: 'Drinks', price: 3.49, description: 'Double shot, single origin beans', image: '☕' },
  { id: 11, name: 'Chocolate Lava Cake', category: 'Desserts', price: 9.99, description: 'Warm dark chocolate cake with vanilla gelato', image: '🍫' },
  { id: 12, name: 'Crème Brûlée', category: 'Desserts', price: 8.99, description: 'Classic vanilla custard with caramelized sugar', image: '🍮' },
];

// GET menu
app.get('/api/menu', (req, res) => {
  res.json(menu);
});

// NLP order processing
app.post('/api/parse-order', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message required' });

  try {
    const result = genAI
      ? await parseOrderWithAI(message)
      : parseOrderFallback(message.toLowerCase());
    res.json(result);
  } catch (err) {
    console.error('AI parse error:', err.message);
    res.json(parseOrderFallback(message.toLowerCase()));
  }
});

async function parseOrderWithAI(text) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const menuSummary = menu.map(i => `id:${i.id} "${i.name}" $${i.price} (${i.category})`).join('\n');

  const prompt = `You are a restaurant order assistant for "The Intelligent Bistro".

Menu:
${menuSummary}

User said: "${text}"

Respond with ONLY valid JSON (no markdown, no code fences):
{
  "intent": "add" | "remove" | "clear" | "update" | "query" | "greeting" | "unknown",
  "actions": [{"type": "add"|"remove"|"update"|"clear", "itemId": <number>, "quantity": <number>}],
  "reply": "<friendly response to the user>"
}

Rules:
- For "clear" intent, actions should be [{"type":"clear","itemId":0,"quantity":0}]
- For "query" or "greeting" or "unknown", actions should be []
- Always include a friendly reply
- Match items by name similarity, be flexible with spelling`;

  const result = await model.generateContent(prompt);
  const responseText = result.response.text().trim();
  const parsed = JSON.parse(responseText);

  // Attach full item objects
  parsed.actions = (parsed.actions || []).map(a => ({
    ...a,
    item: menu.find(m => m.id === a.itemId) || null
  })).filter(a => a.type === 'clear' || a.item);

  return parsed;
}

function parseOrderFallback(text) {
  // Detect intent
  const removePatterns = /\b(remove|delete|cancel|take off|drop)\b/;
  const clearPatterns = /\b(clear|empty|reset|start over)\b/;
  const modifyPatterns = /\b(change|update|modify|make it|switch)\b/;
  const quantityWords = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, a: 1, an: 1 };

  if (clearPatterns.test(text)) {
    return { intent: 'clear', actions: [{ type: 'clear' }], reply: "Done! I've cleared your cart. Ready to start fresh?" };
  }

  const actions = [];
  const isRemove = removePatterns.test(text);
  const isModify = modifyPatterns.test(text);

  for (const item of menu) {
    const nameLower = item.name.toLowerCase();
    const nameWords = nameLower.split(' ');
    // Match if 2+ consecutive words from item name appear, or full name
    const matched = nameLower.split(' ').length <= 2
      ? text.includes(nameLower) || text.includes(nameWords[nameWords.length - 1])
      : nameWords.filter(w => w.length > 3 && text.includes(w)).length >= 2 || text.includes(nameLower);

    if (matched) {
      // Extract quantity near the item mention
      let quantity = 1;
      const qMatch = text.match(new RegExp(`(\\d+|${Object.keys(quantityWords).join('|')})\\s+(?:\\w+\\s+){0,3}${nameWords[nameWords.length - 1]}`));
      if (qMatch) {
        quantity = parseInt(qMatch[1]) || quantityWords[qMatch[1]] || 1;
      }

      if (isRemove) {
        actions.push({ type: 'remove', item, quantity });
      } else {
        actions.push({ type: 'add', item, quantity });
      }
    }
  }

  // Check for quantity modification like "make it 3"
  if (isModify && actions.length > 0) {
    const qMatch = text.match(/(\d+)/);
    if (qMatch) {
      actions.forEach(a => { a.type = 'update'; a.quantity = parseInt(qMatch[1]); });
    }
  }

  if (actions.length === 0) {
    // Try to give helpful response
    if (/\b(menu|what do you have|options|recommend)\b/.test(text)) {
      return { intent: 'query', actions: [], reply: "Here's our menu! We have Mains, Starters, Drinks, and Desserts. Try saying something like 'Add two spicy chicken sandwiches and a lemonade'." };
    }
    if (/\b(hi|hello|hey|help)\b/.test(text)) {
      return { intent: 'greeting', actions: [], reply: "Hello! I'm your AI bistro assistant. You can order by saying things like 'I'd like a truffle burger and fries' or 'Add 2 espressos'. How can I help?" };
    }
    return { intent: 'unknown', actions: [], reply: "I couldn't find that on our menu. Try asking for items like 'Spicy Chicken Sandwich', 'Truffle Fries', or 'Fresh Lemonade'." };
  }

  const reply = actions.map(a => {
    if (a.type === 'remove') return `Removed ${a.quantity}x ${a.item.name}`;
    if (a.type === 'update') return `Updated ${a.item.name} to ${a.quantity}`;
    return `Added ${a.quantity}x ${a.item.name} ($${(a.item.price * a.quantity).toFixed(2)})`;
  }).join(', ') + '. Anything else?';

  return { intent: isRemove ? 'remove' : 'add', actions, reply };
}

const PORT = process.env.PORT || 4000;
if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
}
module.exports = app;
