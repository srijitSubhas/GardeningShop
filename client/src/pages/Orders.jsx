import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ordersAPI } from '../services/api';

const STATUS_STYLES = {
  pending: { bg: '#fff3cd', color: '#856404', label: 'PENDING' },
  shipped: { bg: '#cce5ff', color: '#004085', label: 'SHIPPED' },
  delivered: { bg: '#d4edda', color: '#155724', label: 'DELIVERED' },
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchId, setSearchId] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = useCallback(
    (orderId = '') => {
      setLoading(true);
      setError('');
      ordersAPI
        .getOrders(orderId)
        .then((res) => setOrders(res.data.orders))
        .catch(() => setError('Failed to load orders.'))
        .finally(() => setLoading(false));
    },
    []
  );

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchId(searchInput.trim());
    fetchOrders(searchInput.trim());
  };

  const handleReset = () => {
    setSearchInput('');
    setSearchId('');
    fetchOrders('');
  };

  const handleStatusUpdate = async (order_id, status) => {
    setUpdatingId(order_id);
    try {
      await ordersAPI.updateStatus(order_id, status);
      setOrders((prev) =>
        prev.map((o) => (o.order_id === order_id ? { ...o, status } : o))
      );
    } catch {
      alert('Failed to update status.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">📦 Order Delivery Status</h1>

      {/* Search bar */}
      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by Order ID (e.g. ORD-...)"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="btn btn-green">
          Search
        </button>
        {searchId && (
          <button type="button" className="btn btn-secondary" onClick={handleReset}>
            Reset
          </button>
        )}
      </form>

      {searchId && (
        <p className="search-result-label">
          Showing results for: <strong>{searchId}</strong>
        </p>
      )}

      {/* Error state */}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Loading state */}
      {loading ? (
        <div className="loading-screen">
          <div className="spinner" />
          <p>Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="empty-state">
          <p>
            No orders found.{' '}
            <Link to="/shop" className="link-green">
              Start shopping!
            </Link>
          </p>
        </div>
      ) : searchId ? (
        /* Table view for search results */
        <div className="table-wrapper">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Item</th>
                <th>Qty</th>
                <th>Status</th>
                <th>Customer</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Date</th>
                <th>Update</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.order_id}>
                  <td className="order-id-cell">{order.order_id}</td>
                  <td>{order.plant_name || 'Plant'}</td>
                  <td>{order.quantity}</td>
                  <td>
                    <StatusBadge status={order.status} />
                  </td>
                  <td>{order.customer_name}</td>
                  <td>{order.customer_email || '—'}</td>
                  <td>{order.phone || '—'}</td>
                  <td>{order.address}</td>
                  <td>{new Date(order.order_date).toLocaleDateString()}</td>
                  <td>
                    <StatusSelect
                      orderId={order.order_id}
                      current={order.status}
                      updating={updatingId === order.order_id}
                      onUpdate={handleStatusUpdate}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Card view for all orders */
        <div className="orders-grid">
          {orders.map((order) => (
            <div key={order.order_id} className="order-card">
              <h3>🌿 {order.plant_name || 'Plant Order'}</h3>
              <p>
                <span className="label">Order ID:</span>
                <code className="order-id">{order.order_id}</code>
              </p>
              <p>
                <span className="label">Qty:</span> {order.quantity}
              </p>
              <p>
                <span className="label">Customer:</span> {order.customer_name}
              </p>
              <p>
                <span className="label">Email:</span> {order.customer_email || '—'}
              </p>
              <p>
                <span className="label">Phone:</span> {order.phone || '—'}
              </p>
              <p>
                <span className="label">Address:</span> {order.address}
              </p>
              <p>
                <span className="label">Date:</span>{' '}
                {new Date(order.order_date).toLocaleDateString()}
              </p>

              <StatusBadge status={order.status} />

              <div className="order-update-row">
                <StatusSelect
                  orderId={order.order_id}
                  current={order.status}
                  updating={updatingId === order.order_id}
                  onUpdate={handleStatusUpdate}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || { bg: '#eee', color: '#333', label: status?.toUpperCase() };
  return (
    <span
      className="status-badge"
      style={{ backgroundColor: style.bg, color: style.color }}
    >
      {style.label}
    </span>
  );
}

function StatusSelect({ orderId, current, updating, onUpdate }) {
  const [selected, setSelected] = useState(current);

  const handleUpdate = () => {
    if (selected !== current) onUpdate(orderId, selected);
  };

  return (
    <div className="status-select-row">
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="status-select"
        disabled={updating}
      >
        <option value="pending">Pending</option>
        <option value="shipped">Shipped</option>
        <option value="delivered">Delivered</option>
      </select>
      <button
        className="btn btn-green btn-sm"
        onClick={handleUpdate}
        disabled={updating || selected === current}
      >
        {updating ? '...' : 'Update'}
      </button>
    </div>
  );
}
