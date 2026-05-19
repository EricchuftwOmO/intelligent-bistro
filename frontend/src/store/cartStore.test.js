const { useCartStore } = require('./cartStore');

const mockItem = { id: 1, name: 'Test Burger', price: 10.00 };
const mockItem2 = { id: 2, name: 'Test Fries', price: 5.00 };

beforeEach(() => {
  useCartStore.getState().clearCart();
});

describe('Cart Store', () => {
  it('starts empty', () => {
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('adds an item', () => {
    useCartStore.getState().addItem(mockItem, 1);
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].quantity).toBe(1);
  });

  it('increments quantity for duplicate item', () => {
    useCartStore.getState().addItem(mockItem, 1);
    useCartStore.getState().addItem(mockItem, 2);
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].quantity).toBe(3);
  });

  it('removes an item', () => {
    useCartStore.getState().addItem(mockItem, 1);
    useCartStore.getState().removeItem(1);
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('updates quantity', () => {
    useCartStore.getState().addItem(mockItem, 1);
    useCartStore.getState().updateQuantity(1, 5);
    expect(useCartStore.getState().items[0].quantity).toBe(5);
  });

  it('removes item when quantity set to 0', () => {
    useCartStore.getState().addItem(mockItem, 1);
    useCartStore.getState().updateQuantity(1, 0);
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('calculates total correctly', () => {
    useCartStore.getState().addItem(mockItem, 2);
    useCartStore.getState().addItem(mockItem2, 3);
    expect(useCartStore.getState().getTotal()).toBe(35.00);
  });

  it('calculates item count correctly', () => {
    useCartStore.getState().addItem(mockItem, 2);
    useCartStore.getState().addItem(mockItem2, 3);
    expect(useCartStore.getState().getItemCount()).toBe(5);
  });

  it('clears cart', () => {
    useCartStore.getState().addItem(mockItem, 2);
    useCartStore.getState().addItem(mockItem2, 1);
    useCartStore.getState().clearCart();
    expect(useCartStore.getState().items).toHaveLength(0);
  });
});
