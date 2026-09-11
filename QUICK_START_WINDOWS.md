# Veritas Bank V2.0 - Windows Quick Start Guide

## ⚡ Super Quick Setup (Copy & Paste)

### Prerequisites Check
```powershell
# Check if Node.js is installed
node --version

# Check if PostgreSQL is installed
psql --version

# If either is missing, install them first:
# Node.js: https://nodejs.org/ (Download LTS version)
# PostgreSQL: https://www.postgresql.org/download/windows/
```

### Step 1: Create Database
```powershell
# Open PowerShell or Command Prompt
# Connect to PostgreSQL (enter your password when prompted)
psql -U postgres

# In psql, run:
CREATE DATABASE veritas_bank;
\q
```

### Step 2: Backend Setup
```powershell
# Navigate to backend folder
cd "c:\Users\1040 G7\Documents\Client banking\veritas-v2\backend"

# Install dependencies
npm install

# Create .env file
Copy-Item .env.example .env

# NOW EDIT THE .env FILE:
# Open .env in Notepad and change YOUR_PASSWORD_HERE to your actual PostgreSQL password
notepad .env

# After saving .env, continue:
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed

# Start backend (keep this window open)
npm run dev
```

**You should see:** `🏦 Veritas Bank API running on http://localhost:3000`

### Step 3: Frontend Setup (New Terminal)
```powershell
# Open NEW PowerShell/Command Prompt window
cd "c:\Users\1040 G7\Documents\Client banking\veritas-v2\frontend"

# Install dependencies
npm install

# Start frontend
npm run dev
```

**You should see:** `Local: http://localhost:5173/`

### Step 4: Open Browser
```
Go to: http://localhost:5173
```

## 🎯 That's It!

You should now see the beautiful Veritas Bank landing page.

**Login with:**
- Admin: admin@veritasbank.com / Admin@123
- User: user@veritasbank.com / User@123

---

## ⚠️ Troubleshooting

### "Command not found" errors
**Solution**: Install Node.js and PostgreSQL first

### "Database connection failed"
**Solution**: 
1. Make sure PostgreSQL is running
2. Check your password in `backend/.env`
3. Verify DATABASE_URL is correct

### "Port 3000 already in use"
**Solution**: Kill the process or change PORT in backend/.env

### "Module not found" errors
**Solution**: Delete `node_modules` and run `npm install` again

---

## 🚀 Development Mode

**Start both servers together** (from project root):
```powershell
cd "c:\Users\1040 G7\Documents\Client banking\veritas-v2"
npm install
npm run dev
```

This will start both frontend and backend at once!

---

## 📱 Access Points

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Database GUI**: `npx prisma studio` (run in backend folder)

---

## 🎨 Customization

**Change colors**: Edit `frontend/tailwind.config.js`
**Change logo**: Replace images in `frontend/public/images/`
**Add features**: Add new pages in `frontend/src/pages/`

---

## ✅ Success Checklist

- [ ] PostgreSQL installed and running
- [ ] Node.js 18+ installed
- [ ] Database `veritas_bank` created
- [ ] Backend .env file configured
- [ ] Backend running on port 3000
- [ ] Frontend running on port 5173
- [ ] Can login with demo credentials
- [ ] Can see dashboard

If all checked, you're ready to go! 🎉

---

## 📞 Need Help?

1. Check backend terminal for errors
2. Check frontend terminal for errors
3. Check browser console (F12)
4. Verify PostgreSQL is running
5. Review SETUP_GUIDE.md for detailed instructions
