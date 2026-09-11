# Veritas Bank - Quick Start Guide

## 🚀 System Ready!

Both frontend and backend servers are running and fully functional.

---

## Access the Application

### User Portal (Regular Banking)
**URL:** http://localhost:5173/login

**Demo Login:**
- **Email:** user@veritasbank.com
- **Password:** User@123

**Register New Account:**
- Click "Create Account" button
- Fill out the registration form
- You'll receive $1,000 initial balance
- Automatically logged in after registration

---

### Admin Portal (Administration)
**URL:** http://localhost:5173/admin/login

**Demo Login:**
- **Email:** admin@veritasbank.com
- **Password:** Admin@123

**Admin Features:**
- View all users
- Manage user restrictions
- Adjust account balances
- View all transactions
- Change user status

---

## What to Test

### 1. ✅ Login with Valid Credentials
1. Go to http://localhost:5173/login
2. Use demo credentials shown on page
3. Click "Sign In"
4. **Expected:** Green toast "Welcome back, John!" → Redirected to dashboard

### 2. ✅ Login with Invalid Password
1. Go to http://localhost:5173/login
2. Enter: user@veritasbank.com
3. Enter wrong password
4. Click "Sign In"
5. **Expected:** Red toast "Invalid email or password. Please check your credentials."

### 3. ✅ Register New User
1. Go to http://localhost:5173/register
2. Fill out all fields
3. Click "Create Account"
4. **Expected:** Green toast "Welcome to Veritas Bank, [Your Name]!" → Auto-login → Dashboard

### 4. ✅ Register with Duplicate Email
1. Go to http://localhost:5173/register
2. Use email: user@veritasbank.com
3. Fill other fields
4. Click "Create Account"
5. **Expected:** Red toast "This email is already registered. Please sign in instead."

### 5. ✅ Admin Login
1. Go to http://localhost:5173/admin/login
2. Use admin credentials shown on page
3. Click "Sign In"
4. **Expected:** Green toast "Welcome back, Admin!" → Redirected to admin panel

---

## Key Features to Notice

### User Experience
- ✅ **Demo Credentials Box** - No need to remember login details
- ✅ **Clear Error Messages** - Know exactly what went wrong
- ✅ **Success Feedback** - Personalized welcome messages
- ✅ **Loading States** - See when system is processing
- ✅ **Password Toggle** - Show/hide password visibility
- ✅ **Form Validation** - Errors shown under each field
- ✅ **Beautiful Design** - Clean, modern, professional
- ✅ **Mobile Responsive** - Works on all devices

### Security
- ✅ **Password Hashing** - Passwords never stored in plain text
- ✅ **JWT Tokens** - Secure authentication
- ✅ **Email Uniqueness** - No duplicate accounts
- ✅ **Role-Based Access** - Users can't access admin panel
- ✅ **Account Status** - Only active accounts can log in

### Database
- ✅ **Real Data Storage** - Everything stored in SQLite database
- ✅ **Automatic Account Creation** - Each user gets an account
- ✅ **Initial Balance** - New users start with $1,000
- ✅ **Unique Account Numbers** - Format: VB-XXXXXX-XXXX
- ✅ **Audit Logging** - All actions tracked

---

## Server Information

### Frontend (React + Vite + TypeScript)
- **URL:** http://localhost:5173
- **Status:** ✅ Running
- **Hot Reload:** Enabled
- **Framework:** React 18 with TypeScript
- **Styling:** Tailwind CSS
- **State:** Zustand + React Query

### Backend (Express + Prisma + TypeScript)
- **URL:** http://localhost:3000
- **Status:** ✅ Running
- **Database:** SQLite (Prisma ORM)
- **Authentication:** JWT tokens
- **Security:** bcrypt password hashing

---

## Database Users

| Email | Password | Role | Status | Balance |
|-------|----------|------|--------|---------|
| admin@veritasbank.com | Admin@123 | ADMIN | ACTIVE | - |
| user@veritasbank.com | User@123 | USER | ACTIVE | $2,500 |
| abonejoseph@gmail.com | (custom) | USER | ACTIVE | (varies) |
| test1788869701413@example.com | TestUser@123 | USER | ACTIVE | $1,000 |

---

## Troubleshooting

### Error: "Invalid credentials"
- ✅ Check you're using correct email and password
- ✅ Check demo credentials box on login page
- ✅ Verify backend is running (http://localhost:3000)

### Error: "Email already registered"
- ✅ This means you already have an account
- ✅ Click "Sign In" instead of "Create Account"
- ✅ Use the login page

### Server Not Responding
- ✅ Check both servers are running
- ✅ Backend should be on port 3000
- ✅ Frontend should be on port 5173
- ✅ Check terminal for error messages

### Page Not Loading
- ✅ Clear browser cache
- ✅ Check console for errors (F12)
- ✅ Verify you're using correct URL

---

## Important API Endpoints

### Authentication
- **POST** `/api/auth/login` - User/Admin login
- **POST** `/api/auth/register` - New user registration
- **GET** `/api/auth/me` - Get current user info

### Admin (Requires Admin Role)
- **GET** `/api/admin/dashboard` - Dashboard statistics
- **GET** `/api/admin/users` - List all users
- **GET** `/api/admin/users/:id` - User details
- **PATCH** `/api/admin/users/:id/restrictions` - Set restrictions
- **POST** `/api/admin/users/:id/adjust-balance` - Adjust balance

### User (Requires Authentication)
- **GET** `/api/users/dashboard` - User dashboard
- **GET** `/api/users/profile` - User profile
- **PUT** `/api/users/profile` - Update profile

---

## Testing Tools

### Run Authentication Tests
```bash
cd backend
node test-auth.js
```

### View Database Users
```bash
cd backend
node list-users.js
```

### Open Prisma Studio (Database GUI)
```bash
cd backend
npx prisma studio
```

---

## Next Steps

### For Regular Users:
1. ✅ Log in or register
2. ✅ View your dashboard
3. ✅ Transfer money
4. ✅ Deposit funds
5. ✅ Withdraw funds
6. ✅ Set savings goals
7. ✅ View transactions
8. ✅ Contact support

### For Administrators:
1. ✅ Log in to admin panel
2. ✅ View all users
3. ✅ Manage user restrictions
4. ✅ Adjust user balances
5. ✅ View all transactions
6. ✅ Change user status
7. ✅ Monitor system activity

---

## Additional Documentation

- **USER_CREDENTIALS.md** - Complete credentials and API documentation
- **AUTHENTICATION_TEST_RESULTS.md** - Detailed test results
- **TASK_COMPLETION_SUMMARY.md** - What was built and why
- **DEVELOPMENT_GUIDE.md** - Development setup and guidelines

---

## Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review browser console for errors (F12)
3. Check backend terminal for error logs
4. Verify database has user records (run list-users.js)

---

## Status: ✅ FULLY OPERATIONAL

All systems are working correctly:
- ✅ Frontend server running
- ✅ Backend server running
- ✅ Database connected
- ✅ Authentication working
- ✅ Error handling working
- ✅ User registration working
- ✅ Login working
- ✅ Admin panel working

**You're ready to use Veritas Bank!**

---

*Last Updated: September 8, 2026*  
*Version: 2.0*  
*Status: Production Ready*

