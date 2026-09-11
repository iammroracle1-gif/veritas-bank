# Vercel Environment Variables Setup

## Backend Environment Variables

Copy and paste these into your Vercel backend project settings:

### DATABASE_URL
```
postgresql://neondb_owner:npg_bSlHIvuh29KL@ep-twilight-sun-za59z8ug-pooler.c-2.eu-west-2.aws.neon.tech/neondb?channel_binding=require&connect_timeout=15&sslmode=require
```

### DIRECT_URL
```
postgresql://neondb_owner:npg_bSlHIvuh29KL@ep-twilight-sun-za59z8ug.c-2.eu-west-2.aws.neon.tech/neondb?sslmode=require
```

### JWT_SECRET
```
veritas_bank_super_secret_jwt_key_production_2024_change_this_in_production
```

### JWT_EXPIRES_IN
```
7d
```

### PORT
```
3000
```

### NODE_ENV
```
production
```

### CORS_ORIGIN (Update after frontend deployment)
```
https://your-frontend-url.vercel.app
```

---

## Frontend Environment Variables

Copy and paste this into your Vercel frontend project settings:

### VITE_API_URL (Update after backend deployment)
```
https://your-backend-url.vercel.app/api
```

---

## Quick Setup Instructions

### For Backend:
1. Go to Vercel Dashboard
2. Select your backend project
3. Go to Settings → Environment Variables
4. Add each variable above (Name and Value)
5. Select "Production" environment
6. Click Save

### For Frontend:
1. Go to Vercel Dashboard
2. Select your frontend project
3. Go to Settings → Environment Variables
4. Add VITE_API_URL with your backend URL
5. Select "Production" environment
6. Click Save
7. Redeploy

---

## All Variables at a Glance

### Backend (.env)
```env
DATABASE_URL=postgresql://neondb_owner:npg_bSlHIvuh29KL@ep-twilight-sun-za59z8ug-pooler.c-2.eu-west-2.aws.neon.tech/neondb?channel_binding=require&connect_timeout=15&sslmode=require
DIRECT_URL=postgresql://neondb_owner:npg_bSlHIvuh29KL@ep-twilight-sun-za59z8ug.c-2.eu-west-2.aws.neon.tech/neondb?sslmode=require
JWT_SECRET=veritas_bank_super_secret_jwt_key_production_2024_change_this_in_production
JWT_EXPIRES_IN=7d
PORT=3000
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-url.vercel.app
```

### Frontend (.env)
```env
VITE_API_URL=https://your-backend-url.vercel.app/api
```
