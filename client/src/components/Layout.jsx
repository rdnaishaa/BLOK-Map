import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import LoadingSpinner from './LoadingSpinner'

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50"> {/* Make sure this background color is set */}
      <Header />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout