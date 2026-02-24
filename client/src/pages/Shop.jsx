import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { plantsAPI, ordersAPI } from '../services/api';

const GRADIENTS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
];

export default function Shop() {
  const navigate = useNavigate();

  // Plants
  const [plants, setPlants] = useState([]);
  const [plantsLoading, setPlantsLoading] = useState(true);
  const [plantsError, setPlantsError] = useState('');

  // Cart (local state — items selected this session)
  const [cartItems, setCartItems] = useState([]);

  // Order form
  const [orderForm, setOrderForm] = useState({
    customer_name: '',
    customer_email: '',
    address: '',
    phone: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState('');
  const [orderError, setOrderError] = useState('');

  useEffect(() => {
    plantsAPI
      .getAll()
      .then((res) => setPlants(res.data.plants))
      .catch(() => setPlantsError('Failed to load plants. Please refresh.'))
      .finally(() => setPlantsLoading(false));
  }, []);

  // ── Cart Handlers ─────────────────────────────────────────────────────────

  const addToCart = (plant, quantity) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.plant_id === plant.id);
      if (existing) {
        return prev.map((i) =>
          i.plant_id === plant.id
            ? { ...i, quantity: i.quantity + quantity, total: (i.quantity + quantity) * i.price }
            : i
        );
      }
      return [
        ...prev,
        {
          id: Date.now(),
          plant_id: plant.id,
          name: plant.name,
          price: plant.price,
          quantity,
          total: plant.price * quantity,
        },
      ];
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  const cartTotal = cartItems.reduce((sum, i) => sum + i.total, 0);

  // ── Order Submission ──────────────────────────────────────────────────────

  const handleOrderFormChange = (e) => {
    setOrderForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setOrderError('');
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      setOrderError('Your cart is empty.');
      return;
    }
    setSubmitting(true);
    setOrderError('');
    setOrderSuccess('');
    try {
      await ordersAPI.placeBulkOrder({
        ...orderForm,
        items: cartItems.map(({ plant_id, quantity }) => ({ plant_id, quantity })),
      });
      setOrderSuccess(`✅ Order placed successfully for ${cartItems.length} item(s)!`);
      setCartItems([]);
      setOrderForm({ customer_name: '', customer_email: '', address: '', phone: '' });
      setTimeout(() => navigate('/orders'), 1500);
    } catch (err) {
      setOrderError(err.response?.data?.error || 'Failed to place order.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  if (plantsLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p>Loading plants...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="page-title">🌿 Our Plants</h1>

      {plantsError && <div className="alert alert-error">{plantsError}</div>}

      {/* Plants Grid */}
      <div className="plants-grid">
        {plants.map((plant, idx) => (
          <PlantCard
            key={plant.id}
            plant={plant}
            gradient={GRADIENTS[idx % GRADIENTS.length]}
            onAdd={addToCart}
          />
        ))}
      </div>

      {/* Cart Section */}
      <div className="cart-section">
        <h2>🛒 Your Cart {cartItems.length > 0 && `(${cartItems.length} items)`}</h2>

        {cartItems.length === 0 ? (
          <p className="empty-cart">Your cart is empty. Add some plants above!</p>
        ) : (
          <>
            <div className="cart-grid">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-info">
                    <p className="cart-item-name">{item.name}</p>
                    <p className="cart-item-detail">Qty: {item.quantity}</p>
                    <p className="cart-item-detail">Price: ${Number(item.price).toFixed(2)}</p>
                    <p className="cart-item-total">Total: ${Number(item.total).toFixed(2)}</p>
                  </div>
                  <button className="btn-remove" onClick={() => removeFromCart(item.id)}>
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <strong>Cart Total: ${cartTotal.toFixed(2)}</strong>
            </div>

            {/* Order Details Form */}
            <form className="order-form" onSubmit={handleSubmitOrder}>
              <h3>Delivery Details</h3>

              {orderError && <div className="alert alert-error">{orderError}</div>}
              {orderSuccess && <div className="alert alert-success">{orderSuccess}</div>}

              <div className="order-form-grid">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    name="customer_name"
                    type="text"
                    required
                    placeholder="Your name"
                    value={orderForm.customer_name}
                    onChange={handleOrderFormChange}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    name="customer_email"
                    type="email"
                    required
                    placeholder="Your email"
                    value={orderForm.customer_email}
                    onChange={handleOrderFormChange}
                  />
                </div>
                <div className="form-group">
                  <label>Delivery Address</label>
                  <input
                    name="address"
                    type="text"
                    required
                    placeholder="Full address"
                    value={orderForm.address}
                    onChange={handleOrderFormChange}
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    name="phone"
                    type="tel"
                    required
                    placeholder="Contact number"
                    value={orderForm.phone}
                    onChange={handleOrderFormChange}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-green btn-full"
                disabled={submitting}
              >
                {submitting ? 'Placing Order...' : `Place Order (${cartItems.length} item${cartItems.length !== 1 ? 's' : ''})`}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

// ── PlantCard Sub-component ────────────────────────────────────────────────

function PlantCard({ plant, gradient, onAdd }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    onAdd(plant, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="plant-card" style={{ background: gradient }}>
      <h3 className="plant-name">{plant.name}</h3>
      <p className="plant-desc">{plant.description}</p>
      <div className="plant-price">${Number(plant.price).toFixed(2)}</div>

      <form className="plant-add-form" onSubmit={handleAdd}>
        <input
          type="number"
          min="1"
          value={qty}
          onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
          className="qty-input"
        />
        <button type="submit" className="btn-add-to-cart">
          {added ? '✓ Added!' : 'Add to Cart'}
        </button>
      </form>
    </div>
  );
}
