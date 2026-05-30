# 🌿 Plant Shop — Full Stack MVC Application

A full-stack plant shop application built with **Node.js (Express)** on the backend and **React (Vite)** on the frontend, following the **Model-View-Controller (MVC)** architecture.

---

## 📁 Project Structure

```
SuageManagement/
├── server/                        # Node.js Express backend (API)
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js              # MySQL connection pool
│   │   ├── models/                # MODEL layer — DB access
│   │   │   ├── Customer.js
│   │   │   ├── Plant.js
│   │   │   ├── Cart.js
│   │   │   └── Order.js
│   │   ├── controllers/           # CONTROLLER layer — business logic
│   │   │   ├── authController.js
│   │   │   ├── plantController.js
│   │   │   ├── cartController.js
│   │   │   └── orderController.js
│   │   ├── routes/                # Route definitions
│   │   │   ├── authRoutes.js
│   │   │   ├── plantRoutes.js
│   │   │   ├── cartRoutes.js
│   │   │   └── orderRoutes.js
│   │   ├── middleware/
│   │   │   └── auth.js            # Session authentication middleware
│   │   └── app.js                 # Express app entry point
│   ├── .env                       # Environment variables
│   └── package.json
│
├── client/                        # React frontend (VIEW layer)
│   ├── src/
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # Global auth state
│   │   ├── services/
│   │   │   └── api.js             # Axios API client
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Shop.jsx
│   │   │   └── Orders.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── db_setup.sql                   # Database schema
├── Dockerfile                     # Production Docker build
├── package.json                   # Root scripts
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MySQL 8+

### 1. Database Setup

```sql
-- Create the database and tables (see db_setup.sql)
mysql -u root -p < db_setup.sql
```

### 2. Configure Environment

Edit `server/.env`:
```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=plant_shop
SESSION_SECRET=your_secret_key
PORT=3001
```

### 3. Install Dependencies

```bash
npm run install:all
```

### 4. Run in Development Mode

```bash
npm run dev
```

This starts:
- **Server** at `http://localhost:3001`
- **Client** at `http://localhost:3000` (proxies `/api` → server)

### 5. Run in Production / Coolify

```bash
npm start
```

This builds the React client into `server/public` and starts the Express server.
If you deploy the frontend and backend on different domains, set `CLIENT_ORIGIN` to the public frontend URL.

Recommended Coolify environment variables:

```env
NODE_ENV=production
HOST=0.0.0.0
PORT=3001
TRUST_PROXY=1
SERVE_CLIENT=true

SESSION_SECRET=replace_with_strong_secret
SESSION_COOKIE_NAME=garden_sid
SESSION_COOKIE_SECURE=auto
SESSION_COOKIE_SAMESITE=lax

# If frontend and backend are on different domains, use SESSION_COOKIE_SAMESITE=none
# and ensure HTTPS is enabled.
CLIENT_ORIGIN=https://your-frontend-domain.com
```

Notes:
- If frontend and backend are under the same site/domain, keep `SESSION_COOKIE_SAMESITE=lax`.
- If they are cross-site, use `SESSION_COOKIE_SAMESITE=none` and `SESSION_COOKIE_SECURE=true` or `auto`.
- If requests are still unauthorized, increase `TRUST_PROXY` (for example `2`) depending on proxy layers.
- `SERVE_CLIENT=true` keeps the Express app serving the built React client even if `NODE_ENV` is not set correctly by the platform.

---

## 🔌 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | ❌ | Register a new user |
| POST | `/api/auth/login` | ❌ | Login |
| POST | `/api/auth/logout` | ❌ | Logout |
| GET | `/api/auth/me` | ❌ | Get current session user |
| GET | `/api/plants` | ✅ | Get all plants |
| GET | `/api/plants/:id` | ✅ | Get plant by ID |
| GET | `/api/cart` | ✅ | Get user's cart |
| POST | `/api/cart` | ✅ | Add item to cart |
| DELETE | `/api/cart/:id` | ✅ | Remove cart item |
| DELETE | `/api/cart` | ✅ | Clear cart |
| GET | `/api/orders` | ✅ | Get user's orders |
| POST | `/api/orders/bulk` | ✅ | Place bulk order |
| PATCH | `/api/orders/:id/status` | ✅ | Update order status |

---

## 🏗️ Architecture

```
Client (React)          Server (Node.js/Express)        Database (MySQL)
──────────────          ────────────────────────        ───────────────
View (JSX pages)  ───►  Routes → Controllers → Models → Tables
                  ◄───  JSON responses
```

- **Models**: Pure database access (SQL queries via mysql2)
- **Controllers**: Business logic, validation, request/response handling
- **Routes**: URL mapping to controllers
- **Views**: React components rendering data from API

---

## � Docker

```bash
docker build -t plant-shop .
docker run -p 3001:3001 --env-file server/.env plant-shop
```
