import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/Layout'
import LoadingSpinner from './components/LoadingSpinner'

// Lazy-loaded pages
const HomePage = lazy(() => import('./pages/HomePage'))
const RestaurantPage = lazy(() => import('./pages/restaurant/RestaurantPage'))
const RestaurantDetailPage = lazy(() => import('./pages/restaurant/RestaurantDetailPage'))
const SpotPage = lazy(() => import('./pages/spot/SpotPage'))
const SpotDetailPage = lazy(() => import('./pages/spot/SpotDetailPage'))
const CatalogPage = lazy(() => import('./pages/catalog/CatalogPage'))
const CatalogDetailPage = lazy(() => import('./pages/catalog/CatalogDetailPage'))
const ReviewRatingPage = lazy(() => import('./pages/ReviewRatingPage'))
const HowToGetPage = lazy(() => import('./pages/HowToGetPage'))
const LoginPage = lazy(() => import('./pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'))

function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Layout><HomePage /></Layout>} />
            <Route path="/restaurants" element={<Layout><RestaurantPage /></Layout>} />
            <Route path="/restaurants/:id" element={<Layout><RestaurantDetailPage /></Layout>} />
            <Route path="/spots" element={<Layout><SpotPage /></Layout>} />
            <Route path="/spots/:id" element={<Layout><SpotDetailPage /></Layout>} />
            <Route path="/catalogs" element={<Layout><CatalogPage /></Layout>} />
            <Route path="/catalogs/:id" element={<Layout><CatalogDetailPage /></Layout>} />
            <Route path="/reviews" element={<Layout><ReviewRatingPage /></Layout>} />
            <Route path="/how-to-get" element={<Layout><HowToGetPage /></Layout>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  )
}

export default App;