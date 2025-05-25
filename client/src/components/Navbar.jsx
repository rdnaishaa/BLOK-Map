import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const navigate = useNavigate()
  const { isLogin, logout, user } = useAuth()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`)
      setSearchTerm('')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login', { state: { message: 'You have logged out successfully.' } })
  }

  return (
    <>
      {/* Fixed Navbar */}
      <nav className="fixed top-0 left-0 right-0 px-4 py-3 bg-[#3D1E0F]/90 shadow-lg backdrop-blur-md z-50 border-b border-[#CCBA78]/20">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <Link 
              to="/" 
              className="text-[#CCBA78] text-3xl md:text-4xl font-['Special_Elite'] hover:text-white transition-colors duration-300 flex items-center gap-2"
            >
              <span className="text-2xl">🗺️</span>
              <span className="hidden sm:block">BLOK-M(ap)</span>
              <span className="sm:hidden">FH</span>
            </Link>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="flex items-center gap-6 lg:gap-8">
              <Link to="/restaurants" className="text-[#CCBA78] text-xl lg:text-3xl font-['Island_Moments'] relative group hover:text-white transition-colors">
                Restaurants
                <span className="block h-0.5 bg-[#CCBA78] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 rounded-full absolute left-0 -bottom-1 w-full"></span>
              </Link>
              <Link to="/spots" className="text-[#CCBA78] text-xl lg:text-3xl font-['Island_Moments'] relative group hover:text-white transition-colors">
                Spots
                <span className="block h-0.5 bg-[#CCBA78] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 rounded-full absolute left-0 -bottom-1 w-full"></span>
              </Link>
              <Link to="/catalogs" className="text-[#CCBA78] text-xl lg:text-3xl font-['Island_Moments'] relative group hover:text-white transition-colors">
                Catalogs
                <span className="block h-0.5 bg-[#CCBA78] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 rounded-full absolute left-0 -bottom-1 w-full"></span>
              </Link>
              <Link to="/reviews" className="text-[#CCBA78] text-xl lg:text-3xl font-['Island_Moments'] relative group hover:text-white transition-colors">
                Reviews
                <span className="block h-0.5 bg-[#CCBA78] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 rounded-full absolute left-0 -bottom-1 w-full"></span>
              </Link>
              <Link to="/how-to-get" className="text-[#CCBA78] text-xl lg:text-3xl font-['Island_Moments'] relative group hover:text-white transition-colors">
                How to Get
                <span className="block h-0.5 bg-[#CCBA78] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 rounded-full absolute left-0 -bottom-1 w-full"></span>
              </Link>
            </div>
          </div>

          {/* Right Side - User Info, Search, Auth */}
          <div className="flex items-center gap-3">
            {/* User Info */}
            {isLogin && user?.username && (
              <div className="hidden lg:flex items-center gap-2 text-[#CCBA78] font-normal text-sm">
                <span>Hello,</span>
                <span className="font-bold">{user.username}</span>
              </div>
            )}
            
            {/* Search Bar */}
            <div className="hidden md:block">
              <form onSubmit={handleSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-32 px-3 py-2 text-sm rounded-full 
                    bg-white/10 backdrop-blur-sm border border-[#CCBA78]/30
                    text-[#CCBA78] placeholder-[#CCBA78]/50
                    focus:outline-none focus:border-[#CCBA78] focus:w-40
                    transition-all duration-300 font-normal"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button 
                  type="submit" 
                  className="absolute right-2 top-1/2 -translate-y-1/2
                    text-[#CCBA78] hover:text-[#CCBA78]/80
                    transition-all duration-300"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                    />
                  </svg>
                </button>
              </form>
            </div>

            {/* Auth Button */}
            <div className="hidden md:block">
              {isLogin ? (
                <button 
                  onClick={handleLogout}
                  className="text-[#CCBA78] text-xl lg:text-2xl font-['Island_Moments'] hover:text-white transition-colors px-3 py-1 rounded-lg hover:bg-white/10"
                >
                  Logout
                </button>
              ) : (
                <Link 
                  to="/login"
                  className="text-[#CCBA78] text-xl font-['Island_Moments'] hover:text-white transition-colors px-3 py-1 rounded-lg hover:bg-white/10"
                >
                  Login
                </Link>
              )}
            </div>
            
            {/* Mobile menu toggle */}
            <button 
              className="md:hidden text-[#CCBA78] p-2"
              onClick={() => setIsOpen(!isOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`${isOpen ? 'block' : 'hidden'} md:hidden mt-4 pb-4 border-t border-[#CCBA78]/20`}>
          <div className="flex flex-col gap-4 pt-4">
            <Link 
              to="/restaurants" 
              className="text-[#CCBA78] text-xl font-['Island_Moments'] hover:text-white transition-colors px-2 py-1"
              onClick={() => setIsOpen(false)}
            >
              Restaurants
            </Link>
            <Link 
              to="/spots" 
              className="text-[#CCBA78] text-xl font-['Island_Moments'] hover:text-white transition-colors px-2 py-1"
              onClick={() => setIsOpen(false)}
            >
              Spots
            </Link>
            <Link 
              to="/catalogs" 
              className="text-[#CCBA78] text-xl font-['Island_Moments'] hover:text-white transition-colors px-2 py-1"
              onClick={() => setIsOpen(false)}
            >
              Catalogs
            </Link>
            <Link 
              to="/reviews" 
              className="text-[#CCBA78] text-xl font-['Island_Moments'] hover:text-white transition-colors px-2 py-1"
              onClick={() => setIsOpen(false)}
            >
              Reviews
            </Link>
            <Link 
              to="/how-to-get" 
              className="text-[#CCBA78] text-xl font-['Island_Moments'] hover:text-white transition-colors px-2 py-1"
              onClick={() => setIsOpen(false)}
            >
              How to Get
            </Link>
            
            {/* Mobile Search */}
            <form onSubmit={handleSubmit} className="relative px-2">
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-3 py-2 text-sm rounded-full 
                  bg-white/10 backdrop-blur-sm border border-[#CCBA78]/30
                  text-[#CCBA78] placeholder-[#CCBA78]/50
                  focus:outline-none focus:border-[#CCBA78]
                  transition-all duration-300 font-normal"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form>

            {/* Mobile Auth */}
            {isLogin ? (
              <>
                {user?.username && (
                  <div className="text-[#CCBA78] font-normal text-sm px-2">
                    Hello, <span className="font-bold">{user.username}</span>
                  </div>
                )}
                <button 
                  onClick={handleLogout}
                  className="text-[#CCBA78] text-xl font-['Island_Moments'] hover:text-white transition-colors text-left px-2 py-1"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link 
                to="/login"
                className="text-[#CCBA78] text-xl font-['Island_Moments'] hover:text-white transition-colors px-2 py-1"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
      
      {/* Spacer untuk memberikan ruang untuk konten di bawah navbar */}
      <div className="h-20 md:h-24"></div>
    </>
  )
}

export default Navbar