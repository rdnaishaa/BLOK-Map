import Footer from './Footer'
import Header from './Header'

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen w-full flex flex-col bg-[#3D1E0F] text-white">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default Layout