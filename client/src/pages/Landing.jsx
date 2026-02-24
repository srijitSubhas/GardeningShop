import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function Landing() {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (user) return <Navigate to="/shop" replace />;

  return (
    <div className="landing-page">
      <div className="hero">
        <h1>🌿 Welcome to Plant Shop</h1>
        <p>Discover beautiful plants and saplings for your home and garden.</p>

        <div className="hero-buttons">
          <Link to="/login" className="btn btn-primary">
            Log In
          </Link>
          <Link to="/signup" className="btn btn-outline">
            Sign Up
          </Link>
        </div>

        <Link to="/shop" className="btn btn-green hero-browse">
          Browse Plants →
        </Link>
      </div>

      <div className="features">
        <div className="feature-card">
          <div className="feature-icon">🌱</div>
          <h3>Wide Selection</h3>
          <p>Browse hundreds of plants from tropical to succulents.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🚚</div>
          <h3>Fast Delivery</h3>
          <p>Get your plants delivered fresh to your doorstep.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📦</div>
          <h3>Track Orders</h3>
          <p>Monitor your orders from placement to delivery.</p>
        </div>
      </div>
    </div>
  );
}
