# Much Ado

A gamified to-do list app with XP, leveling, and prestige systems.

## Tech Stack

- **Frontend:** React + Vite + TypeScript + Tailwind CSS
- **Backend:** Convex (serverless, real-time)
- **Auth:** Convex Auth (email + password)

## Features

- **Daily tasks** (reset each day) – 10 XP each
- **Persistent tasks** (stay until completed) – 20 XP each
- **XP & Leveling** – level cap 999, then prestige
- **Reminders** – browser notifications for task due times
- **Profile** – view stats and archived tasks
- **Dark/Light theme** – toggle with persistence

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Convex

Run Convex dev to create a project and generate the API:

```bash
npx convex dev
```

Follow the prompts to log in (GitHub) and create a project. This will:

- Create `.env.local` with `VITE_CONVEX_URL`
- Generate `convex/_generated/` with typed API

### 3. Configure Convex Auth

For email/password auth, set environment variables in the [Convex Dashboard](https://dashboard.convex.dev):

1. **JWT keys** – run `npx @convex-dev/auth` (requires clean git state) or [set up manually](https://labs.convex.dev/auth/setup/manual)
2. **SITE_URL** (optional for password-only) – e.g. `http://localhost:5173` for local dev

### 4. Start the app

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Deploy to Render

1. Push your code to GitHub
2. Create a **Static Site** on [Render](https://render.com)
3. Set **Build command:** `npm run build`
4. Set **Publish directory:** `dist`
5. Add **Environment variable:** `VITE_CONVEX_URL` = your Convex production URL
6. Deploy Convex separately: `npx convex deploy`

## Project Structure

```
convex/          # Backend functions
src/
  components/    # UI components
  hooks/         # useDailyReset, useReminders
  lib/           # xp, notifications, theme
  pages/         # Dashboard, Profile, Sign in/up
```
