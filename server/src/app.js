require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Route imports
const authRoutes = require('./routes/authRoutes');
const plantRoutes = require('./routes/plantRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';
const isProduction = process.env.NODE_ENV === 'production';

const parseBoolean = (value, defaultValue = false) => {
  if (value === undefined || value === null || value === '') return defaultValue;
  return String(value).toLowerCase() === 'true';
};

const trustProxyRaw = process.env.TRUST_PROXY;
const trustProxySetting =
  trustProxyRaw === undefined || trustProxyRaw === ''
    ? (isProduction ? 1 : false)
    : (Number.isNaN(Number(trustProxyRaw)) ? trustProxyRaw : Number(trustProxyRaw));

const normalizeOrigin = (origin = '') => origin.trim().replace(/\/$/, '');
const envOrigins = (process.env.CLIENT_ORIGIN || '')
  .split(',')
  .map(normalizeOrigin)
  .filter(Boolean);

const allowedOrigins = new Set([
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  ...envOrigins,
]);

if (trustProxySetting !== false) {
  // Required when app is behind a proxy and secure cookies are enabled.
  app.set('trust proxy', trustProxySetting);
}

const sessionSameSite = (process.env.SESSION_COOKIE_SAMESITE || (isProduction ? 'none' : 'lax')).toLowerCase();
const sessionSecureDefault = isProduction ? 'auto' : false;
const sessionSecure = process.env.SESSION_COOKIE_SECURE === undefined
  ? sessionSecureDefault
  : (process.env.SESSION_COOKIE_SECURE.toLowerCase() === 'auto'
      ? 'auto'
      : parseBoolean(process.env.SESSION_COOKIE_SECURE));

const sessionCookieConfig = {
  httpOnly: true,
  secure: sessionSecure,
  sameSite: sessionSameSite,
  maxAge: 1000 * 60 * 60 * 24, // 24 hours
};

if (process.env.SESSION_COOKIE_DOMAIN) {
  sessionCookieConfig.domain = process.env.SESSION_COOKIE_DOMAIN;
}

// ─── Middleware ───────────────────────────────────────────────────────────────

// CORS: allow requests from the React dev server
app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser tools (no Origin header) and configured browser origins.
      if (!origin || allowedOrigins.has(normalizeOrigin(origin))) {
        return callback(null, true);
      }
      return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true, // allow cookies/sessions
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(
  session({
    name: process.env.SESSION_COOKIE_NAME || 'connect.sid',
    secret: process.env.SESSION_SECRET || 'plant_shop_secret',
    resave: false,
    saveUninitialized: false,
    proxy: trustProxySetting !== false,
    cookie: sessionCookieConfig,
  })
);

// ─── API Routes ───────────────────────────────────────────────────────────────

app.use('/api/auth', authRoutes);
app.use('/api/plants', plantRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// ─── Health Check ─────────────────────────────────────────────────────────────

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Serve React client when a built bundle is available ─────────────────────

const clientBuildPath = path.join(__dirname, '../../server/public');
const clientIndexPath = path.join(clientBuildPath, 'index.html');
const shouldServeClient = process.env.SERVE_CLIENT !== 'false' && fs.existsSync(clientIndexPath);

if (shouldServeClient) {
  app.use(express.static(clientBuildPath));

  // All non-API routes serve the React app.
  app.get('*', (req, res) => {
    res.sendFile(clientIndexPath);
  });
}

// ─── 404 Handler (API only in dev) ───────────────────────────────────────────

app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});

// ─── Global Error Handler ────────────────────────────────────────────────────

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Something went wrong on the server.' });
});

// ─── Start Server ─────────────────────────────────────────────────────────────

app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running at http://${HOST}:${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   API Base:    http://localhost:${PORT}/api`);
});

module.exports = app;
