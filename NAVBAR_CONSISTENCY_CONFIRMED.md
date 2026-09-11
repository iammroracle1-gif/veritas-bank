# Navbar Consistency - CONFIRMED

## Date: September 10, 2026

### Objective
Ensure ALL pages use the exact same Navbar component from the home/dashboard page.

---

## ✅ Navbar Component (Single Source of Truth)

**File**: `frontend/src/components/Navbar.tsx`

### Features:
- Dark blue background (#1e3a5f)
- Bank name "veritasbank" in white
- Hamburger menu (mobile only)
- Notification bell with red badge "7"
- User avatar icon
- More options menu (three dots)
- Fixed positioning: `fixed top-0 left-0 right-0 z-30 lg:left-72`

### This is the ONLY Navbar - used across ALL pages

---

## ✅ Pages Confirmed Using Same Navbar

### 1. **DashboardPage** ✅
```tsx
import Navbar from '../components/Navbar'
<Navbar onMenuClick={() => setShowSidebar(true)} />
```

### 2. **ProfilePage** ✅
```tsx
import Navbar from '../components/Navbar'
<Navbar onMenuClick={() => setShowSidebar(true)} />
```

### 3. **TransferPage** ✅
```tsx
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
<Navbar onMenuClick={() => setShowSidebar(true)} />
```

---

## 🔄 Pages Being Updated

### 4. **WithdrawPage** - Adding now
### 5. **DepositPage** - Need to add
### 6. **TransactionsPage** - Need to add
### 7. **SavingsPage** - Need to add
### 8. **SupportPage** - Need to add

---

## Implementation Pattern (EXACT SAME for all pages)

```tsx
// 1. Imports
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

// 2. State
const [showSidebar, setShowSidebar] = useState(false)

// 3. Logout handler
const handleLogout = () => {
  logout()
  navigate('/login')
  toast.success('Logged out successfully')
}

// 4. Layout structure
return (
  <>
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar 
        isOpen={showSidebar} 
        onClose={() => setShowSidebar(false)}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 overflow-auto pb-20 lg:pb-6 bg-gray-50">
        {/* SAME NAVBAR EVERYWHERE */}
        <Navbar onMenuClick={() => setShowSidebar(true)} />

        {/* Page content with proper top padding */}
        <div className="p-4 md:p-6 max-w-4xl mx-auto pt-16 md:pt-20">
          {/* Content here */}
        </div>
      </main>
    </div>

    <MobileBottomNav />
    <AIChatbot />
  </>
)
```

---

## Key Points

### ✅ Consistency Checklist:
- [ ] Import `Navbar` from `'../components/Navbar'`
- [ ] Import `Sidebar` from `'../components/Sidebar'`
- [ ] Use `<Navbar onMenuClick={() => setShowSidebar(true)} />`
- [ ] Place Navbar INSIDE `<main>` tag, BEFORE content
- [ ] Add `pt-16 md:pt-20` to content div for navbar spacing
- [ ] Main content: `flex-1 lg:ml-72` for sidebar spacing

### ✅ What Makes Navbar Consistent:
1. Same dark blue (#1e3a5f) background
2. Same "veritasbank" text
3. Same notification bell with badge
4. Same user icon
5. Same more menu
6. Same fixed positioning
7. Same responsive behavior

### ❌ What NOT to do:
- DON'T create different navbars per page
- DON'T modify navbar styles per page
- DON'T use different positioning
- DON'T change the color scheme

---

## Status

### ✅ Confirmed Consistent:
- Dashboard
- Profile  
- Transfer (just updated)

### 🚧 Updating Now:
- Withdraw
- Deposit
- Transactions
- Savings
- Support

---

## Result

ALL pages will have the EXACT same navbar from the home/dashboard page:
- Dark blue bar at top
- "veritasbank" logo
- Notification bell with "7" badge
- User avatar
- More menu
- Fixed at top, always visible
- Responsive hamburger menu on mobile

**ONE NAVBAR. ONE DESIGN. ALL PAGES.**
