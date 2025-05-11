import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import Catalog from './pages/Catalog/Catalog'
import CatalogDetail from './pages/CatalogDetail/CatalogDetail'
import Restaurants from './pages/Restaurants/Restaurants'
import RestaurantDetail from './pages/RestaurantDetail/RestaurantDetail'
import SpotHangout from './pages/SpotHangout/SpotHangout'
import SpotDetail from './pages/SpotDetail/SpotDetail'
import HowToGet from './pages/HowToGet/HowToGet'
import AdminDashboard from './pages/Admin/Dashboard'
import AdminSpots from './pages/Admin/Spots'
import AdminRestaurants from './pages/Admin/Restaurants'
import AdminReviews from './pages/Admin/Reviews'
import ProtectedRoute from './components/common/ProtectedRoute'
import AdminRoute from './components/common/AdminRoute'
import './App.css'

function App() {
  const { loading } = useAuth()

  if (loading) {
    return <div className="loading">Loading...</div>
  }

   return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/catalog/:id" element={<CatalogDetail />} />
            <Route path="/restaurants" element={<Restaurants />} />
            <Route path="/restaurants/:id" element={<RestaurantDetail />} />
            <Route path="/spots" element={<SpotHangout />} />
            <Route path="/spots/:id" element={<SpotDetail />} />
            <Route path="/how-to-get" element={<HowToGet />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/spots" element={<AdminRoute><AdminSpots /></AdminRoute>} />
            <Route path="/admin/restaurants" element={<AdminRoute><AdminRestaurants /></AdminRoute>} />
            <Route path="/admin/reviews" element={<AdminRoute><AdminReviews /></AdminRoute>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App