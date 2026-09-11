# Veritas Bank - User Credentials

## ✅ AUTHENTICATION STATUS: FULLY FUNCTIONAL & TESTED

All authentication endpoints have been tested and verified working:
- ✅ User login with valid credentials
- ✅ Admin login with valid credentials  
- ✅ Invalid credentials rejection (shows proper error message)
- ✅ New user registration with database storage
- ✅ Duplicate email detection and rejection
- ✅ Password hashing and verification
- ✅ JWT token generation and validation
- ✅ Initial account creation with $1,000 balance
- ✅ Unique account number generation
- ✅ Professional error messages displayed to users

---

## Admin Account
**Portal:** http://localhost:5173/admin/login

- **Email:** admin@veritasbank.com
- **Password:** Admin@123
- **Role:** Administrator
- **Access:** Full system access, user management, restrictions, balance adjustments

---

## Regular User Accounts
**Portal:** http://localhost:5173/login

### User 1 - Test User
- **Email:** user@veritasbank.com
- **Password:** User@123
- **Name:** John Doe
- **Role:** Regular User
- **Status:** Active

### User 2 - Real User
- **Email:** abonejoseph@gmail.com
- **Password:** (Set during registration)
- **Name:** CHIMA ABONE
- **Role:** Regular User
- **Status:** Active

---

## Default Passwords for New Users
When creating new users, the default password format is:
- **Format:** User@123
- Users should change their password on first login

---

## Important Notes

### For Administrators:
- Admin can manage all users
- Can set transfer/withdrawal/deposit restrictions
- Can adjust user balances
- Can change account status (Active/Pending/Suspended)
- All actions are logged in audit logs

### For Regular Users:
- Can view their balance and transactions
- Can transfer money between accounts
- Can deposit funds
- Can withdraw funds
- Can set savings goals
- Can contact support
- Restrictions can be applied by admin

---

## Testing Invalid Credentials
When you enter wrong credentials, you will see:
- ❌ Red toast notification: "Invalid credentials. Please check your email and password."
- The error persists for 4 seconds with a red background
- Form remains accessible for retry

---

## Database Location
SQLite database is located at:
`backend/prisma/dev.db`

To view/edit the database, you can use:
- DB Browser for SQLite
- Prisma Studio: `npm run prisma:studio` (from backend folder)

---

## API Endpoints

### Authentication
- POST `/api/auth/login` - User/Admin login
- POST `/api/auth/register` - New user registration
- GET `/api/auth/me` - Get current user

### Admin Routes (Requires Admin Role)
- GET `/api/admin/dashboard` - Dashboard stats
- GET `/api/admin/users` - List all users
- GET `/api/admin/users/:id` - Get user details
- PATCH `/api/admin/users/:id/status` - Update user status
- PATCH `/api/admin/users/:id/restrictions` - Update restrictions
- POST `/api/admin/users/:id/adjust-balance` - Adjust user balance
- GET `/api/admin/transactions` - View all transactions

### User Routes (Requires Authentication)
- GET `/api/users/dashboard` - User dashboard
- GET `/api/users/profile` - User profile
- PUT `/api/users/profile` - Update profile

### Transaction Routes
- GET `/api/transactions` - User transactions
- POST `/api/transactions/demo` - Create demo transaction

---

## Server Information

### Frontend (React + Vite)
- URL: http://localhost:5173
- Hot reload enabled
- Modern UI with Tailwind CSS

### Backend (Express + Prisma)
- URL: http://localhost:3000
- Database: SQLite (Prisma ORM)
- Authentication: JWT tokens

---

## Quick Start Commands

### Start Both Servers:
```bash
# Terminal 1 - Backend
cd "c:\Users\1040 G7\Documents\Client banking\backend"
npm run dev

# Terminal 2 - Frontend  
cd "c:\Users\1040 G7\Documents\Client banking\frontend"
npm run dev
```

### Database Commands:
```bash
# View database in Prisma Studio
cd backend
npx prisma studio

# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# Create new migration
npx prisma migrate dev --name migration_name
```

---

## Troubleshooting

### "Invalid Credentials" Error
1. Check if you're using the correct email and password
2. Verify the backend server is running (http://localhost:3000)
3. Check browser console for detailed error messages
4. Ensure database has the user account

### Admin Access Denied
- Make sure you're using admin@veritasbank.com
- Regular users cannot access /admin routes
- Check that user.role === 'ADMIN' in database

### Server Not Starting
- Check if ports 3000 (backend) and 5173 (frontend) are available
- Run `npm install` if dependencies are missing
- Check for syntax errors in recent code changes

---

*Last Updated: September 8, 2026*
