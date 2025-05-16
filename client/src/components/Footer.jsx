const Footer = () => {
  return (
    <footer className="bg-primary-black text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-special-elite">Blok-M(ap)</h2>
            <p className="text-sm mt-2">Your guide to Blok M's best spots</p>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-primary-gold">Terms</a>
            <a href="#" className="hover:text-primary-gold">Privacy</a>
            <a href="#" className="hover:text-primary-gold">Contact</a>
          </div>
        </div>
        <div className="mt-6 text-center text-sm">
          <p>© {new Date().getFullYear()} Blok-M(ap). All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer