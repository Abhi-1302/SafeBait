# SafeBait Backend (Node.js + Express + PostgreSQL)

API backend for SafeBait phishing simulation/training platform.

## 🚦 Features

- JWT authentication and user management
- Role-based access for admin features
- Campaign, template, audience, and interaction management
- Phishing event tracking (reported, clicked, etc.)
- Modern REST API

## ⚙️ Setup

### 1. Environment

- Node.js (18+ recommended)
- PostgreSQL (or SQLite for test/dev)

### 2. Running locally

Move to backend folder
cd backend

Install dependencies
npm install

Setup local PostgreSQL and update .env accordingly
cp .env.sample .env # Edit DB, JWT, etc.

Seed database (optional)
npm run seed

Start server
npm run dev

### 3. .env Variables

- `DATABASE_URL` - database connection string
- `JWT_SECRET` - secret for JWT tokens
- (See `.env.sample` for more)

### 4. API Docs

By default, app runs at `http://localhost:5000/`.

- Authentication: `/api/auth/login`, `/api/auth/register`, `/api/auth/me`
- Admin endpoints: `/api/admin/*` (protected)
- Campaigns: `/api/campaigns`
- Users, templates, audiences, interactions

See source for detailed endpoint list and body parameters.

### 5. Useful Scripts

- `npm run dev` — Run dev server with hot-reload
- `npm run seed` — Seed dummy data

## 🧑‍💻 Contributing

All PRs & issues welcome!
