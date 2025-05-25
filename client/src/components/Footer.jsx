const Footer = () => {
  return (
    <footer className="bg-[#3D1E0F]/95 text-[#CCBA78] py-8 border-t border-[#CCBA78]/30 backdrop-blur-md relative">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">About Us</h3>
            <p>Your guide to exploring Blok M area in Jakarta</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/restaurants" className="hover:text-white transition-colors underline-offset-4 hover:underline">Restaurants</a></li>
              <li><a href="/spots" className="hover:text-white transition-colors underline-offset-4 hover:underline">Spots</a></li>
              <li><a href="/catalogs" className="hover:text-white transition-colors underline-offset-4 hover:underline">Catalogs</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <p>Email: blok-map@yahoo.com</p>
            <p>Phone: (021) 123-4567</p>
          </div>
        </div>
        <div className="mt-8 text-center">
          <p>&copy; 2025 Blok-M(ap). All rights reserved.</p>
        </div>
      </div>
      {/* GitHub Logo */}
      <a
        href="https://github.com/rdnaishaa/BLOK-Map"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute right-6 bottom-6 group"
        title="View on GitHub"
      >
        <svg className="w-10 h-10 text-[#CCBA78] group-hover:text-white transition-colors duration-300 drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.337 4.695-4.566 4.944.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.749 0 .267.18.578.688.48C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z" />
        </svg>
      </a>
    </footer>
  )
}

export default Footer