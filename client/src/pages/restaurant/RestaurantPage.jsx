import { useState, useEffect } from 'react'
import { getRestaurants } from '../../services/restaurant_api'
import RestaurantCard from '../../components/RestaurantCard'
import LoadingSpinner from '../../components/LoadingSpinner'
// import SearchFilter from '../../components/SearchFilter'

const RestaurantPage = () => {
  const [restaurants, setRestaurants] = useState([])
  const [filteredRestaurants, setFilteredRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: 'all'
  })

  // Fetch restaurants from API
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true)
        const response = await getRestaurants()
        
        // Handle payload structure
        const data = response.payload || response.data || []
        setRestaurants(data)
        setFilteredRestaurants(data)
      } catch (err) {
        console.error('Error fetching restaurants:', err)
        setError('Failed to load restaurants. Please try again later.')
      } finally {
        setLoading(false)
      }
    }
    
    fetchRestaurants()
  }, [])

  // Filter restaurants based on search term and filters
  useEffect(() => {
    let result = restaurants
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(restaurant => 
        restaurant.namaRestaurant.toLowerCase().includes(term) ||
        restaurant.lokasi.toLowerCase().includes(term) ||
        restaurant.informasiRestaurant?.toLowerCase().includes(term)
      )
    }
    
    // Apply category filter
    if (filters.category !== 'all') {
      result = result.filter(restaurant => 
        restaurant.kategori === filters.category
      )
    }
    
    // Apply price filter
    if (filters.priceRange !== 'all') {
      // Logic based on your price range structure
      switch(filters.priceRange) {
        case 'low':
          result = result.filter(restaurant => restaurant.priceRange === 'low' || restaurant.price_level === 1)
          break
        case 'medium':
          result = result.filter(restaurant => restaurant.priceRange === 'medium' || restaurant.price_level === 2)
          break
        case 'high':
          result = result.filter(restaurant => restaurant.priceRange === 'high' || restaurant.price_level === 3)
          break
        default:
          break
      }
    }
    
    setFilteredRestaurants(result)
  }, [searchTerm, filters, restaurants])

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#3D1E0F]">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#3D1E0F] text-white p-6">
        <div className="container mx-auto">
          <div className="bg-red-600/20 border border-red-600 text-white p-4 rounded-md">
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 bg-white text-red-600 px-4 py-2 rounded-md hover:bg-gray-100"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#3D1E0F]">
      <div className="container mx-auto p-6">
        <h1 className="font-['Special_Elite'] text-4xl text-[#CCBA78] mb-6">Restaurants & Cafes</h1>

        {/* <SearchFilter 
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          filters={filters}
          onFilterChange={handleFilterChange}
          categories={[
            { value: 'all', label: 'All Categories' },
            { value: 'restaurant', label: 'Restaurants' },
            { value: 'cafe', label: 'Cafes' },
            { value: 'bar', label: 'Bars' }
          ]}
          priceRanges={[
            { value: 'all', label: 'All Prices' },
            { value: 'low', label: '$' },
            { value: 'medium', label: '$$' },
            { value: 'high', label: '$$$' }
          ]}
        /> */}
        
        {filteredRestaurants.length === 0 ? (
          <div className="bg-white/10 rounded-lg p-8 text-center">
            <p className="text-white text-xl">No restaurants found matching your criteria.</p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setFilters({ category: 'all', priceRange: 'all' });
              }}
              className="mt-4 bg-[#CCBA78] text-white px-4 py-2 rounded hover:bg-[#D8C78E]"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRestaurants.map(restaurant => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default RestaurantPage