import { Link } from "react-router-dom"
import Navbar from "./Navbar"

const Header = () => {
  return (
    <header className="bg-[#3D1E0F] fixed w-full z-50">
      <div className="container mx-auto">
        <div className="flex items-center justify-between px-4">
          <Link to="/">
            <h1 className="text-2xl md:text-3xl font-normal text-[#FFFFFF] font-special-elite">
              Blok-M(ap)
            </h1>
          </Link>
          <Navbar />
        </div>
      </div>
    </header>
  )
}

export default Header