interface NavbarProps {
  onMenuClick: () => void
  notificationCount?: number
}

export default function Navbar({ onMenuClick, notificationCount = 0 }: NavbarProps) {

  return (
    <header className="bg-[#1e3a5f] fixed top-0 left-0 right-0 z-30 lg:left-72">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left: Hamburger Menu (Mobile) / Bank Name */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-white tracking-wide">
            veritasbank
          </h1>
        </div>

        {/* Right: Notification Bell */}
        <div className="flex items-center">
          {/* Notification Bell with Badge */}
          <a
            href="/dashboard/notifications"
            className="relative text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {/* Red Badge - only show when count > 0 */}
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 flex items-center justify-center min-w-[20px] h-5 px-1 text-xs font-bold text-white bg-red-500 rounded-full">
                {notificationCount > 99 ? '99+' : notificationCount}
              </span>
            )}
          </a>
        </div>
      </div>
    </header>
  )
}
