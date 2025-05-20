import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [, setIsFocused] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`)
      setSearchTerm('')
    }
  }

  return (
    <nav className="relative px-4 py-2">
      <div className="flex items-center justify-between">
        {/* Navigation Links */}
        <div className="flex-1">
          <div className={`${isOpen ? 'block' : 'hidden'} md:block`}>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <Link to="/restaurants" className="text-[#CCBA78] text-3xl hover:text-white transition-colors font-['Island_Moments']">Restaurants</Link>
              <Link to="/spots" className="text-[#CCBA78] text-3xl hover:text-white transition-colors font-['Island_Moments']">Spots</Link>
              <Link to="/catalogs" className="text-[#CCBA78] text-3xl hover:text-white transition-colors font-['Island_Moments']">Catalogs</Link>
              <Link to="/reviews" className="text-[#CCBA78] text-3xl hover:text-white transition-colors font-['Island_Moments']">Reviews</Link>
              <Link to="/how-to-get" className="text-[#CCBA78] text-3xl hover:text-white transition-colors font-['Island_Moments']">How to Get</Link>
              <Link to="/login" className="text-[#CCBA78] text-3xl hover:text-white transition-colors font-['Island_Moments']">Login</Link>
            </div>
          </div>
        </div>

        {/* Search Bar */}
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
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
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

        {/* Mobile menu button */}
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