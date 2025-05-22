import Footer from './Footer'
import Header from './Header'

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen w-full flex flex-col bg-[#3D1E0F] text-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 md:px-8 py-8">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default Layout