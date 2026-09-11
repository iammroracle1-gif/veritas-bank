import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import toast from 'react-hot-toast'

export default function LandingPage() {
  const { user, token, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50 h-16 md:h-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/">
              <img src="/images/ChatGPT_Image_Sep_7__2026__02_17_55_PM-removebg-preview.png" alt="Veritas Bank Logo" className="h-8 md:h-11" />
            </Link>
          </div>
          <div className="hidden lg:flex items-center flex-1 ml-12 space-x-6 xl:space-x-8">
            <a href="#home" className="text-sm xl:text-base text-gray-800 hover:text-primary-500 font-medium relative pb-1 after:content-[''] after:absolute after:bottom-[-5px] after:left-0 after:right-0 after:h-[3px] after:bg-primary-500 after:opacity-100 transition-opacity">Home</a>
            <a href="#about" className="text-sm xl:text-base text-gray-800 hover:text-primary-500 font-medium relative pb-1 after:content-[''] after:absolute after:bottom-[-5px] after:left-0 after:right-0 after:h-[3px] after:bg-primary-500 after:opacity-0 hover:after:opacity-100 after:transition-opacity">About</a>
            <a href="#contact" className="text-sm xl:text-base text-gray-800 hover:text-primary-500 font-medium relative pb-1 after:content-[''] after:absolute after:bottom-[-5px] after:left-0 after:right-0 after:h-[3px] after:bg-primary-500 after:opacity-0 hover:after:opacity-100 after:transition-opacity">Contact</a>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Search Box */}
            <div className="hidden xl:flex items-center bg-gray-100 rounded-full px-4 py-2 transition-shadow focus-within:shadow-md">
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none outline-none text-sm w-36 focus:w-48 transition-all"
              />
              <button className="text-gray-500 hover:text-primary-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
            
            {token && user ? (
              <>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full">
                  <div className="w-7 h-7 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold text-xs">
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                  <span className="text-xs md:text-sm font-medium text-gray-700 hidden md:inline">
                    {user.firstName} {user.lastName}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm bg-red-500 text-white rounded-full hover:bg-red-600 transition-all hover:shadow-lg font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className="flex items-center gap-1.5 px-3 sm:px-5 py-2 text-xs sm:text-sm bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-all hover:shadow-lg font-medium"
                >
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Register
                </Link>
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-3 sm:px-5 py-2 text-xs sm:text-sm bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-all hover:shadow-lg font-medium"
                >
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen pt-20 md:pt-24 flex items-center overflow-hidden bg-[url('https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2070')] bg-cover bg-center bg-fixed">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
        
        {/* Decorative Orange Line */}
        <div className="absolute top-0 left-0 w-1 h-32 bg-primary-500 rotate-45 origin-top-left opacity-0 animate-[lineSlideIn_0.8s_ease-out_0.3s_forwards]"></div>
        
        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 w-full py-12 md:py-20">
          <div className="max-w-3xl text-white opacity-0 animate-[fadeInUp_1s_ease-out_0.5s_forwards]">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 flex flex-col leading-tight">
              <span className="font-bold">From your plans to</span>
              <span className="font-light">real possibilities</span>
            </h1>
            
            <h2 className="text-lg sm:text-xl md:text-2xl font-medium mb-4 md:mb-6">Bank smarter and enjoy more freedom</h2>
            
            <p className="text-sm sm:text-base md:text-lg leading-relaxed mb-8 md:mb-12 text-white/95">
              Whether you are planning a getaway, sending money across borders, 
              or managing your everyday finances, our banking services give you 
              secure and convenient access to more possibilities.
            </p>
            
            <Link 
              to="/register" 
              className="inline-block bg-transparent text-white border-2 border-white px-6 sm:px-8 md:px-10 py-3 md:py-4 rounded-full font-medium text-sm md:text-base hover:bg-primary-500 hover:border-primary-500 transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(255,107,53,0.4)] opacity-0 animate-[fadeIn_1s_ease-out_1s_forwards]"
            >
              Access More
            </Link>
          </div>
        </div>
      </section>

      {/* Agency Banking Section */}
      <section className="flex flex-col md:flex-row w-full min-h-screen">
        {/* Left Content Column - 42% */}
        <div className="w-full md:flex-[0_0_42%] bg-[#a8cc08] flex items-center justify-center p-8 md:p-12 relative min-h-screen">
          {/* Diagonal Orange Divider - Desktop Only */}
          <div className="hidden md:block absolute right-0 top-0 bottom-0 w-12 bg-primary-500 z-10" style={{ clipPath: 'polygon(0 0, 100% 10%, 100% 100%, 0 90%)' }}></div>
          {/* Horizontal Orange Divider - Mobile Only */}
          <div className="md:hidden absolute left-0 right-0 bottom-0 h-1 bg-primary-500 z-10"></div>
          
          <div className="max-w-[520px] w-full z-20">
            <p className="text-white text-base md:text-lg font-bold mb-2 lowercase">Banking is now</p>
            <h2 className="text-white text-5xl md:text-7xl font-bold leading-none mb-0 tracking-wider">CLOSER</h2>
            <h3 className="text-dark-900 text-2xl md:text-3xl font-light mb-6 md:mb-8">than you think.</h3>
            <p className="text-white text-sm md:text-base leading-relaxed mb-8 md:mb-12">
              With our convenient agency banking service, you can deposit, withdraw, 
              transfer funds, pay bills, and access essential banking services near you.
            </p>
            <Link 
              to="/register" 
              className="inline-block w-full md:w-auto text-center bg-transparent text-dark-900 border-2 border-dark-900 px-9 py-3.5 rounded-lg font-medium text-[0.95rem] hover:bg-dark-900 hover:text-white transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(26,35,50,0.3)]"
            >
              Access More
            </Link>
          </div>
        </div>
        
        {/* Right Image Column - 58% */}
        <div className="w-full md:flex-[0_0_58%] relative overflow-hidden min-h-screen">
          <img 
            src="/images/agency-banking.png" 
            alt="Customer receiving banking services at a local agency banking kiosk" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          
          {/* Service Cards Overlay */}
          <div className="absolute top-1/2 left-1/2 md:left-[10%] -translate-y-1/2 -translate-x-1/2 md:translate-x-0 grid grid-cols-2 gap-2 md:gap-4 z-10 w-[90%] md:w-auto">
            <div className="bg-[#a8cc08] p-4 md:p-6 rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.15)] flex flex-col items-center justify-center text-center gap-2 w-full md:w-[140px] h-[90px] md:h-[110px] hover:-translate-y-1 hover:shadow-[0_6px_20px_rgba(0,0,0,0.25)] hover:bg-[#8cb000] transition-all cursor-pointer">
              <svg className="w-6 h-6 md:w-10 md:h-10 text-dark-900" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/>
              </svg>
              <span className="text-[0.75rem] md:text-[0.85rem] font-medium text-dark-900 leading-tight">Cash Deposit<br/>& Withdrawal</span>
            </div>
            <div className="bg-[#a8cc08] p-4 md:p-6 rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.15)] flex flex-col items-center justify-center text-center gap-2 w-full md:w-[140px] h-[90px] md:h-[110px] hover:-translate-y-1 hover:shadow-[0_6px_20px_rgba(0,0,0,0.25)] hover:bg-[#8cb000] transition-all cursor-pointer">
              <svg className="w-6 h-6 md:w-10 md:h-10 text-dark-900" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/>
              </svg>
              <span className="text-[0.75rem] md:text-[0.85rem] font-medium text-dark-900 leading-tight">Funds<br/>Transfer</span>
            </div>
            <div className="bg-[#a8cc08] p-4 md:p-6 rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.15)] flex flex-col items-center justify-center text-center gap-2 w-full md:w-[140px] h-[90px] md:h-[110px] hover:-translate-y-1 hover:shadow-[0_6px_20px_rgba(0,0,0,0.25)] hover:bg-[#8cb000] transition-all cursor-pointer">
              <svg className="w-6 h-6 md:w-10 md:h-10 text-dark-900" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6zm2-8h8v2H8v-2zm0 4h8v2H8v-2z"/>
              </svg>
              <span className="text-[0.75rem] md:text-[0.85rem] font-medium text-dark-900 leading-tight">Bill<br/>Payment</span>
            </div>
            <div className="bg-[#a8cc08] p-4 md:p-6 rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.15)] flex flex-col items-center justify-center text-center gap-2 w-full md:w-[140px] h-[90px] md:h-[110px] hover:-translate-y-1 hover:shadow-[0_6px_20px_rgba(0,0,0,0.25)] hover:bg-[#8cb000] transition-all cursor-pointer">
              <svg className="w-6 h-6 md:w-10 md:h-10 text-dark-900" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0-6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 8c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zm-6 4c.22-.72 3.31-2 6-2 2.7 0 5.8 1.29 6 2H9zm-3-3v-3h3v-2H6V7H4v3H1v2h3v3z"/>
              </svg>
              <span className="text-[0.75rem] md:text-[0.85rem] font-medium text-dark-900 leading-tight">Account<br/>Opening</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#071b33] text-[#d7dee7] w-full">
        <div className="py-12">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Brand */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Veritas Bank</h3>
              <p className="text-sm">Secure banking made simple.</p>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="text-white text-base font-bold mb-4 uppercase tracking-wider">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#about" className="text-sm hover:text-[#f58220] transition-colors">About Us</a></li>
                <li><a href="#personal" className="text-sm hover:text-[#f58220] transition-colors">Personal Banking</a></li>
                <li><a href="#business" className="text-sm hover:text-[#f58220] transition-colors">Business Banking</a></li>
                <li><a href="#contact" className="text-sm hover:text-[#f58220] transition-colors">Contact Us</a></li>
              </ul>
            </div>
            
            {/* Support */}
            <div>
              <h4 className="text-white text-base font-bold mb-4 uppercase tracking-wider">Support</h4>
              <ul className="space-y-2">
                <li><a href="#help" className="text-sm hover:text-[#f58220] transition-colors">Help Centre</a></li>
                <li><a href="#privacy" className="text-sm hover:text-[#f58220] transition-colors">Privacy Policy</a></li>
                <li><a href="#terms" className="text-sm hover:text-[#f58220] transition-colors">Terms and Conditions</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-4">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-sm text-center">&copy; 2026 Veritas Bank. All rights reserved.</p>
            <div className="mt-4 text-center">
              <Link to="/admin/login" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                Admin Portal
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Live Chat Button */}
      <button 
        className="fixed bottom-8 right-8 bg-primary-500 text-white rounded-full px-6 py-4 flex items-center gap-3 font-medium shadow-md hover:bg-primary-600 hover:-translate-y-1 hover:shadow-lg transition-all z-50 opacity-0 animate-[slideInFromBottom_0.6s_ease-out_1.5s_forwards]"
        aria-label="Open Live Chat"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
        </svg>
        <span>Chat With Us</span>
      </button>
    </div>
  )
}
