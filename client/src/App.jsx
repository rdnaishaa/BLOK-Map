import React, { useState, useEffect } from 'react';
import CatalogList from './components/catalog';
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

export default function App() {
    const [catalogs, setCatalogs] = useState([]);

    useEffect(() => {
        // Simulate fetching data from backend
        const fetchCatalogs = async () => {
            const sampleCatalogs = [
                {
                    namaKatalog: "Catalog 1",
                    kategori: "Food",
                    lokasi: "Jakarta",
                    namaRestaurant: "Restaurant A",
                    harga: 50000,
                    rating: 4.5,
                    deskripsiKatalog: "Delicious food catalog.",
                    informasiRestaurant: "Open 9 AM - 9 PM"
                },
                {
                    namaKatalog: "Catalog 2",
                    kategori: "Drink",
                    lokasi: "Bandung",
                    namaRestaurant: "Restaurant B",
                    harga: 30000,
                    rating: 4.0,
                    deskripsiKatalog: "Refreshing drinks catalog.",
                    informasiRestaurant: "Open 10 AM - 8 PM"
                },
                // Add 4 more sample catalogs
                {
                    namaKatalog: "Catalog 3",
                    kategori: "Dessert",
                    lokasi: "Surabaya",
                    namaRestaurant: "Restaurant C",
                    harga: 40000,
                    rating: 4.8,
                    deskripsiKatalog: "Sweet desserts catalog.",
                    informasiRestaurant: "Open 11 AM - 10 PM"
                },
                {
                    namaKatalog: "Catalog 4",
                    kategori: "Fast Food",
                    lokasi: "Medan",
                    namaRestaurant: "Restaurant D",
                    harga: 60000,
                    rating: 4.2,
                    deskripsiKatalog: "Quick and tasty meals.",
                    informasiRestaurant: "Open 24/7"
                },
                {
                    namaKatalog: "Catalog 5",
                    kategori: "Vegan",
                    lokasi: "Bali",
                    namaRestaurant: "Restaurant E",
                    harga: 45000,
                    rating: 4.7,
                    deskripsiKatalog: "Healthy vegan options.",
                    informasiRestaurant: "Open 8 AM - 8 PM"
                },
                {
                    namaKatalog: "Catalog 6",
                    kategori: "Seafood",
                    lokasi: "Makassar",
                    namaRestaurant: "Restaurant F",
                    harga: 70000,
                    rating: 4.9,
                    deskripsiKatalog: "Fresh seafood dishes.",
                    informasiRestaurant: "Open 12 PM - 10 PM"
                }
            ];
            setCatalogs(sampleCatalogs);
        };

        fetchCatalogs();
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold underline">Catalog List</h1>
            <CatalogList catalogs={catalogs} />
        </div>
    );
}



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

