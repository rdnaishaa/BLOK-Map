import { Link } from 'react-router-dom'
import Navbar from './Navbar'
import SearchBar from './SearchBar'

const Header = () => {
  return (
    <header className="bg-primary-brown">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <h1 className="text-white text-3xl font-normal font-special-elite">Blok-M(ap)</h1>
          </Link>
          <Navbar />
        </div>
        <SearchBar />
      </div>
    </header>
  )
}

export default Header