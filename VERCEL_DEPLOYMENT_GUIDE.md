# Vercel Deployment Guide - Veritas Bank

Complete step-by-step guide to deploy Veritas Bank on Vercel with Vercel Postgres.

---

## Part 1: Deploy Frontend on Vercel

### Step 1: Connect Repository to Vercel
1. Go to [vercel.com](https://vercel.com) and login
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repository: `veritas-bank`
4. Select the repository

### Step 2: Configure Frontend Build Settings
In the project configuration:

**Framework Preset**: `Vite`

**Root Directory**: `frontend`

**Build Settings**:
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

**Environment Variables** (Add these now):
- Key: `VITE_API_URL`
- Value: (Leave blank for now, we'll update after backend deployment)

### Step 3: Deploy Frontend
1. Click **"Deploy"**
2. Wait for deployment to complete
3. You'll get a URL like: `https://veritas-bank.vercel.app`
4. **Note this URL** - you'll need it for CORS configuration

---

## Part 2: Create Vercel Postgres Database

### Step 1: Create Database
1. In your Vercel dashboard, go to **Storage** tab
2. Click **"Create Database"**
3. Select **"Postgres"**
4. Choose database name: `veritas-bank-db`
5. Select region: **Choose closest to your users**
6. Click **"Create"**

### Step 2: Get Database Connection Strings
After database creation, you'll see:
- `POSTGRES_URL` - Full connection string with pooling
- `POSTGRES_URL_NON_POOLING` - Direct connection (for migrations)
- `POSTGRES_PRISMA_URL` - For Prisma Client
- `POSTGRES_URL_NO_SSL` - Without SSL

**Copy all these values** - you'll need them!

---

## Part 3: Deploy Backend on Vercel

### Step 1: Create New Vercel Project for Backend
1. Go back to Vercel dashboard
2. Click **"Add New"** → **"Project"**
3. Import the **same repository** again: `veritas-bank`
4. This time it's for the backend

### Step 2: Configure Backend Build Settings
**Framework Preset**: `Other`

**Root Directory**: `backend`

**Build Settings**:
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### Step 3: Add Environment Variables
Click **"Environment Variables"** and add these:

**Required Variables**:
```
DATABASE_URL=<POSTGRES_PRISMA_URL from Step 2.2>
DIRECT_URL=<POSTGRES_URL_NON_POOLING from Step 2.2>
JWT_SECRET=<Generate a random 32+ character string>
JWT_EXPIRES_IN=7d
PORT=3000
NODE_ENV=production
```

**CORS Variable** (using frontend URL from Part 1):
```
CORS_ORIGIN=https://veritas-bank.vercel.app
```

### Step 4: Deploy Backend
1. Click **"Deploy"**
2. Wait for deployment
3. You'll get a backend URL like: `https://veritas-bank-api.vercel.app`
4. **Note this URL**

---

## Part 4: Run Database Migrations

### Step 1: Install Vercel CLI (if not installed)
```bash
npm install -g vercel
```

### Step 2: Login to Vercel CLI
```bash
vercel login
```

### Step 3: Link Your Backend Project
```bash
cd backend
vercel link
```
- Select your team/account
- Link to existing project: `veritas-bank-api` (or whatever you named it)

### Step 4: Pull Environment Variables Locally
```bash
vercel env pull .env.production
```

### Step 5: Run Prisma Migrations
```bash
npx prisma generate
npx prisma migrate deploy
```

### Step 6: Seed Database with Demo Data
```bash
npx prisma db seed
```

This will create:
- Demo user: `user@veritasbank.com` / `User@123`
- Admin user: `admin@veritasbank.com` / `Admin@123`

---

## Part 5: Update Frontend Environment Variable

### Step 1: Update Frontend VITE_API_URL
1. Go to your **frontend project** in Vercel
2. Go to **Settings** → **Environment Variables**
3. Edit `VITE_API_URL`:
   - Value: `https://veritas-bank-api.vercel.app/api` (use your actual backend URL)
4. Click **"Save"**

### Step 2: Redeploy Frontend
1. Go to **Deployments** tab
2. Click on the latest deployment
3. Click **"Redeploy"**
4. Wait for deployment to complete

---

## Part 6: Configure CORS on Backend

### Step 1: Update CORS Environment Variable
1. Go to your **backend project** in Vercel
2. Go to **Settings** → **Environment Variables**
3. Edit or add `CORS_ORIGIN`:
   - Value: `https://veritas-bank.vercel.app` (your actual frontend URL)
4. Click **"Save"**

### Step 2: Redeploy Backend
1. Go to **Deployments** tab
2. Click **"Redeploy"**

---

## Part 7: Test Your Deployment

### Step 1: Visit Your Frontend
Open: `https://veritas-bank.vercel.app` (your actual URL)

### Step 2: Test Login
Use demo accounts:
- **User**: `user@veritasbank.com` / `User@123`
- **Admin**: `admin@veritasbank.com` / `Admin@123`

### Step 3: Test Features
- ✅ Dashboard loads
- ✅ Balance displays
- ✅ Transactions work
- ✅ Admin panel (for admin account)

---

## Environment Variables Summary

### Frontend (.env)
```env
VITE_API_URL=https://veritas-bank-api.vercel.app/api
```

### Backend (.env)
```env
DATABASE_URL=<POSTGRES_PRISMA_URL>
DIRECT_URL=<POSTGRES_URL_NON_POOLING>
JWT_SECRET=<random-32-character-string>
JWT_EXPIRES_IN=7d
PORT=3000
NODE_ENV=production
CORS_ORIGIN=https://veritas-bank.vercel.app
```

---

## Troubleshooting

### Issue: Frontend can't connect to backend
**Solution**: Check `VITE_API_URL` in frontend and `CORS_ORIGIN` in backend

### Issue: Database connection errors
**Solution**: Verify `DATABASE_URL` and `DIRECT_URL` are correct from Vercel Postgres

### Issue: Migrations fail
**Solution**: Use `DIRECT_URL` (non-pooling) for migrations:
```bash
DATABASE_URL=$DIRECT_URL npx prisma migrate deploy
```

### Issue: 401 Unauthorized errors
**Solution**: Check `JWT_SECRET` is set in backend environment variables

---

## Production Checklist

- ✅ Frontend deployed and accessible
- ✅ Backend deployed and accessible
- ✅ Vercel Postgres database created
- ✅ Database migrations applied
- ✅ Demo data seeded
- ✅ Environment variables configured
- ✅ CORS configured correctly
- ✅ Login works
- ✅ Transactions work
- ✅ Admin panel accessible

---

## Useful Commands

### Check Prisma Schema
```bash
npx prisma validate
```

### View Database in Prisma Studio
```bash
npx prisma studio
```

### Reset Database (DANGEROUS - deletes all data)
```bash
npx prisma migrate reset
```

### Generate Prisma Client
```bash
npx prisma generate
```

---

**Deployment Complete!** 🚀

Your Veritas Bank demo is now live on Vercel with a PostgreSQL database.
