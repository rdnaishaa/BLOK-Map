import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false) // ← untuk status login
  const navigate = useNavigate()

  useEffect(() => {
    // Cek apakah token tersedia
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`)
      setSearchTerm('')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsLoggedIn(false)
    navigate('/login', { state: { message: 'You have logged out successfully.' } })
  }

  return (
    <nav className="relative px-4 py-2 bg-[#3D1E0F]/80 shadow-lg backdrop-blur-md z-50">
      <div className="flex items-center justify-between">
        {/* Navigation Links */}
        <div className="flex-1">
          <div className={`${isOpen ? 'block' : 'hidden'} md:block transition-all duration-300`}>
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
              <Link to="/restaurants" className="text-[#CCBA78] text-2xl md:text-3xl font-['Island_Moments'] relative group hover:text-white transition-colors">
                Restaurants
                <span className="block h-0.5 bg-[#CCBA78] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 rounded-full absolute left-0 -bottom-1 w-full"></span>
              </Link>
              <Link to="/spots" className="text-[#CCBA78] text-2xl md:text-3xl font-['Island_Moments'] relative group hover:text-white transition-colors">
                Spots
                <span className="block h-0.5 bg-[#CCBA78] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 rounded-full absolute left-0 -bottom-1 w-full"></span>
              </Link>
              <Link to="/catalogs" className="text-[#CCBA78] text-2xl md:text-3xl font-['Island_Moments'] relative group hover:text-white transition-colors">
                Catalogs
                <span className="block h-0.5 bg-[#CCBA78] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 rounded-full absolute left-0 -bottom-1 w-full"></span>
              </Link>
              <Link to="/reviews" className="text-[#CCBA78] text-2xl md:text-3xl font-['Island_Moments'] relative group hover:text-white transition-colors">
                Reviews
                <span className="block h-0.5 bg-[#CCBA78] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 rounded-full absolute left-0 -bottom-1 w-full"></span>
              </Link>
              <Link to="/how-to-get" className="text-[#CCBA78] text-2xl md:text-3xl font-['Island_Moments'] relative group hover:text-white transition-colors">
                How to Get
                <span className="block h-0.5 bg-[#CCBA78] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 rounded-full absolute left-0 -bottom-1 w-full"></span>
              </Link>

              {isLoggedIn ? (
                <button 
                  onClick={handleLogout}
                  className="text-[#CCBA78] text-2xl md:text-3xl font-['Island_Moments'] hover:text-white transition-colors"
                >
                  Logout
                </button>
              ) : (
                <Link 
                  to="/login"
                  className="text-[#CCBA78] text-2xl md:text-3xl font-['Island_Moments'] hover:text-white transition-colors"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Search Bar (tidak berubah) */}
        <div className="hidden md:block ml-6">
          <form onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-64 px-4 py-2 text-sm rounded-full 
                bg-white/10 backdrop-blur-sm border border-[#CCBA78]/30
                text-[#CCBA78] placeholder-[#CCBA78]/50
                focus:outline-none focus:border-[#CCBA78]
                transition-all duration-300"
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

        {/* Mobile menu toggle button */}
        <button 
          className="md:hidden text-[#CCBA78]"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>
    </nav>
  )
}

export default Navbar
