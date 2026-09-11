# Veritas Bank - Demo Banking Platform

A full-stack demonstration banking application with clean UI, real-time transactions, and admin controls.

## 🚀 Features

### User Features
- **Account Management**: Unique 12-digit numeric account numbers
- **Multi-Currency Support**: USD, EUR, GBP balances
- **Transactions**: Deposits, withdrawals, and transfers with instant balance updates
- **Transaction History**: Complete audit trail with reference numbers
- **Savings Goals**: Set and track financial targets
- **Support System**: Submit and track support tickets
- **Clean iOS-Style Dashboard**: Modern, professional interface

### Admin Features
- **User Management**: View and manage all user accounts
- **Balance Adjustment**: Load funds to user accounts
- **Account Restrictions**: Control user permissions (transfer, withdraw, deposit)
- **Transaction Oversight**: View all platform transactions
- **Audit Logs**: Complete trail of all administrative actions

## 🛠️ Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for blazing-fast development
- TailwindCSS for styling
- React Query for data management
- React Hook Form for form handling
- Zustand for state management
- Axios for API calls

### Backend
- Node.js with Express
- TypeScript
- Prisma ORM
- SQLite database (easily swappable for PostgreSQL/MySQL)
- JWT authentication
- Bcrypt for password hashing

## 📋 Prerequisites

- Node.js 16+ and npm
- Git

## 🔧 Installation

### 1. Clone Repository
```bash
git clone https://github.com/iammroracle1-gif/veritas-bank.git
cd veritas-bank
```

### 2. Install Dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Environment Setup

#### Backend (.env)
Create `backend/.env`:
```env
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET="your-super-secret-jwt-key-change-this"
JWT_EXPIRES_IN="7d"
PORT=3000
```

#### Frontend (.env)
Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:3000/api
```

### 4. Database Setup
```bash
cd backend
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
```

### 5. Start Development Servers

**Backend:**
```bash
cd backend
npm run dev
# Runs on http://localhost:3000
```

**Frontend:**
```bash
cd frontend
npm run dev
# Runs on http://localhost:5173
```

## 👤 Demo Accounts

### Regular User
- **Email**: user@veritasbank.com
- **Password**: User@123
- **Features**: Full access to user features

### Admin User
- **Email**: admin@veritasbank.com
- **Password**: Admin@123
- **Features**: Full admin control panel

## 📱 Key Features

### Security
- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ 7-day session expiration
- ✅ Role-based access control
- ✅ Complete audit logging

### Account System
- ✅ Unique 12-digit account numbers (format: 202512345678)
- ✅ New users start with $0 balance
- ✅ Individual account for each user
- ✅ Multi-currency balance tracking

### Transactions
- ✅ Real-time balance updates
- ✅ Transaction reference numbers
- ✅ Complete transaction history
- ✅ Previous/resulting balance tracking
- ✅ Transaction status tracking

### Admin Controls
- ✅ Balance adjustment with reason logging
- ✅ User restrictions (transfer/withdraw/deposit)
- ✅ Complete audit trail
- ✅ User account management
- ✅ Transaction oversight

## 🚀 Deployment

### Vercel (Frontend)
1. Push code to GitHub
2. Import repository in Vercel
3. Set build settings:
   - **Framework Preset**: Vite
   - **Root Directory**: frontend
   - **Build Command**: npm run build
   - **Output Directory**: dist
4. Add environment variable:
   - `VITE_API_URL`: Your backend API URL

### Backend Deployment
Deploy to:
- **Railway**: Easy PostgreSQL setup
- **Render**: Free tier available
- **Heroku**: Simple deployment
- **DigitalOcean**: Full control

**Environment Variables Required:**
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secure random string
- `JWT_EXPIRES_IN`: 7d
- `PORT`: 3000

## 📄 Documentation

- [Terms of Service](./TERMS_OF_SERVICE.md)
- [Privacy Policy](./PRIVACY_POLICY.md)

## 🔒 Important Notes

### Demo Platform
- This is a demonstration banking platform
- No real money is transferred
- All transactions are simulated
- For educational/demo purposes only

### Data Privacy
- Passwords are hashed (never stored in plain text)
- JWT tokens expire automatically
- Admin actions are fully logged
- Transaction history is permanent

## 🤝 Contributing

This is a demonstration project. Feel free to fork and modify for your own use.

## 📜 License

This project is for demonstration purposes. See Terms of Service for usage terms.

## 📞 Support

For questions or issues, use the in-app support system.

---

**Built with ❤️ for demonstration purposes**
