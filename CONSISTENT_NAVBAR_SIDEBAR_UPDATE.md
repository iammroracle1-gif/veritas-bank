# Consistent Navbar & Sidebar Update - IN PROGRESS

## Date: September 10, 2026

### Objective
Apply consistent navbar and sidebar across all pages with modern, clean designs for Profile, Withdraw, Transfer, and other pages.

---

## ✅ Completed

### 1. **Reusable Sidebar Component Created**
- **File**: `frontend/src/components/Sidebar.tsx`
- **Features**:
  - Generic SVG profile icon (same as design)
  - User name display
  - Active route highlighting (blue background)
  - Right arrows on menu items
  - Logout button at bottom
  - Responsive (slides in/out on mobile)
  - Auto-closes on mobile when route changes

### 2. **Dashboard Updated**
- ✅ Now uses reusable Sidebar component
- ✅ Consistent navbar (fixed at top)
- ✅ Clean card-based design

### 3. **Profile Page Modernized**
- ✅ Consistent navbar and sidebar
- ✅ Uses same SVG avatar icon (not name initials)
- ✅ Clean, modern card layout
- ✅ Account information card
- ✅ Editable personal information
- ✅ Security section with password/2FA options
- ✅ Simple, professional design
- ✅ Responsive layout

---

## 🚧 To Do

### Pages Needing Updates:
1. **Transfer/Send Page** - Apply navbar, sidebar, modernize
2. **Withdraw Page** - Apply navbar, sidebar, modernize
3. **Deposit Page** - Apply navbar, sidebar
4. **Transactions Page** - Apply navbar, sidebar
5. **Savings Page** - Apply navbar, sidebar
6. **Support Page** - Apply navbar, sidebar

---

## Sidebar Features

### Navigation Items (with active highlighting):
- Dashboard (grid icon)
- Send Money (paper plane icon)
- Transactions (exchange arrows icon)
- Deposit (plus circle icon)
- Withdraw (minus circle icon)
- Savings (dollar icon)
- Support (help icon)
- Profile (user icon)

### Visual Design:
- Active route: Blue background (bg-blue-50) + blue text
- Inactive: Gray text, hover shows gray background
- Right arrows on all items
- Logout button: Red text, red hover background

---

## Profile Page Design

### Layout Structure:
```
┌─────────────────────────────────────┐
│ [Navbar - Fixed Top]                │
├─────────────────────────────────────┤
│ Profile Header Card                  │
│ • SVG Avatar (gray circle)           │
│ • Name                               │
│ • Email                              │
│ • Status Badge (green)               │
├─────────────────────────────────────┤
│ Account Information Card             │
│ • Account Number (clickable/copy)    │
│ • Role                               │
│ • Member Since                       │
├─────────────────────────────────────┤
│ Personal Information Card            │
│ • First Name / Last Name (editable)  │
│ • Email (disabled)                   │
│ • Phone (editable)                   │
│ • Currency (editable)                │
│ • Edit / Save / Cancel buttons       │
├─────────────────────────────────────┤
│ Security Card                        │
│ • Change Password button             │
│ • Enable 2FA button                  │
└─────────────────────────────────────┘
```

### Key Features:
- ✅ No gradient avatar with initials
- ✅ Same SVG icon as sidebar
- ✅ Clean white cards with shadow
- ✅ Simple borders and spacing
- ✅ Professional button styles
- ✅ Copy account number on click
- ✅ Edit mode toggle
- ✅ Responsive design

---

## Implementation Pattern for Remaining Pages

### Template Structure:
```tsx
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

export default function PageName() {
  const [showSidebar, setShowSidebar] = useState(false)
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
    toast.success('Logged out successfully')
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar 
          isOpen={showSidebar} 
          onClose={() => setShowSidebar(false)}
          onLogout={handleLogout}
        />

        <main className="flex-1 lg:ml-72 overflow-auto pb-20 lg:pb-6 bg-gray-50">
          <Navbar onMenuClick={() => setShowSidebar(true)} />

          <div className="p-4 md:p-6 max-w-7xl mx-auto pt-16 md:pt-20">
            {/* Page Content */}
          </div>
        </main>
      </div>

      <MobileBottomNav />
      <AIChatbot />
    </>
  )
}
```

---

## Design Guidelines

### ✅ Modern & Clean:
- White cards with subtle shadows
- Clean spacing (p-4, p-5, p-6)
- Simple rounded corners (rounded-lg)
- Professional gray color palette
- Blue accents for primary actions
- No gradients or colorful elements

### ✅ Consistent Elements:
- Fixed navbar at top (pt-16/pt-20 for content)
- Sidebar at left (w-72, hidden on mobile)
- Same SVG profile icon everywhere
- Consistent button styles
- Uniform card styling

### ✅ Professional Look:
- No AI-generated appearance
- Real banking app aesthetic
- Clean typography
- Proper hierarchy
- Functional design

---

## Status

### ✅ Complete:
1. Sidebar component created
2. Dashboard using new sidebar
3. Profile page modernized

### 🚧 Next:
1. Withdraw page - modern, simple design
2. Transfer page - modern, simple design
3. Apply to remaining pages

## Files Modified:
- `frontend/src/components/Sidebar.tsx` (NEW)
- `frontend/src/pages/DashboardPage.tsx` (UPDATED)
- `frontend/src/pages/ProfilePage.tsx` (UPDATED)

## Files To Update:
- `frontend/src/pages/WithdrawPage.tsx`
- `frontend/src/pages/TransferPage.tsx`
- `frontend/src/pages/DepositPage.tsx`
- `frontend/src/pages/TransactionsPage.tsx`
- `frontend/src/pages/SavingsPage.tsx`
- `frontend/src/pages/SupportPage.tsx`
