import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import {
  MapPinIcon,
  StarIcon,
  SparklesIcon,
  UserIcon,
  HomeIcon,
  BuildingLibraryIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon,
  ArrowRightOnRectangleIcon as LogInIcon,     // untuk login
  ArrowLeftOnRectangleIcon as LogOutIcon,     // untuk logout
  NewspaperIcon
} from '@heroicons/react/24/outline';

import axios from 'axios';
import './App.css';

// Set base URL for API requests
const API_BASE_URL = 'https://blok-map.vercel.app';

// Axios configuration with authorization header
const authAxios = axios.create({
  baseURL: API_BASE_URL
});

// Add interceptor to include token in requests
authAxios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Context for auth state
const AuthContext = React.createContext();

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const token = localStorage.getItem('token');
  if (token) {
    axios.get(`${API_BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setCurrentUser(res.data.data);
    })
    .catch(err => {
      console.error('Auth error:', err);
      localStorage.removeItem('token');
    })
    .finally(() => {
      setLoading(false);
    });
  } else {
    setLoading(false);
  }
}, []);


  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
      localStorage.setItem('token', res.data.data.token);
      setCurrentUser(res.data.data);
      return res.data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/register`, userData);
      localStorage.setItem('token', res.data.data.token);
      setCurrentUser(res.data.data);
      return res.data;
    } catch (error) {
      throw error.response?.data || { message: 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    isAdmin: currentUser?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && (
        <Router>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/restaurants" element={<RestaurantsPage />} />
                <Route path="/restaurants/:id" element={<RestaurantDetail />} />
                <Route path="/spots" element={<SpotsPage />} />
                <Route path="/spots/:id" element={<SpotDetail />} />
                <Route path="/articles" element={<ArticlesPage />} />
                <Route path="/articles/:id" element={<ArticleDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                {/* Add more routes as needed */}
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      )}
    </AuthContext.Provider>
  );
}

function useAuth() {
  return React.useContext(AuthContext);
}

// Helper functions
const formatPriceRange = (price) => {
  if (!price) return 'N/A';
  return price.replace(/[\[\]]/g, '').split(',').join(' - ');
};

const getPlaceholderImage = (type) => {
  switch (type) {
    case 'restaurant':
      return 'https://via.placeholder.com/400x300?text=Restaurant';
    case 'spot':
      return 'https://via.placeholder.com/400x300?text=Spot';
    case 'article':
      return 'https://via.placeholder.com/400x300?text=Article';
    default:
      return 'https://via.placeholder.com/400x300';
  }
};

// Header Component
function Header() {
  const { currentUser, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2">
            <MapPinIcon className="h-8 w-8 text-red-500" />
            <span className="text-2xl font-bold text-gray-800">BLOK-M(ap)</span>
          </Link>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-red-500 transition-colors flex items-center">
              <HomeIcon className="h-5 w-5 mr-1" />
              Home
            </Link>
            <Link to="/restaurants" className="text-gray-600 hover:text-red-500 transition-colors flex items-center">
              <SparklesIcon className="h-5 w-5 mr-1" />
              Restaurants
            </Link>
            <Link to="/spots" className="text-gray-600 hover:text-red-500 transition-colors flex items-center">
              <BuildingLibraryIcon className="h-5 w-5 mr-1" />
              Spots
            </Link>
            <Link to="/articles" className="text-gray-600 hover:text-red-500 transition-colors flex items-center">
              <NewspaperIcon className="h-5 w-5 mr-1" />
              Articles
            </Link>
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="text-gray-600 hover:text-red-500 transition-colors flex items-center">
                  <UserIcon className="h-5 w-5 mr-1" />
                  {currentUser.username}
                </Link>
                <button 
                  onClick={logout}
                  className="text-gray-600 hover:text-red-500 transition-colors flex items-center"
                >
                  <LogOutIcon className="h-5 w-5 mr-1" />
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="text-gray-600 hover:text-red-500 transition-colors flex items-center">
                <LogInIcon className="h-5 w-5 mr-1" />
                Login
              </Link>
            )}
          </nav>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="text-gray-600 hover:text-red-500 transition-colors flex items-center" onClick={() => setIsMenuOpen(false)}>
                <HomeIcon className="h-5 w-5 mr-2" />
                Home
              </Link>
              <Link to="/restaurants" className="text-gray-600 hover:text-red-500 transition-colors flex items-center" onClick={() => setIsMenuOpen(false)}>
                <SparklesIcon className="h-5 w-5 mr-2" />
                Restaurants
              </Link>
              <Link to="/spots" className="text-gray-600 hover:text-red-500 transition-colors flex items-center" onClick={() => setIsMenuOpen(false)}>
                <BuildingLibraryIcon className="h-5 w-5 mr-2" />
                Spots
              </Link>
              <Link to="/articles" className="text-gray-600 hover:text-red-500 transition-colors flex items-center" onClick={() => setIsMenuOpen(false)}>
                <NewspaperIcon className="h-5 w-5 mr-2" />
                Articles
              </Link>
              {currentUser ? (
                <>
                  <Link to="/profile" className="text-gray-600 hover:text-red-500 transition-colors flex items-center" onClick={() => setIsMenuOpen(false)}>
                    <UserIcon className="h-5 w-5 mr-2" />
                    {currentUser.username}
                  </Link>
                  <button 
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="text-gray-600 hover:text-red-500 transition-colors flex items-center"
                  >
                    <LogOutIcon className="h-5 w-5 mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/login" className="text-gray-600 hover:text-red-500 transition-colors flex items-center" onClick={() => setIsMenuOpen(false)}>
                  <LogInIcon className="h-5 w-5 mr-2" />
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

// Footer Component
function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center space-x-2 mb-4">
              <MapPinIcon className="h-8 w-8 text-red-400" />
              <span className="text-2xl font-bold">BLOK-M(ap)</span>
            </div>
            <p className="text-gray-300 max-w-md">
              Your digital guide to Blok-M's hidden gems, culinary delights, and cultural spots. 
              Connecting communities and supporting local businesses.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Explore</h3>
              <ul className="space-y-2">
                <li><Link to="/restaurants" className="text-gray-300 hover:text-white transition-colors">Restaurants</Link></li>
                <li><Link to="/spots" className="text-gray-300 hover:text-white transition-colors">Spots</Link></li>
                <li><Link to="/articles" className="text-gray-300 hover:text-white transition-colors">Articles</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Community</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Partners</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Support Local</a></li>
              </ul>
            </div>
            
            <div className="col-span-2 md:col-span-1">
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Instagram</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Facebook</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>© {new Date().getFullYear()} BLOK-M(ap). All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

// Home Page Component
function HomePage() {
  const [restaurants, setRestaurants] = useState([]);
  const [spots, setSpots] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationOptions, setLocationOptions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [restaurantsRes, spotsRes, articlesRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/restaurant?limit=4`),
          axios.get(`${API_BASE_URL}/spots?limit=4`),
          axios.get(`${API_BASE_URL}/articles`)
        ]);
        
        // Extract unique locations from restaurants and spots
        const locations = new Set();
        restaurantsRes.data.data.forEach(r => locations.add(r.lokasi));
        spotsRes.data.data.forEach(s => locations.add(s.lokasi));
        
        setRestaurants(restaurantsRes.data.data);
        setSpots(spotsRes.data.data);
        setArticles(articlesRes.data.data.slice(0, 3)); // Just take first 3 articles
        setLocationOptions(Array.from(locations));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching home data:', error);
        setLoading(false);
      }
    };
    
    fetchHomeData();
  }, []);

  const handleLocationChange = async (location) => {
    setSelectedLocation(location);
    setLoading(true);
    try {
      const [restaurantsRes, spotsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/restaurant?lokasi=${location}`),
        axios.get(`${API_BASE_URL}/spots?lokasi=${location}`)
      ]);
      
      setRestaurants(restaurantsRes.data.data);
      setSpots(spotsRes.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error filtering by location:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-500 to-orange-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Discover the Heart of Jakarta South</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Your ultimate guide to the hidden gems, culinary delights, and cultural spots in Blok-M.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/restaurants" className="bg-white text-red-500 hover:bg-gray-100 px-8 py-3 rounded-full font-medium transition-colors">
              Find Food
            </Link>
            <Link to="/spots" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-red-500 px-8 py-3 rounded-full font-medium transition-colors">
              Explore Spots
            </Link>
          </div>
        </div>
      </section>
      
      {/* Location Filter */}
      <section className="bg-white py-8 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Explore By Location</h2>
            <div className="w-full md:w-auto">
              <select 
                value={selectedLocation}
                onChange={(e) => handleLocationChange(e.target.value)}
                className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">All Locations</option>
                {locationOptions.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Restaurants */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Featured Restaurants</h2>
            <Link to="/restaurants" className="text-red-500 hover:text-red-600 font-medium">
              View All →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {restaurants.length > 0 ? restaurants.map(restaurant => (
              <Link to={`/restaurants/${restaurant.id}`} key={restaurant.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gray-300">
                  {restaurant.image_url ? (
                    <img 
                      src={restaurant.image_url} 
                      alt={restaurant.namaRestaurant} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center bg-gradient-to-r from-red-400 to-orange-300">
                      <SparklesIcon className="h-12 w-12 text-white" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">{restaurant.namaRestaurant}</h3>
                  <div className="flex items-center mb-2">
                    <StarIcon className="h-5 w-5 text-yellow-500" />
                    <span className="ml-1 text-gray-700">{restaurant.rating}</span>
                  </div>
                  <p className="text-gray-600">{restaurant.lokasi}</p>
                  <div className="mt-3 text-sm text-gray-500">
                    Price Range: {formatPriceRange(restaurant.price)}
                  </div>
                </div>
              </Link>
            )) : (
              <p className="col-span-full text-center text-gray-500">No restaurants found for this location.</p>
            )}
          </div>
        </div>
      </section>
      
      {/* Featured Spots */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Cool Spots to Visit</h2>
            <Link to="/spots" className="text-red-500 hover:text-red-600 font-medium">
              View All →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {spots.length > 0 ? spots.map(spot => (
              <Link to={`/spots/${spot.id}`} key={spot.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-200">
                <div className="h-48 bg-gray-300">
                  {spot.image_url ? (
                    <img 
                      src={spot.image_url}
                      alt={spot.namaTempat}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center bg-gradient-to-r from-blue-400 to-purple-300">
                      <MapPinIcon className="h-12 w-12 text-white" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">{spot.namaTempat}</h3>
                  <div className="flex items-center mb-2">
                    <StarIcon className="h-5 w-5 text-yellow-500" />
                    <span className="ml-1 text-gray-700">{spot.rating}</span>
                  </div>
                  <p className="text-gray-600">{spot.lokasi}</p>
                  <div className="mt-3 text-sm text-gray-500">
                    Price Range: {formatPriceRange(spot.price)}
                  </div>
                </div>
              </Link>
            )) : (
              <p className="col-span-full text-center text-gray-500">No spots found for this location.</p>
            )}
          </div>
        </div>
      </section>
      
      {/* Latest Articles */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Latest Stories</h2>
            <Link to="/articles" className="text-red-500 hover:text-red-600 font-medium">
              All Articles →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {articles.map(article => (
              <Link to={`/articles/${article.id}`} key={article.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow h-full flex flex-col">
                <div className="h-48 bg-gray-300">
                  {article.image_url ? (
                    <img 
                      src={article.image_url} 
                      alt={article.judulArtikel} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center bg-gradient-to-r from-gray-400 to-gray-300">
                      <NewspaperIcon className="h-12 w-12 text-white" />
                    </div>
                  )}
                </div>
                <div className="p-6 flex-grow">
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">{article.judulArtikel}</h3>
                  <p className="text-gray-600 line-clamp-3">
                    {article.kontenArtikel.substring(0, 150)}...
                  </p>
                </div>
                <div className="px-6 pb-4">
                  <span className="text-xs text-gray-500">
                    {new Date(article.created_at).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Community Section */}
      <section className="py-16 bg-red-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Join the Blok-M Community</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Share your experiences, discover hidden gems, and connect with fellow explorers.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/register" className="bg-white text-red-500 hover:bg-gray-100 px-8 py-3 rounded-full font-medium transition-colors">
              Sign Up Now
            </Link>
            <Link to="/about" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-red-500 px-8 py-3 rounded-full font-medium transition-colors">
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// Restaurant Pages
function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    kategori: '',
    lokasi: ''
  });

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/restaurant`, { 
          params: filters 
        });
        setRestaurants(response.data.data);
        
        // If first load, get unique categories and locations
        if (!categories.length) {
          const uniqueCategories = [...new Set(response.data.data.map(r => r.kategori))].filter(Boolean);
          const uniqueLocations = [...new Set(response.data.data.map(r => r.lokasi))].filter(Boolean);
          setCategories(uniqueCategories);
          setLocations(uniqueLocations);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
        setLoading(false);
      }
    };
    
    fetchRestaurants();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Explore Restaurants</h1>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              id="search"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search restaurants..."
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
            />
          </div>
          
          <div>
            <label htmlFor="kategori" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              id="kategori"
              name="kategori"
              value={filters.kategori}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
            >
              <option value="">All Categories</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="lokasi" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <select
              id="lokasi"
              name="lokasi"
              value={filters.lokasi}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
            >
              <option value="">All Locations</option>
              {locations.map((location, index) => (
                <option key={index} value={location}>{location}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Restaurant Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.length > 0 ? restaurants.map(restaurant => (
            <Link to={`/restaurants/${restaurant.id}`} key={restaurant.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow h-full flex flex-col">
              <div className="h-48 bg-gray-300">
                {restaurant.image_url ? (
                  <img 
                    src={restaurant.image_url}
                    alt={restaurant.namaRestaurant}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center bg-gradient-to-r from-red-400 to-orange-300">
                    <SparklesIcon className="h-12 w-12 text-white" />
                  </div>
                )}
              </div>
              <div className="p-4 flex-grow">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{restaurant.namaRestaurant}</h3>
                <div className="flex items-center mb-2">
                  <StarIcon className="h-5 w-5 text-yellow-500" />
                  <span className="ml-1 text-gray-700">{restaurant.rating}</span>
                </div>
                <p className="text-gray-600">{restaurant.lokasi}</p>
                <p className="text-gray-500 mt-2">{restaurant.kategori}</p>
                <div className="mt-3 text-sm text-gray-500">
                  Price Range: {formatPriceRange(restaurant.price)}
                </div>
              </div>
            </Link>
          )) : (
            <div className="col-span-full text-center text-gray-500">
              No restaurants found matching your criteria.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Add Articles Page Component
function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/articles`);
        setArticles(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching articles:', error);
        setLoading(false);
      }
    };
    
    fetchArticles();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Articles</h1>
        {currentUser?.role === 'admin' && (
          <Link
            to="/articles/new"
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
          >
            Create Article
          </Link>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map(article => (
            <Link 
              to={`/articles/${article.id}`} 
              key={article.id}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow flex flex-col"
            >
              <div className="h-48 bg-gray-300">
                {article.image_url ? (
                  <img 
                    src={article.image_url}
                    alt={article.judulArtikel}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center bg-gradient-to-r from-gray-400 to-gray-300">
                    <NewspaperIcon className="h-12 w-12 text-white" />
                  </div>
                )}
              </div>
              <div className="p-6 flex-grow">
                <h2 className="text-xl font-semibold mb-3 text-gray-800">{article.judulArtikel}</h2>
                <p className="text-gray-600 line-clamp-3">{article.kontenArtikel}</p>
              </div>
              <div className="px-6 pb-4 flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {new Date(article.created_at).toLocaleDateString()}
                </span>
                {currentUser?.role === 'admin' && (
                  <Link 
                    to={`/articles/${article.id}/edit`}
                    className="text-red-500 hover:text-red-600"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Edit
                  </Link>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// Add Spots Page Component
function SpotsPage() {
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    kategori: '',
    lokasi: ''
  });

  useEffect(() => {
    const fetchSpots = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/spots`, { 
          params: filters 
        });
        setSpots(response.data.data);
        
        if (!categories.length) {
          const uniqueCategories = [...new Set(response.data.data.map(s => s.kategori))].filter(Boolean);
          const uniqueLocations = [...new Set(response.data.data.map(s => s.lokasi))].filter(Boolean);
          setCategories(uniqueCategories);
          setLocations(uniqueLocations);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching spots:', error);
        setLoading(false);
      }
    };
    
    fetchSpots();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Explore Spots</h1>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              id="search"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search spots..."
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
            />
          </div>
          
          <div>
            <label htmlFor="kategori" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              id="kategori"
              name="kategori"
              value={filters.kategori}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
            >
              <option value="">All Categories</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="lokasi" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <select
              id="lokasi"
              name="lokasi"
              value={filters.lokasi}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
            >
              <option value="">All Locations</option>
              {locations.map((location, index) => (
                <option key={index} value={location}>{location}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Spots Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {spots.length > 0 ? spots.map(spot => (
            <Link to={`/spots/${spot.id}`} key={spot.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow h-full flex flex-col">
              <div className="h-48 bg-gray-300">
                {spot.image_url ? (
                  <img 
                    src={spot.image_url}
                    alt={spot.namaTempat}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center bg-gradient-to-r from-blue-400 to-purple-300">
                    <MapPinIcon className="h-12 w-12 text-white" />
                  </div>
                )}
              </div>
              <div className="p-4 flex-grow">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{spot.namaTempat}</h3>
                <div className="flex items-center mb-2">
                  <StarIcon className="h-5 w-5 text-yellow-500" />
                  <span className="ml-1 text-gray-700">{spot.rating}</span>
                </div>
                <p className="text-gray-600">{spot.lokasi}</p>
                <p className="text-gray-500 mt-2">{spot.kategori}</p>
                <div className="mt-3 text-sm text-gray-500">
                  Price Range: {formatPriceRange(spot.price)}
                </div>
              </div>
            </Link>
          )) : (
            <div className="col-span-full text-center text-gray-500">
              No spots found matching your criteria.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Restaurant Detail Page
function RestaurantDetail() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/restaurant/${id}`);
        setRestaurant(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching restaurant:', error);
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this restaurant?')) {
      try {
        await authAxios.delete(`${API_BASE_URL}/restaurant/${id}`);
        navigate('/restaurants');
      } catch (error) {
        console.error('Error deleting restaurant:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-gray-600">Restaurant not found.</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative h-96">
            {restaurant.image_url ? (
              <img 
                src={restaurant.image_url}
                alt={restaurant.namaRestaurant}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-red-400 to-orange-300">
                <SparklesIcon className="h-24 w-24 text-white" />
              </div>
            )}
          </div>
          
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{restaurant.namaRestaurant}</h1>
                <div className="flex items-center mb-4">
                  <StarIcon className="h-6 w-6 text-yellow-500" />
                  <span className="ml-2 text-lg text-gray-700">{restaurant.rating}</span>
                </div>
              </div>
              
              {currentUser?.role === 'admin' && (
                <div className="flex space-x-4">
                  <Link
                    to={`/restaurants/${id}/edit`}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={handleDelete}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Details</h2>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    <span className="font-medium">Category:</span> {restaurant.kategori}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Location:</span> {restaurant.lokasi}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Price Range:</span> {formatPriceRange(restaurant.price)}
                  </p>
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p className="text-gray-600">{restaurant.deskripsi || 'No description available.'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Spot Detail Page
function SpotDetail() {
  const { id } = useParams();
  const [spot, setSpot] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSpot = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/spots/${id}`);
        setSpot(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching spot:', error);
        setLoading(false);
      }
    };

    fetchSpot();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this spot?')) {
      try {
        await authAxios.delete(`${API_BASE_URL}/spots/${id}`);
        navigate('/spots');
      } catch (error) {
        console.error('Error deleting spot:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!spot) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-gray-600">Spot not found.</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative h-96">
            {spot.image_url ? (
              <img 
                src={spot.image_url}
                alt={spot.namaTempat}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-400 to-purple-300">
                <MapPinIcon className="h-24 w-24 text-white" />
              </div>
            )}
          </div>
          
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{spot.namaTempat}</h1>
                <div className="flex items-center mb-4">
                  <StarIcon className="h-6 w-6 text-yellow-500" />
                  <span className="ml-2 text-lg text-gray-700">{spot.rating}</span>
                </div>
              </div>
              
              {currentUser?.role === 'admin' && (
                <div className="flex space-x-4">
                  <Link
                    to={`/spots/${id}/edit`}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={handleDelete}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Details</h2>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    <span className="font-medium">Category:</span> {spot.kategori}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Location:</span> {spot.lokasi}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Price Range:</span> {formatPriceRange(spot.price)}
                  </p>
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p className="text-gray-600">{spot.deskripsi || 'No description available.'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Article Detail Page
function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/articles/${id}`);
        setArticle(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching article:', error);
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await authAxios.delete(`${API_BASE_URL}/articles/${id}`);
        navigate('/articles');
      } catch (error) {
        console.error('Error deleting article:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-gray-600">Article not found.</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative h-96">
            {article.image_url ? (
              <img 
                src={article.image_url}
                alt={article.judulArtikel}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-gray-400 to-gray-300">
                <NewspaperIcon className="h-24 w-24 text-white" />
              </div>
            )}
          </div>
          
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{article.judulArtikel}</h1>
                <p className="text-gray-500">
                  Published on {new Date(article.created_at).toLocaleDateString()}
                </p>
              </div>
              
              {currentUser?.role === 'admin' && (
                <div className="flex space-x-4">
                  <Link
                    to={`/articles/${id}/edit`}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={handleDelete}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
            
            <div className="prose max-w-none mt-6">
              <div dangerouslySetInnerHTML={{ __html: article.kontenArtikel }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;