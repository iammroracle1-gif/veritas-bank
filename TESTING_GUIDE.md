# Testing Guide - Transfer Restriction Feature

## Prerequisites
- Backend deployed: `https://veritas-bank-0dru.onrender.com`
- Frontend deployed: `https://veritas-bank-frontend-eosin.vercel.app`
- Database initialized with admin account

## Step 1: Initialize Database (If Not Done)
Run this in browser console on the frontend:
```javascript
fetch('https://veritas-bank-0dru.onrender.com/api/seed/initialize', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'}
}).then(r => r.json()).then(console.log)
```

## Step 2: Create Test User
1. Go to: `https://veritas-bank-frontend-eosin.vercel.app/register`
2. Register a new user:
   - Email: test1@example.com
   - Password: Test@12345
   - First Name: Test
   - Last Name: User
   - Phone: +1234567890

3. Create a second test user:
   - Email: test2@example.com
   - Password: Test@12345
   - First Name: Test2
   - Last Name: User2

## Step 3: Load Balance to Test Users (Admin)
1. Login as admin: `https://veritas-bank-frontend-eosin.vercel.app/admin/login`
   - Email: admin@veritasbank.com
   - Password: Admin@123

2. Go to Users section
3. Find test1@example.com
4. Note their account number (12 digits starting with 2025)
5. Adjust balance: Add $500

6. Repeat for test2@example.com

## Step 4: Test Transfer Limit (User Side)
1. Logout from admin
2. Login as test1@example.com

### First Transfer:
3. Go to "Send Money"
4. Enter test2's account number
5. Enter amount: $50
6. Click "Send Money"
7. ✅ Expected: Transfer successful, balance updated

### Second Transfer:
8. Go to "Send Money" again
9. Enter test2's account number
10. Enter amount: $30
11. Click "Send Money"
12. ✅ Expected: Transfer successful + warning toast "You have reached your transfer limit"

### Third Transfer (Restricted):
13. Try to send money again
14. Enter test2's account number
15. Enter amount: $20
16. Click "Send Money"
17. ✅ Expected: **Transfer Restriction Modal appears** with:
    - Pink/red gradient background
    - Warning icon
    - Message: "Sorry, you can not transfer with your account!"
    - Email: info@bvalimited.online (clickable)
    - WhatsApp button: +16722848285 (clickable)
    - Close button (X)

18. Click WhatsApp button
19. ✅ Expected: Opens WhatsApp in new tab with number +16722848285

## Step 5: Test Admin Transaction Cancel
1. Logout and login as admin
2. Go to Transactions section
3. Find one of test1's transfers
4. Click "Cancel Transaction"
5. Enter reason: "Test cancellation"
6. Confirm cancellation
7. ✅ Expected:
   - Transaction status changed to CANCELLED
   - Reversal transaction created
   - User balance restored
   - User transferCount decremented

8. Login as test1@example.com again
9. Try to make a transfer
10. ✅ Expected: Since one transfer was cancelled, user should be able to make another transfer

## Step 6: Test Real-Time Balance Sync
1. Keep user dashboard open (test1@example.com)
2. In another browser/tab, login as admin
3. Adjust test1's balance (add $100)
4. Go back to user dashboard
5. Refresh the page
6. ✅ Expected: Balance updated immediately

## API Endpoints to Test Manually

### Transfer Endpoint (User)
```javascript
// Run in browser console while logged in as user
const token = localStorage.getItem('token')
fetch('https://veritas-bank-0dru.onrender.com/api/transactions/transfer', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    recipientAccountNumber: '202512345678', // Replace with actual account number
    amount: 25,
    description: 'Test transfer'
  })
}).then(r => r.json()).then(console.log)
```

### Cancel Transaction (Admin)
```javascript
// Run in browser console while logged in as admin
const token = localStorage.getItem('token')
const transactionId = 'transaction-id-here' // Replace with actual transaction ID
fetch(`https://veritas-bank-0dru.onrender.com/api/admin/transactions/${transactionId}/cancel`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    reason: 'Test cancellation'
  })
}).then(r => r.json()).then(console.log)
```

### Load Balance (Admin)
```javascript
// Run in browser console while logged in as admin
const token = localStorage.getItem('token')
const userId = 'user-id-here' // Replace with actual user ID
fetch(`https://veritas-bank-0dru.onrender.com/api/admin/users/${userId}/adjust-balance`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    amount: 100,
    reason: 'Test balance load',
    description: 'Adding funds for testing'
  })
}).then(r => r.json()).then(console.log)
```

## Expected Results Summary

| Action | Expected Result |
|--------|----------------|
| 1st Transfer | ✅ Success |
| 2nd Transfer | ✅ Success + Warning |
| 3rd Transfer | ❌ Restriction Modal |
| Admin Cancel | ✅ Balance Reversed + Counter Decremented |
| After Cancel | ✅ Can Transfer Again |
| Balance Load | ✅ Immediate Sync |
| WhatsApp Button | ✅ Opens WhatsApp |

## Troubleshooting

### If transfer fails:
- Check browser console for errors
- Verify user has sufficient balance
- Verify recipient account number exists
- Check that backend is running (Render may sleep after inactivity)

### If modal doesn't appear:
- Check browser console for React errors
- Verify frontend build deployed successfully
- Clear browser cache and reload

### If admin can't cancel:
- Verify logged in as admin (not regular user)
- Check transaction ID is valid
- Verify transaction isn't already cancelled

## Deployment Status Check
```javascript
// Check backend status
fetch('https://veritas-bank-0dru.onrender.com/health')
  .then(r => r.json())
  .then(console.log)

// Check if user is logged in
console.log('Token:', localStorage.getItem('token') ? 'Present' : 'Missing')
console.log('User:', JSON.parse(localStorage.getItem('user') || '{}'))
```
