# ShortLink

A full-stack URL shortener built with Next.js — frontend and backend in a single application, deployed on Vercel.

![CI/CD](https://github.com/deepakkandpal004/URL-Shortener/actions/workflows/main.yml/badge.svg)

---

## What it does

- Shorten any URL into a clean short link
- Custom aliases — choose your own short code
- Dashboard to manage, copy and delete your links
- JWT-based authentication (register, login, logout)
- Short links redirect directly from `yourdomain.com/:code`

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Database | PostgreSQL |
| ORM | Drizzle ORM |
| Auth | JWT (jsonwebtoken) |
| Validation | Zod |
| Styling | Custom CSS (Space Grotesk + Playfair Display + JetBrains Mono) |
| Testing | Vitest |
| Linting | ESLint |
| Deployment | Vercel |
| CI/CD | GitHub Actions |

---

## Project structure

```
├── app/
│   ├── [code]/route.js          # Short URL redirect
│   ├── api/
│   │   ├── user/login/          # POST /api/user/login
│   │   ├── user/sign-up/        # POST /api/user/sign-up
│   │   ├── shorten/             # POST /api/shorten
│   │   ├── codes/               # GET  /api/codes
│   │   ├── urls/[id]/           # DELETE / PATCH /api/urls/:id
│   │   └── health/              # GET  /api/health
│   ├── login/page.js
│   ├── register/page.js
│   ├── page.js                  # Dashboard
│   ├── layout.js
│   └── globals.css
├── components/
│   ├── AuthForm.js
│   ├── Dashboard.js
│   └── UrlCard.js
├── lib/
│   ├── db.js                    # Drizzle client
│   ├── hash.js                  # Password hashing
│   ├── token.js                 # JWT sign/verify
│   └── auth.js                  # Request auth helpers
├── models/
│   ├── user.js
│   └── url.js
├── tests/
│   ├── hash.test.js
│   ├── token.test.js
│   ├── auth.test.js
│   └── validation.test.js
└── .github/workflows/main.yml   # CI/CD pipeline
```

---

## Getting started

### Prerequisites

- Node.js 22+
- pnpm
- PostgreSQL

### Setup

```bash
# clone
git clone https://github.com/deepakkandpal004/URL-Shortener.git
cd URL-Shortener

# install
pnpm install

# copy env
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/url_shortener
JWT_SECRET=your-secret-key
```

```bash
# push schema to database
pnpm db:push

# start dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## API routes

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/user/sign-up` | — | Register a new user |
| POST | `/api/user/login` | — | Login, returns JWT |
| POST | `/api/shorten` | ✓ | Create a short URL |
| GET | `/api/codes` | ✓ | List your short URLs |
| DELETE | `/api/urls/:id` | ✓ | Delete a short URL |
| PATCH | `/api/urls/:id` | ✓ | Update URL or alias |
| GET | `/:code` | — | Redirect to target URL |
| GET | `/api/health` | — | Health check |

---

## Running tests

```bash
pnpm test
```

21 unit tests covering password hashing, JWT sign/verify, auth middleware, and request validation schemas.

---

## CI/CD pipeline

Every push and pull request runs:

1. **lint** — ESLint on API routes and lib
2. **unit tests** — Vitest
3. **drizzle migration check** — validates migration consistency
4. **build** — Next.js production build
5. **security audit** — pnpm audit (non-blocking)

Pull requests get a **preview deployment** on Vercel with the URL posted as a PR comment.

Merging to `main` triggers a **production deployment** to Vercel.

### Enabling deployment

Add these in GitHub → Settings → Variables → Actions:

| Variable | Value |
|---|---|
| `VERCEL_ENABLED` | `true` |
| `PRODUCTION_URL` | your Vercel domain |

Add these in GitHub → Settings → Secrets → Actions:

| Secret | Description |
|---|---|
| `VERCEL_TOKEN` | Vercel API token |
| `VERCEL_ORG_ID` | Vercel org/team ID |
| `VERCEL_PROJECT_ID` | Vercel project ID |

---

## Database commands

```bash
pnpm db:push       # push schema to database
pnpm db:generate   # generate migration files
pnpm db:check      # validate migrations
pnpm db:studio     # open Drizzle Studio
```

---

## License

MIT
