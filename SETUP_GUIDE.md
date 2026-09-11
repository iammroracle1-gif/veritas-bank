# Veritas Bank V2.0 - Complete Setup Guide

## 📋 Prerequisites

Before you begin, ensure you have:
- **Node.js 18+** installed ([Download](https://nodejs.org/))
- **PostgreSQL 14+** installed ([Download](https://www.postgresql.org/download/))
- **Git** (optional, for version control)
- A code editor (VS Code recommended)

## 🚀 Quick Start (Step by Step)

### Step 1: Install PostgreSQL

1. Download and install PostgreSQL for Windows
2. During installation, remember your postgres user password
3. Verify installation:
```cmd
psql --version
```

### Step 2: Create Database

Open Command Prompt or PowerShell:

```cmd
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE veritas_bank;

# Exit psql
\q
```

### Step 3: Setup Backend

```cmd
# Navigate to backend directory
cd veritas-v2\backend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
copy .env.example .env
```

Edit `backend\.env` with your PostgreSQL credentials:
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/veritas_bank?schema=public"
PORT=3000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-123456
JWT_EXPIRES_IN=7d
ADMIN_EMAIL=admin@veritasbank.com
ADMIN_PASSWORD=Admin@123
CORS_ORIGIN=http://localhost:5173
```

### Step 4: Initialize Database

```cmd
# Still in backend directory

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Seed database with initial data
npm run prisma:seed
```

### Step 5: Start Backend Server

```cmd
# Still in backend directory
npm run dev
```

You should see:
```
🏦 Veritas Bank API running on http://localhost:3000
```

Leave this terminal running!

### Step 6: Setup Frontend (New Terminal)

Open a NEW Command Prompt/Terminal window:

```cmd
# Navigate to frontend directory
cd veritas-v2\frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

You should see:
```
VITE v5.x.x ready in xxx ms
➜ Local: http://localhost:5173/
```

### Step 7: Access the Application

Open your browser and go to:
```
http://localhost:5173
```

## 🔐 Default Login Credentials

### Admin Account
- Email: `admin@veritasbank.com`
- Password: `Admin@123`
- Access: Full admin panel

### Test User Account
- Email: `user@veritasbank.com`
- Password: `User@123`
- Access: Regular user features

## 📁 Project Structure

```
veritas-v2/
├── backend/                    # Node.js + Express + PostgreSQL
│   ├── prisma/
│   │   └── schema.prisma      # Database schema
│   ├── src/
│   │   ├── controllers/       # Business logic
│   │   ├── routes/            # API endpoints
│   │   ├── middleware/        # Auth & validation
│   │   ├── utils/             # Helper functions
│   │   └── index.ts           # Server entry
│   └── .env                   # Environment variables
│
├── frontend/                   # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API calls
│   │   ├── stores/            # State management
│   │   ├── types/             # TypeScript types
│   │   └── App.tsx            # Main app component
│   └── index.html             # HTML entry
│
└── README.md                   # Project documentation
```

## 🎨 Features Implemented

✅ **User Features:**
- Registration & Login with JWT authentication
- Modern iOS-inspired dashboard
- Transaction history with filtering
- Multi-currency support (10+ currencies)
- Savings goals tracking
- Support ticket system
- Profile management

✅ **Admin Features:**
- Admin dashboard with analytics
- User management (view, search, filter)
- Account status management
- Balance adjustments with audit trail
- Transaction monitoring
- Audit log tracking

✅ **Design:**
- iOS-inspired UI with glassmorphism
- Web3 aesthetic with gradients
- Fully responsive (mobile, tablet, desktop)
- Smooth animations with Framer Motion
- Dark mode by default

## 🛠️ Available Scripts

### Backend
```cmd
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npx prisma studio    # Open database GUI
npx prisma migrate   # Run migrations
```

### Frontend
```cmd
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Root
```cmd
npm run dev          # Start both frontend & backend
```

## 🔧 Common Issues & Solutions

### Issue: "Port 3000 already in use"
**Solution:** Kill the process using port 3000 or change PORT in backend/.env

### Issue: "Cannot connect to PostgreSQL"
**Solution:** 
1. Verify PostgreSQL is running
2. Check DATABASE_URL in backend/.env
3. Ensure password is correct

### Issue: "Prisma Client Not Generated"
**Solution:**
```cmd
cd backend
npx prisma generate
```

### Issue: "CORS Error"
**Solution:** Ensure CORS_ORIGIN in backend/.env matches your frontend URL

## 📦 Deployment

### Backend (Node.js)
- Deploy to: Railway, Render, Heroku, AWS
- Use production database URL
- Set environment variables
- Run migrations before starting

### Frontend (React)
- Deploy to: Vercel, Netlify, Cloudflare Pages
- Build command: `npm run build`
- Output directory: `dist`
- Set VITE_API_URL to production API

### Database
- Use managed PostgreSQL: Railway, Supabase, Neon, AWS RDS

## 🔐 Security Notes

⚠️ **IMPORTANT:**
1. Change JWT_SECRET in production
2. Change default admin password immediately
3. Use HTTPS in production
4. Enable CORS only for your domain
5. Regular database backups
6. Keep dependencies updated

## 📚 Technology Stack

**Frontend:**
- React 18
- TypeScript
- Vite
- TailwindCSS
- Framer Motion
- React Query
- Zustand
- React Router

**Backend:**
- Node.js
- Express
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT
- bcryptjs

## 📞 Support

For issues or questions:
- Check this guide first
- Review backend/frontend console logs
- Check PostgreSQL connection
- Verify all dependencies are installed

## 🎉 Success!

If you see the landing page at http://localhost:5173, congratulations! Your Veritas Bank V2 is running successfully.

**Next Steps:**
1. Login with demo credentials
2. Explore the dashboard
3. Try creating transactions
4. Test admin features
5. Customize the design
6. Add your own features

Happy banking! 🏦✨
