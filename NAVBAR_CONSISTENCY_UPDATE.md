# Navbar Consistency Update

## Status: IN PROGRESS

### Objective
Apply the professional navbar component consistently across all dashboard pages to match the mobile banking app design.

### Navbar Features
- Dark blue background (#1e3a5f)
- Bank name "veritasbank" in white (no logo image)
- Notification bell with red badge showing "7"
- User avatar icon
- More options menu (three dots)
- Hamburger menu for mobile sidebar toggle

### Pages Updated

#### ✅ Completed
1. **DashboardPage.tsx** - Already implemented with navbar and sidebar
2. **TransferPage.tsx** - Updated with navbar, sidebar, and logout functionality

#### 🚧 In Progress
3. **DepositPage.tsx** - Needs navbar integration
4. **WithdrawPage.tsx** - Needs navbar integration
5. **TransactionsPage.tsx** - Needs navbar integration
6. **SavingsPage.tsx** - Needs navbar integration
7. **SupportPage.tsx** - Needs navbar integration
8. **ProfilePage.tsx** - Needs navbar integration

### Implementation Pattern

Each page should follow this structure:

```tsx
import Navbar from '../components/Navbar'
import { useNavigate } from 'react-router-dom'

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
        {/* Sidebar Overlay */}
        {showSidebar && (
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowSidebar(false)}></div>
        )}

        {/* Sidebar with SVG profile icon and navigation */}
        <aside className={`fixed inset-y-0 left-0 transform ${showSidebar ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-out w-72 bg-white z-50 flex flex-col shadow-lg border-r border-gray-100`}>
          {/* Sidebar content */}
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-72 overflow-auto pb-20 lg:pb-0 bg-gray-50">
          <Navbar onMenuClick={() => setShowSidebar(true)} />
          
          <div className="p-6 max-w-7xl mx-auto">
            {/* Page content */}
          </div>
        </main>
      </div>

      <MobileBottomNav />
      <AIChatbot />
    </>
  )
}
```

### Sidebar Navigation Items
All pages should include the same sidebar menu:
- Dashboard (grid icon)
- Send Money (paper plane icon) - highlights on TransferPage
- Exchange Money (arrows icon)
- Wire Transfer (building icon)
- Payment Request (card icon)
- Deposit Money (plus circle icon) - highlights on DepositPage
- Withdraw Money (minus circle icon) - highlights on WithdrawPage
- Savings (dollar icon) - highlights on SavingsPage

### Design Guidelines
- NO emojis
- NO AI-looking styles
- Generic SVG profile icon (gray silhouette)
- Right arrows on sidebar menu items
- Clean professional banking aesthetic
- Consistent spacing and padding
- Account numbers formatted as 8 digits (e.g., "20261084")

### Next Steps
1. Apply navbar to DepositPage
2. Apply navbar to WithdrawPage
3. Apply navbar to TransactionsPage
4. Apply navbar to SavingsPage
5. Apply navbar to SupportPage
6. Apply navbar to ProfilePage
7. Test all pages for consistent navigation
8. Verify logout functionality works on all pages

## Notes
- The navbar is sticky at top with z-index 30
- Sidebar is fixed with z-index 50
- Mobile overlay has z-index 40
- Proper responsive design for mobile and desktop
- Sidebar auto-hides on mobile, always visible on desktop (lg breakpoint)
