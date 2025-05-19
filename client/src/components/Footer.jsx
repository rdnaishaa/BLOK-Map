const Footer = () => {
  return (
    <footer className="bg-[#3D1E0F] text-[#CCBA78] py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">About Us</h3>
            <p>Your guide to exploring Blok M area in Jakarta</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/restaurants" className="hover:text-white transition-colors">Restaurants</a></li>
              <li><a href="/spots" className="hover:text-white transition-colors">Spots</a></li>
              <li><a href="/catalogs" className="hover:text-white transition-colors">Catalogs</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <p>Email: info@blokmap.com</p>
            <p>Phone: (021) 123-4567</p>
          </div>
        </div>
        <div className="mt-8 text-center">
          <p>&copy; 2025 Blok-M(ap). All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer