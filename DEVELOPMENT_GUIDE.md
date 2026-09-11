# 🛠️ Veritas Bank V2.0 - Development Guide

A comprehensive guide for developers working on Veritas Bank V2.0

---

## 🚀 Getting Started as a Developer

### Prerequisites Knowledge
- **JavaScript/TypeScript** - Core language
- **React** - Component-based UI
- **Node.js** - Backend runtime
- **PostgreSQL** - Database basics
- **REST APIs** - HTTP methods, endpoints
- **Git** - Version control

### Recommended Tools
- **VS Code** - Code editor
- **Postman/Thunder Client** - API testing
- **PostgreSQL GUI** - pgAdmin or Prisma Studio
- **React DevTools** - Browser extension
- **Git Client** - GitHub Desktop or CLI

---

## 📁 Understanding the Codebase

### Architecture Overview

```
Frontend (React)  ←→  Backend (Express)  ←→  Database (PostgreSQL)
    ↓                      ↓                       ↓
  Pages              Controllers            Prisma Schema
  Components         Routes                 Tables
  Services (API)     Middleware             Relations
  Stores (State)     Utils                  Migrations
```

### Data Flow Example

**User Login Flow:**
```
1. User enters credentials in LoginPage.tsx
2. Form submits to authApi.login() in services/api.ts
3. API call hits backend /api/auth/login
4. auth.routes.ts routes to auth.controller.ts
5. Controller validates and queries database via Prisma
6. Returns JWT token
7. Frontend stores token in authStore (Zustand)
8. User redirected to dashboard
```

---

## 🗂️ File Structure Explained

### Backend Structure

```
backend/src/
├── controllers/          # Business logic
│   ├── auth.controller.ts      - Login, register
│   └── [feature].controller.ts - Feature logic
│
├── routes/              # API endpoints
│   ├── auth.routes.ts          - Auth endpoints
│   └── [feature].routes.ts     - Feature endpoints
│
├── middleware/          # Request processing
│   └── auth.middleware.ts      - JWT validation
│
├── utils/              # Helper functions
│   └── helpers.ts              - Utilities
│
├── prisma/             # Database
│   └── seed.ts                 - Initial data
│
└── index.ts            # Server entry point
```

### Frontend Structure

```
frontend/src/
├── pages/                # Route pages
│   ├── LandingPage.tsx         - Home page
│   ├── LoginPage.tsx           - Login
│   ├── DashboardPage.tsx       - User dashboard
│   └── admin/                  - Admin pages
│
├── components/          # Reusable UI
│   └── layouts/                - Layout components
│       ├── MainLayout.tsx      - User layout
│       └── AdminLayout.tsx     - Admin layout
│
├── services/           # API communication
│   └── api.ts                  - All API calls
│
├── stores/            # State management
│   └── authStore.ts            - Auth state
│
├── types/             # TypeScript definitions
│   └── index.ts                - Type definitions
│
├── App.tsx            # Main app + routing
└── main.tsx           # React entry point
```

---

## 🔧 Common Development Tasks

### 1. Adding a New Page

**Frontend Steps:**

```typescript
// 1. Create the page component
// frontend/src/pages/NewPage.tsx
export default function NewPage() {
  return (
    <div className="card p-6">
      <h1 className="text-2xl font-bold mb-4">New Page</h1>
      <p>Content here</p>
    </div>
  )
}

// 2. Add route in App.tsx
<Route
  path="/new-page"
  element={
    <ProtectedRoute>
      <MainLayout>
        <NewPage />
      </MainLayout>
    </ProtectedRoute>
  }
/>

// 3. Add navigation link in MainLayout.tsx
const navigation = [
  // ... existing items
  { name: 'New Page', href: '/new-page', icon: StarIcon },
]
```

### 2. Adding a New API Endpoint

**Backend Steps:**

```typescript
// 1. Create controller function
// backend/src/controllers/feature.controller.ts
export const getFeatureData = async (req: AuthRequest, res: Response) => {
  try {
    const data = await prisma.feature.findMany({
      where: { userId: req.user!.id }
    })
    res.json({ data })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' })
  }
}

// 2. Create route
// backend/src/routes/feature.routes.ts
import { Router } from 'express'
import * as featureController from '../controllers/feature.controller'
import { authenticateToken } from '../middleware/auth.middleware'

const router = Router()
router.get('/', authenticateToken, featureController.getFeatureData)
export default router

// 3. Register route in index.ts
import featureRoutes from './routes/feature.routes'
app.use('/api/feature', featureRoutes)
```

**Frontend API Call:**

```typescript
// frontend/src/services/api.ts
export const featureApi = {
  getData: () => api.get('/feature'),
}

// Usage in component
import { useQuery } from '@tanstack/react-query'
import { featureApi } from '../services/api'

const { data } = useQuery({
  queryKey: ['feature'],
  queryFn: () => featureApi.getData(),
})
```

### 3. Adding a Database Table

```typescript
// 1. Add to Prisma schema
// backend/prisma/schema.prisma
model NewFeature {
  id        String   @id @default(uuid())
  userId    String   @map("user_id")
  name      String
  createdAt DateTime @default(now()) @map("created_at")
  
  user User @relation(fields: [userId], references: [id])
  
  @@map("new_features")
}

// 2. Run migration
// Terminal: backend/
npx prisma migrate dev --name add_new_feature

// 3. Update seed if needed
// backend/src/prisma/seed.ts
await prisma.newFeature.create({
  data: {
    userId: user.id,
    name: 'Example'
  }
})
```

### 4. Customizing Design

```javascript
// Change colors
// frontend/tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#YOUR_COLOR_HERE',
        },
      },
    },
  },
}

// Use in components
<button className="bg-primary-500 text-white">
  Click Me
</button>
```

---

## 🎨 Styling Guidelines

### TailwindCSS Best Practices

```typescript
// ✅ Good - Utility classes
<div className="flex items-center justify-between p-6 rounded-xl bg-white shadow-card">

// ❌ Avoid - Inline styles
<div style={{ display: 'flex', padding: '24px' }}>

// ✅ Good - Reusable component
const Card = ({ children }) => (
  <div className="card p-6">
    {children}
  </div>
)

// ✅ Good - Conditional classes
<div className={`badge ${isActive ? 'badge-success' : 'badge-warning'}`}>
```

### Custom Components

```typescript
// Use class names from index.css
<button className="btn-primary">
  Click Me
</button>

// Available classes:
// - btn, btn-primary, btn-secondary, btn-ghost
// - card, card-dark
// - glass, glass-dark
// - badge, badge-success, badge-warning, badge-danger
// - input
// - gradient-primary, gradient-success, etc.
```

---

## 🔐 Authentication Flow

### How Auth Works

```
1. User logs in → credentials sent to /api/auth/login
2. Backend validates → returns JWT token
3. Frontend stores token → Zustand persist (localStorage)
4. All API calls → include token in Authorization header
5. Backend middleware → validates token on protected routes
6. Token expires → user must login again
```

### Protecting Routes

```typescript
// Frontend - Wrap with ProtectedRoute
<Route
  path="/protected"
  element={
    <ProtectedRoute>
      <YourComponent />
    </ProtectedRoute>
  }
/>

// Backend - Use authenticateToken middleware
router.get('/protected', authenticateToken, controller)

// Admin only - Use requireAdmin
router.get('/admin', authenticateToken, requireAdmin, controller)
```

---

## 🗄️ Database Patterns

### Common Queries

```typescript
// Find one
const user = await prisma.user.findUnique({
  where: { email: 'user@example.com' }
})

// Find many with filter
const transactions = await prisma.transaction.findMany({
  where: { userId: user.id },
  orderBy: { createdAt: 'desc' },
  take: 10
})

// Create
const transaction = await prisma.transaction.create({
  data: {
    userId: user.id,
    amount: 100,
    currency: 'USD'
  }
})

// Update
await prisma.user.update({
  where: { id: user.id },
  data: { firstName: 'New Name' }
})

// Delete
await prisma.transaction.delete({
  where: { id: txnId }
})

// Include relations
const user = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    account: true,
    transactions: true
  }
})
```

---

## ⚡ Performance Tips

### Frontend

```typescript
// ✅ Use React Query for caching
const { data } = useQuery({
  queryKey: ['users'],
  queryFn: userApi.getAll,
  staleTime: 5 * 60 * 1000, // 5 minutes
})

// ✅ Lazy load pages
const AdminPage = lazy(() => import('./pages/admin/AdminPage'))

// ✅ Memoize expensive computations
const expensiveValue = useMemo(() => computeValue(data), [data])

// ✅ Use pagination
?page=1&limit=20
```

### Backend

```typescript
// ✅ Use select to get only needed fields
const users = await prisma.user.findMany({
  select: {
    id: true,
    firstName: true,
    lastName: true
    // Don't fetch password, etc.
  }
})

// ✅ Use indexes (already in schema.prisma)
@@index([email])
@@index([createdAt])

// ✅ Batch operations
await prisma.transaction.createMany({
  data: arrayOfTransactions
})
```

---

## 🐛 Debugging

### Frontend Debugging

```typescript
// Console logging
console.log('User:', user)
console.table(transactions)

// React DevTools
// Install extension, inspect components

// Network tab
// F12 → Network → See API calls

// React Query DevTools
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
<ReactQueryDevtools />
```

### Backend Debugging

```typescript
// Console logging
console.log('Request body:', req.body)
console.error('Error:', error)

// Prisma query logging
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

// VS Code debugger
// Set breakpoints, F5 to start debugging
```

### Database Debugging

```bash
# Prisma Studio - Visual database editor
cd backend
npx prisma studio

# Direct SQL queries
psql -U postgres -d veritas_bank
SELECT * FROM users;

# Check migrations
npx prisma migrate status
```

---

## 🧪 Testing

### Manual Testing Checklist

```
User Features:
- [ ] Register new account
- [ ] Login with credentials
- [ ] View dashboard
- [ ] Create demo transaction
- [ ] View transaction history
- [ ] Create savings goal
- [ ] Submit support ticket
- [ ] Update profile
- [ ] Logout

Admin Features:
- [ ] Login as admin
- [ ] View admin dashboard
- [ ] Search/filter users
- [ ] View user details
- [ ] Change user status
- [ ] Adjust user balance
- [ ] View all transactions
- [ ] Check audit logs
```

### API Testing with Postman

```
1. Create Collection: Veritas Bank API

2. Add Environment:
   - BASE_URL: http://localhost:3000/api
   - TOKEN: (will set after login)

3. Test Endpoints:
   POST {{BASE_URL}}/auth/login
   Body: { "email": "user@veritasbank.com", "password": "User@123" }
   
   GET {{BASE_URL}}/users/profile
   Headers: Authorization: Bearer {{TOKEN}}
```

---

## 🚀 Deployment Checklist

### Pre-Deployment

```
Backend:
- [ ] Change JWT_SECRET in production
- [ ] Update CORS_ORIGIN
- [ ] Set NODE_ENV=production
- [ ] Configure production database URL
- [ ] Run migrations on production DB
- [ ] Test all API endpoints

Frontend:
- [ ] Update VITE_API_URL to production API
- [ ] Build optimized bundle (npm run build)
- [ ] Test production build locally
- [ ] Verify all routes work
- [ ] Check mobile responsiveness

Security:
- [ ] Change default admin password
- [ ] Review all environment variables
- [ ] Enable HTTPS
- [ ] Set up rate limiting
- [ ] Configure proper CORS
```

---

## 📝 Code Style Guide

### TypeScript

```typescript
// Use interfaces for objects
interface User {
  id: string
  email: string
  firstName: string
}

// Use types for unions
type Status = 'active' | 'pending' | 'suspended'

// Use async/await
const fetchData = async () => {
  const response = await api.get('/data')
  return response.data
}

// Handle errors properly
try {
  const data = await fetchData()
} catch (error) {
  console.error('Error:', error)
  toast.error('Failed to fetch data')
}
```

### React Components

```typescript
// Functional components with TypeScript
interface Props {
  user: User
  onUpdate: (user: User) => void
}

export default function UserCard({ user, onUpdate }: Props) {
  return (
    <div className="card">
      <h3>{user.firstName}</h3>
    </div>
  )
}

// Use hooks properly
const [state, setState] = useState<Type>(initialValue)
const value = useMemo(() => compute(), [deps])
useEffect(() => {
  // effect
  return () => {
    // cleanup
  }
}, [deps])
```

### Naming Conventions

```
Files:
- Components: PascalCase (UserCard.tsx)
- Utilities: camelCase (helpers.ts)
- Pages: PascalCase with Page suffix (DashboardPage.tsx)

Variables:
- camelCase for variables and functions
- PascalCase for components and types
- UPPER_CASE for constants

Database:
- snake_case for columns (first_name)
- camelCase in Prisma models (firstName)
```

---

## 🔍 Common Issues & Solutions

### Issue: Port Already in Use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or change port in .env (backend)
PORT=3001
```

### Issue: Prisma Client Out of Sync
```bash
cd backend
npx prisma generate
```

### Issue: Database Connection Failed
```bash
# Check PostgreSQL is running
# Verify DATABASE_URL in backend/.env
# Test connection:
psql -U postgres -d veritas_bank
```

### Issue: Module Not Found
```bash
# Delete and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: CORS Error
```typescript
// backend/.env
CORS_ORIGIN=http://localhost:5173

// Or update backend/src/index.ts
app.use(cors({ origin: 'http://localhost:5173' }))
```

---

## 📚 Learning Resources

### React
- [React Docs](https://react.dev)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

### TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Prisma
- [Prisma Docs](https://www.prisma.io/docs)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)

### TailwindCSS
- [Tailwind Docs](https://tailwindcss.com/docs)

### Framer Motion
- [Framer Motion Docs](https://www.framer.com/motion/)

---

## 🎯 Next Development Steps

### Immediate Improvements
1. Add unit tests (Jest + React Testing Library)
2. Add integration tests
3. Set up CI/CD pipeline
4. Add error boundaries
5. Implement rate limiting
6. Add request logging
7. Set up monitoring (Sentry)

### Feature Ideas
1. Two-factor authentication (2FA)
2. Email notifications
3. Transaction export (PDF/CSV)
4. Account statements
5. Beneficiary management
6. Recurring transactions
7. Mobile app (React Native)
8. Real-time notifications (WebSocket)
9. Advanced analytics dashboard
10. Dark/light mode toggle

---

## 🤝 Contributing Guidelines

### Before Making Changes
1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes
3. Test thoroughly
4. Commit with clear message
5. Push and create pull request

### Commit Message Format
```
feat: Add user profile page
fix: Correct transaction calculation
docs: Update README
style: Format code
refactor: Simplify auth logic
test: Add user tests
```

---

## 📞 Getting Help

1. **Check Documentation** - Read relevant .md files
2. **Check Console** - Look for error messages
3. **Check Logs** - Backend terminal, frontend terminal
4. **Search Codebase** - Similar patterns might exist
5. **Test Isolated** - Isolate the problem
6. **Stack Overflow** - Search for similar issues

---

## ✅ Developer Checklist

- [ ] I understand the project structure
- [ ] I can run both frontend and backend
- [ ] I can make API calls successfully
- [ ] I can query the database
- [ ] I know how to add a new page
- [ ] I know how to add a new API endpoint
- [ ] I know how to style components
- [ ] I can debug issues
- [ ] I follow the code style guide
- [ ] I test my changes

---

Happy coding! 🚀✨
