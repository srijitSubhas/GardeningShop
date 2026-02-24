import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  if (!user) return null; // Don't show navbar on public pages

  return (
    <nav className="navbar">
      <div className="navbar-brand">🌿 Plant Shop</div>

      <div className="navbar-links">
        <Link
          to="/shop"
          className={`nav-link ${isActive('/shop') ? 'active' : ''}`}
        >
          🏪 Shop
        </Link>
        <Link
          to="/orders"
          className={`nav-link ${isActive('/orders') ? 'active' : ''}`}
        >
          📦 Orders
        </Link>
      </div>

      <div className="navbar-user">
        <span className="user-email">👤 {user.name || user.email}</span>
        <button onClick={handleLogout} className="logout-btn">
          Sign Out
        </button>
      </div>
    </nav>
  );
}
