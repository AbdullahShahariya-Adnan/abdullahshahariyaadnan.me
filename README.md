# Portfolio Site — Md Abdullah Shahariya Adnan

Full-stack portfolio: animated React frontend, Express REST API, MySQL database,
plus a small admin panel for managing projects and reading contact messages.

**Stack:** React + Vite + Tailwind + Framer Motion · Node.js + Express · MySQL

## Editing the site's text

Nearly all homepage text, links, and your photo path live in **`frontend/src/content.js`**.
Edit that file and save — no other files need touching. To change your photo, drop a new
image into `frontend/public/` and update `hero.photo`.

Colors live in `frontend/src/index.css` (the `--accent` / `--accent-2` variables).

## Running locally

### 1. Database
```bash
mysql -u root -p < database/schema.sql
```
Generate your admin password, paste the hash into `database/seed.sql` (replacing
`$2b$10$REPLACE_WITH_GENERATED_HASH`), then:
```bash
mysql -u root -p portfolio_db < database/seed.sql
```

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env     # then edit .env with your DB credentials + JWT_SECRET
npm run hash-password -- your_chosen_password
npm run dev
```

### 3. Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
Site: http://localhost:5173 · Admin: http://localhost:5173/admin

## Deploying (free tier)

| Piece | Service |
|---|---|
| Frontend | Vercel / Netlify / Cloudflare Pages (handles React Router correctly) |
| Backend | Render or Railway |
| MySQL | Aiven or Railway |

Notes:
- **Never commit `.env`** — it's in `.gitignore`. Set those values as environment
  variables in your host's dashboard instead.
- Set `DB_SSL=true` on the backend host — cloud MySQL providers require SSL.
- Set `CORS_ORIGIN` to your deployed frontend URL (e.g. `https://yourdomain.com`).
- Set `VITE_API_URL` on the frontend host to your deployed API
  (e.g. `https://your-api.onrender.com/api`).
- Render's free tier sleeps after inactivity; the first request may take ~30–50s.
  The site still renders its built-in fallback content if the API is asleep.

## Security notes

Already included: bcrypt password hashing, JWT auth on admin routes, parameterized
SQL queries (no string concatenation), `helmet` security headers, rate limiting on
`/api/auth` and `/api/contact`, request body size limits, and basic input validation.

Before going public: change `JWT_SECRET` to a long random string, use a strong admin
password, and keep dependencies updated (`npm audit`).
