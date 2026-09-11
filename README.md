# 🏦 Veritas Bank V2.0

<div align="center">

**Modern Banking Platform Built with React, TypeScript, Node.js & PostgreSQL**

*Featuring iOS-inspired design with Web3 aesthetics*

[Features](#features) • [Tech Stack](#tech-stack) • [Quick Start](#quick-start) • [Documentation](#documentation)

</div>

---

## ✨ Features

### 👤 User Features
- 🔐 **Secure Authentication** - JWT-based login with encrypted passwords
- 📊 **Modern Dashboard** - Beautiful iOS-inspired interface with real-time balance
- 💸 **Transaction Management** - Create, view, and track all transactions
- 🌍 **Multi-Currency Support** - 10+ currencies with live exchange rates
- 🎯 **Savings Goals** - Set and track financial goals
- 🎫 **Support System** - Submit and manage support tickets
- 👤 **Profile Management** - Update personal information and preferences

### 🛡️ Admin Features
- 📈 **Analytics Dashboard** - System-wide statistics and insights
- 👥 **User Management** - View, search, filter, and manage all users
- 💰 **Balance Adjustments** - Add/remove funds with full audit trail
- 🔍 **Transaction Monitoring** - View all system transactions
- 📝 **Audit Logs** - Complete trail of all administrative actions
- 🔒 **Role-Based Access** - Secure admin-only features

### 🎨 Design Features
- 📱 **Fully Responsive** - Perfect on mobile, tablet, and desktop
- 🌓 **Dark Mode** - Beautiful dark theme by default
- ✨ **Smooth Animations** - Framer Motion for buttery transitions
- 🔮 **Glassmorphism** - Modern glass effects and gradients
- 🎯 **iOS Aesthetic** - Clean, minimal, intuitive design
- 🌈 **Web3 Vibes** - Gradient cards and modern color schemes

---

## 🛠️ Tech Stack

### Frontend
```
React 18          - Modern UI library
TypeScript        - Type-safe JavaScript
Vite              - Lightning-fast build tool
TailwindCSS       - Utility-first CSS framework
Framer Motion     - Smooth animations
React Query       - Data fetching & caching
Zustand           - State management
React Router      - Navigation
React Hook Form   - Form handling
Heroicons         - Beautiful icons
React Hot Toast   - Notifications
```

### Backend
```
Node.js           - JavaScript runtime
Express           - Web framework
TypeScript        - Type-safe JavaScript
PostgreSQL        - Relational database
Prisma            - Modern ORM
JWT               - Authentication
bcryptjs          - Password hashing
Express Validator - Input validation
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ ([Download](https://nodejs.org/))
- PostgreSQL 14+ ([Download](https://www.postgresql.org/download/))

### Installation

**1. Create Database**
```sql
CREATE DATABASE veritas_bank;
```

**2. Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npx prisma generate
npx prisma migrate dev
npm run prisma:seed
npm run dev
```

**3. Frontend Setup** (New Terminal)
```bash
cd frontend
npm install
npm run dev
```

**4. Open Browser**
```
http://localhost:5173
```

### Default Credentials

**Admin Account**
```
Email: admin@veritasbank.com
Password: Admin@123
```

**Test User Account**
```
Email: user@veritasbank.com
Password: User@123
```

⚠️ **Change these in production!**

---

## 📚 Documentation

- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Detailed setup instructions
- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Complete project overview
- **[QUICK_START_WINDOWS.md](./QUICK_START_WINDOWS.md)** - Windows-specific guide

---

## 📁 Project Structure

```
veritas-v2/
├── backend/              # Node.js + Express API
│   ├── prisma/          # Database schema & migrations
│   ├── src/
│   │   ├── controllers/ # Business logic
│   │   ├── routes/      # API endpoints
│   │   ├── middleware/  # Auth & validation
│   │   └── utils/       # Helper functions
│   └── .env.example     # Environment template
│
├── frontend/            # React application
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API calls
│   │   ├── stores/      # State management
│   │   └── types/       # TypeScript types
│   └── public/          # Static assets
│
└── README.md            # This file
```

---

## 🎨 Customization

### Change Colors
Edit `frontend/tailwind.config.js`:
```javascript
colors: {
  primary: {
    500: '#ff6b35', // Your brand color
    // ...
  }
}
```

### Change Logo
Replace files in `frontend/public/images/`

### Add Features
Create new pages in `frontend/src/pages/`

---

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy dist/ folder
```

### Backend (Railway/Render)
```bash
cd backend
npm run build
# Deploy with DATABASE_URL env variable
```

### Recommended Platforms
- **Frontend**: Vercel, Netlify, Cloudflare Pages
- **Backend**: Railway, Render, Heroku
- **Database**: Railway, Supabase, Neon, AWS RDS

---

## 🔒 Security

- ✅ JWT authentication
- ✅ Password hashing (bcrypt)
- ✅ Input validation
- ✅ SQL injection prevention (Prisma)
- ✅ CORS protection
- ✅ Rate limiting ready
- ✅ XSS protection

**Production Checklist:**
- [ ] Change JWT_SECRET
- [ ] Update default passwords
- [ ] Enable HTTPS
- [ ] Configure CORS
- [ ] Set up backups
- [ ] Monitor logs

---

## 📊 Database Schema

```
users
├── User accounts (both users & admins)
├── Authentication & profile info
└── Role-based access control

accounts
└── User balances in base currency

transactions
├── All financial transactions
├── Demo credits/debits
└── Admin adjustments

currencies
└── Multi-currency exchange rates

savings_goals
└── User savings tracking

support_requests
└── Support ticket system

audit_logs
└── Admin action tracking
```

---

## 🛣️ API Endpoints

### Authentication
```
POST   /api/auth/register      # Register new user
POST   /api/auth/login         # Login
GET    /api/auth/me            # Get current user
POST   /api/auth/refresh       # Refresh token
```

### Users
```
GET    /api/users/profile      # Get profile
PUT    /api/users/profile      # Update profile
GET    /api/users/dashboard    # Dashboard data
```

### Transactions
```
GET    /api/transactions       # List transactions
POST   /api/transactions/demo  # Create demo transaction
GET    /api/transactions/:ref  # Get by reference
```

### Admin
```
GET    /api/admin/dashboard             # Admin stats
GET    /api/admin/users                 # All users
GET    /api/admin/users/:id             # User details
PATCH  /api/admin/users/:id/status      # Update status
POST   /api/admin/users/:id/adjust-balance  # Adjust balance
GET    /api/admin/transactions          # All transactions
```

[See full API documentation in `backend/src/routes/`]

---

## 🧪 Development

### Run Both Servers
```bash
# From project root
npm install
npm run dev
```

### Backend Only
```bash
cd backend
npm run dev
```

### Frontend Only
```bash
cd frontend
npm run dev
```

### Database GUI
```bash
cd backend
npx prisma studio
```

---

## 📝 Scripts

### Backend
```bash
npm run dev         # Development server
npm run build       # Build for production
npm start           # Start production server
npm run prisma:studio  # Database GUI
npm run prisma:migrate # Run migrations
npm run prisma:seed    # Seed database
```

### Frontend
```bash
npm run dev         # Development server
npm run build       # Build for production
npm run preview     # Preview production build
```

---

## 🐛 Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check DATABASE_URL in `.env`
- Ensure database exists

### Port Conflicts
- Backend (3000): Change PORT in `backend/.env`
- Frontend (5173): Change in `frontend/vite.config.ts`

### Module Not Found
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📈 Performance

- ⚡ **Fast Initial Load** - Vite optimized builds
- 🚀 **Instant Navigation** - Client-side routing
- 💾 **Smart Caching** - React Query
- 📦 **Code Splitting** - Lazy loading ready
- 🎯 **Optimized Images** - Next-gen formats ready

---

## 🤝 Contributing

This is a proprietary project for Veritas Bank. For internal development:

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit for review

---

## 📄 License

Proprietary - Veritas Bank © 2026

---

## 🙏 Acknowledgments

- Built with modern best practices
- Inspired by leading fintech apps
- Designed for scalability and performance

---

## 📞 Support

For technical support or questions:
- Email: support@veritasbank.com
- Check documentation files
- Review terminal logs
- Inspect browser console

---

<div align="center">

**Made with ❤️ for Veritas Bank**

*Modern Banking, Beautiful Design, Powerful Technology*

[⬆ Back to Top](#-veritas-bank-v20)

</div>
