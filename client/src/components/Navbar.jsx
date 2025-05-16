import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className="hidden md:flex space-x-6">
      <Link to="/" className="text-primary-gold text-2xl font-island">
        Food & Drink
      </Link>
      <Link to="/restaurants" className="text-primary-gold text-2xl font-island">
        Cafe & Restaurant
      </Link>
      <Link to="/spots" className="text-primary-gold text-2xl font-island">
        Spot Hangout
      </Link>
      <Link to="/reviews" className="text-primary-gold text-2xl font-island">
        Review & Rating
      </Link>
      <Link to="/how-to-get" className="text-primary-gold text-2xl font-island">
        How To Get
      </Link>
      <Link to="/login" className="text-primary-gold text-2xl font-island">
        Login
      </Link>
    </nav>
  )
}

export default Navbar