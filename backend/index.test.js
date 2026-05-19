const request = require('supertest');
const app = require('./index');

describe('GET /api/menu', () => {
  it('returns all 12 menu items', async () => {
    const res = await request(app).get('/api/menu');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(12);
  });

  it('each item has required fields', async () => {
    const res = await request(app).get('/api/menu');
    res.body.forEach(item => {
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('name');
      expect(item).toHaveProperty('category');
      expect(item).toHaveProperty('price');
      expect(item).toHaveProperty('description');
      expect(item).toHaveProperty('image');
    });
  });
});

describe('POST /api/parse-order', () => {
  it('returns 400 without message', async () => {
    const res = await request(app).post('/api/parse-order').send({});
    expect(res.status).toBe(400);
  });

  it('parses adding items with quantities', async () => {
    const res = await request(app).post('/api/parse-order')
      .send({ message: 'Add two spicy chicken sandwiches and a sparkling water' });
    expect(res.body.intent).toBe('add');
    expect(res.body.actions).toHaveLength(2);
    expect(res.body.actions[0].item.name).toBe('Spicy Chicken Sandwich');
    expect(res.body.actions[0].quantity).toBe(2);
    expect(res.body.actions[1].item.name).toBe('Sparkling Water');
    expect(res.body.actions[1].quantity).toBe(1);
  });

  it('parses remove intent', async () => {
    const res = await request(app).post('/api/parse-order')
      .send({ message: 'remove the caesar salad' });
    expect(res.body.intent).toBe('remove');
    expect(res.body.actions[0].type).toBe('remove');
    expect(res.body.actions[0].item.name).toBe('Caesar Salad');
  });

  it('parses clear cart', async () => {
    const res = await request(app).post('/api/parse-order')
      .send({ message: 'clear my cart' });
    expect(res.body.intent).toBe('clear');
    expect(res.body.actions[0].type).toBe('clear');
  });

  it('handles greeting', async () => {
    const res = await request(app).post('/api/parse-order')
      .send({ message: 'hello' });
    expect(res.body.intent).toBe('greeting');
    expect(res.body.actions).toHaveLength(0);
  });

  it('handles unknown input gracefully', async () => {
    const res = await request(app).post('/api/parse-order')
      .send({ message: 'asdfghjkl' });
    expect(res.body.intent).toBe('unknown');
    expect(res.body.reply).toBeDefined();
  });

  it('parses multi-item complex order', async () => {
    const res = await request(app).post('/api/parse-order')
      .send({ message: 'I want a truffle burger, caesar salad and three espressos' });
    expect(res.body.actions.length).toBeGreaterThanOrEqual(3);
    const espresso = res.body.actions.find(a => a.item.name === 'Espresso');
    expect(espresso.quantity).toBe(3);
  });
});
