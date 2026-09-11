# 🧪 Test Toast Notifications - Quick Guide

## ✅ Servers Running

- Backend: http://localhost:3000 ✅
- Frontend: http://localhost:5173 ✅

---

## 🎯 Quick Tests to Run

### Test 1: Invalid Password (Should Show RED Toast)

1. Open: http://localhost:5173/login
2. Enter:
   - Email: `user@veritasbank.com`
   - Password: `WrongPassword123`
3. Click "Sign In"
4. **✅ LOOK FOR:** Red toast in top-right corner saying:
   > "Invalid email or password. Please check your credentials."

---

### Test 2: Valid Login (Should Show GREEN Toast)

1. Open: http://localhost:5173/login
2. Enter:
   - Email: `user@veritasbank.com`
   - Password: `User@123`
3. Click "Sign In"
4. **✅ LOOK FOR:** Green toast in top-right corner saying:
   > "Welcome back, John!"
5. Should redirect to dashboard

---

### Test 3: Duplicate Email Registration (Should Show RED Toast)

1. Open: http://localhost:5173/register
2. Enter:
   - First Name: `Test`
   - Last Name: `User`
   - Email: `user@veritasbank.com` (already exists)
   - Password: `Test@123`
   - Confirm Password: `Test@123`
3. Click "Create Account"
4. **✅ LOOK FOR:** Red toast in top-right corner saying:
   > "This email is already registered. Please sign in instead."

---

### Test 4: Valid Registration (Should Show GREEN Toast)

1. Open: http://localhost:5173/register
2. Enter:
   - First Name: `New`
   - Last Name: `User`
   - Email: `newuser@example.com` (use unique email)
   - Password: `NewUser@123`
   - Confirm Password: `NewUser@123`
3. Click "Create Account"
4. **✅ LOOK FOR:** Green toast in top-right corner saying:
   > "Welcome to Veritas Bank, New!"
5. Should auto-login and redirect to dashboard

---

### Test 5: Non-Admin Trying Admin Portal (Should Show RED Toast)

1. Open: http://localhost:5173/admin/login
2. Enter:
   - Email: `user@veritasbank.com` (regular user, not admin)
   - Password: `User@123`
3. Click "Access Admin Portal"
4. **✅ LOOK FOR:** Red toast in top-right corner saying:
   > "Access denied. This portal is for administrators only."

---

### Test 6: Valid Admin Login (Should Show GREEN Toast)

1. Open: http://localhost:5173/admin/login
2. Enter:
   - Email: `admin@veritasbank.com`
   - Password: `Admin@123`
3. Click "Access Admin Portal"
4. **✅ LOOK FOR:** Green toast in top-right corner saying:
   > "Welcome back, Admin!"
5. Should redirect to admin dashboard

---

## 👀 What to Look For

### Toast Position:
- Top-right corner of the screen ✅

### Toast Appearance:
- Dark background (#1a2332) ✅
- White text ✅
- Rounded corners (12px) ✅
- Icon on the left (✓ or ✕) ✅

### Success Toast (Green):
- Green checkmark icon ✅
- Positive message ✅
- Auto-dismisses after 3 seconds ✅

### Error Toast (Red):
- Red X icon ✅
- Error message ✅
- Auto-dismisses after 3 seconds ✅

---

## 🔍 Browser Console Check

Open browser console (F12) and check:
- No JavaScript errors ✅
- Console shows: "Login error:" or "Registration error:" when errors occur ✅
- Network tab shows 401/400 status codes for failed attempts ✅

---

## ✅ Success Criteria

All tests pass if:
1. ✅ Toast notifications appear in top-right
2. ✅ Error toasts show red X icon
3. ✅ Success toasts show green checkmark icon
4. ✅ Messages are clear and readable
5. ✅ Toasts auto-dismiss after 3 seconds
6. ✅ No demo credential boxes visible on pages
7. ✅ Form remains usable after error

---

## 🚨 If Toasts Don't Appear

### Check 1: Servers Running
```bash
# Backend should show:
🏦 Veritas Bank API running on http://localhost:3000

# Frontend should show:
➜  Local:   http://localhost:5173/
```

### Check 2: Browser Console
- Press F12
- Look for errors in Console tab
- Check Network tab for API calls

### Check 3: react-hot-toast Installed
```bash
cd frontend
npm list react-hot-toast
# Should show: react-hot-toast@2.x.x
```

### Check 4: Toaster Component in main.tsx
- File: `frontend/src/main.tsx`
- Should have: `<Toaster position="top-right" ... />`

---

## 📸 Expected Visual Result

### Login Page (Clean, No Demo Box)
```
┌────────────────────────────────────┐
│           Veritas Bank             │
│          Welcome Back              │
│  Sign in to continue to your       │
│           account                  │
│                                    │
│  Email Address                     │
│  [                             ]   │
│                                    │
│  Password                          │
│  [                             ]   │
│                                    │
│  [        Sign In        ]         │
└────────────────────────────────────┘
```

### Error Toast (Top-Right)
```
                    ┌──────────────────────────────────┐
                    │ ✕ Invalid email or password.     │
                    │   Please check your credentials. │
                    └──────────────────────────────────┘
```

### Success Toast (Top-Right)
```
                    ┌──────────────────────────────────┐
                    │ ✓ Welcome back, John!            │
                    └──────────────────────────────────┘
```

---

## 🎉 All Features Working

If all tests pass, you should see:
- ✅ Clean login pages without demo credential boxes
- ✅ Toast notifications appearing for all actions
- ✅ Clear error messages for invalid credentials
- ✅ Success messages for valid logins
- ✅ Professional, modern UI
- ✅ Smooth user experience

---

*Test Guide Created: September 8, 2026*  
*Status: Ready for Testing*

