# FleetVision AI - Local Setup Guide

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| **Node.js** | 18+ | https://nodejs.org |
| **Bun** | 1.0+ | `npm install -g bun` |
| **Git** | Any | https://git-scm.com |

---

## Quick Start (5 Steps)

### Step 1: Copy the project to your local machine

```bash
# Download/Upload the entire project folder to your local machine
# Ensure the folder structure is preserved
```

### Step 2: Install dependencies

```bash
cd fleetvision-ai
bun install
```

> **If you don't have bun:** You can use npm instead:
> ```bash
> npm install
> ```

### Step 3: Set up environment variables

Create a `.env` file in the **project root** (same folder as `package.json`):

```env
DATABASE_URL="file:./db/custom.db"
```

> **Important:** The `db/` folder must exist. If it doesn't, create it:
> ```bash
> mkdir -p db
> ```

### Step 4: Initialize the database

```bash
# Generate Prisma client
npx prisma generate

# Push the schema to create tables
npx prisma db push
```

### Step 5: Seed demo data & start the server

```bash
# Start the dev server (it runs on port 3000)
bun run dev
# OR if using npm:
# npm run dev
```

Then in a **second terminal**, seed the database:

```bash
curl -X POST http://localhost:3000/api/seed
```

### Step 6: Open in browser

```
http://localhost:3000
```

**Login Credentials:**

| Field | Value |
|-------|-------|
| Email | `admin@fleetvision.com` |
| Password | `password123` |

---

## Common Issues & Fixes

### Issue 1: `prisma generate` fails

```
Error: Prisma Client not generated
```

**Fix:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules
bun install
npx prisma generate
```

### Issue 2: Database file not found

```
Error: Database not found at file:./db/custom.db
```

**Fix:**
```bash
# Create the db directory
mkdir -p db

# Push the schema again
npx prisma db push
```

### Issue 3: Port 3000 already in use

```
Error: Port 3000 is already in use
```

**Fix:**
```bash
# Kill the process using port 3000
# On macOS/Linux:
lsof -t -i:3000 | xargs kill -9

# On Windows:
npx kill-port 3000

# Or start on a different port:
PORT=3001 bun run dev
```

### Issue 4: Page loads blank / White screen

**Fix:**
1. Open browser console (F12 → Console)
2. If you see "Module not found" errors:
   ```bash
   rm -rf node_modules/.cache
   bun install
   ```
3. If you see Prisma errors:
   ```bash
   npx prisma generate
   ```

### Issue 5: API calls return 500 errors

**Fix:**
1. Check the `.env` file has correct `DATABASE_URL`
2. Ensure `db/custom.db` file exists
3. Re-push the schema:
   ```bash
   npx prisma db push --accept-data-loss
   npx prisma generate
   ```
4. Re-seed data:
   ```bash
   curl -X POST http://localhost:3000/api/seed
   ```

### Issue 6: Login doesn't work / Invalid credentials

**Fix:**
1. Make sure you ran the seed endpoint:
   ```bash
   curl -X POST http://localhost:3000/api/seed
   ```
2. Verify the user exists by checking the database:
   ```bash
   npx prisma studio
   # Open http://localhost:5555 and check the User table
   ```

### Issue 7: Charts not rendering

**Fix:**
This is usually a Recharts import issue. Ensure all dependencies are installed:
```bash
rm -rf node_modules package-lock.json
bun install
```

---

## Troubleshooting Checklist

- [ ] Node.js 18+ installed (`node -v`)
- [ ] Bun installed (`bun -v`)
- [ ] `.env` file exists in project root
- [ ] `DATABASE_URL="file:./db/custom.db"` in `.env`
- [ ] `db/` directory exists
- [ ] Ran `npx prisma generate`
- [ ] Ran `npx prisma db push`
- [ ] Ran `curl -X POST http://localhost:3000/api/seed`
- [ ] Port 3000 is not in use
- [ ] No errors in terminal where dev server is running

---

## Useful Commands

```bash
bun run dev          # Start development server (port 3000)
bun run lint         # Run ESLint
bun run db:push      # Push Prisma schema to database
bun run db:generate  # Generate Prisma client
bun run db:migrate   # Run database migrations
bun run db:reset     # Reset database (deletes all data!)
npx prisma studio    # Open database browser (port 5555)
```

---

## Project Structure

```
fleetvision-ai/
├── prisma/
│   └── schema.prisma        # Database schema (22 models)
├── src/
│   ├── app/
│   │   ├── page.tsx          # Main frontend (all 9 pages)
│   │   ├── layout.tsx        # Root layout
│   │   ├── globals.css       # Global styles
│   │   └── api/
│   │       ├── auth/login/   # Login API
│   │       ├── vehicles/     # Vehicle CRUD
│   │       ├── drivers/      # Driver CRUD
│   │       ├── trips/        # Trip CRUD
│   │       ├── fuel/         # Fuel tracking
│   │       ├── maintenance/  # Maintenance CRUD
│   │       ├── expenses/     # Expense tracking
│   │       ├── dashboard/    # Dashboard stats
│   │       ├── ai/[type]/    # 7 AI prediction endpoints
│   │       ├── notifications/ # Notification management
│   │       └── seed/         # Demo data seeder
│   ├── components/ui/        # shadcn/ui components
│   └── lib/
│       ├── db.ts             # Prisma database client
│       └── utils.ts          # Utility functions
├── db/
│   └── custom.db             # SQLite database file
├── .env                      # Environment variables
├── package.json              # Dependencies
└── tsconfig.json             # TypeScript config
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Database | SQLite + Prisma ORM |
| Charts | Recharts |
| Icons | Lucide React |
| Notifications | Sonner (toast) |
