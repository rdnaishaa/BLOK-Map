import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SpotCard from '../../components/SpotCard'
import LoadingSpinner from '../../components/LoadingSpinner'
import { getSpots } from '../../services/spot_api'

const SpotPage = () => {
  const [spots, setSpots] = useState([])
  const [categories, setCategories] = useState([])
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [locationFilter, setLocationFilter] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Call spots API with filters
        const response = await getSpots({
          search: searchTerm,
          kategori: categoryFilter,
          lokasi: locationFilter
        })
        
        // Handle payload structure
        const spotsData = response.payload || response.data || []
        console.log('Spots data:', spotsData); // Check what's coming from API
        setSpots(spotsData)
        
        // Extract unique categories from spots data - using kategori field
        // This fixes the issue of showing kategori for spot names
        const uniqueCategories = [...new Set(spotsData.map(spot => spot.kategori_nama))]
          .filter(Boolean)
          .map(cat => ({ id: cat, name: cat })) // Changed kategori to name for clarity
        
        const uniqueLocations = [...new Set(spotsData.map(spot => spot.lokasi))]
          .filter(Boolean)
        
        setCategories(uniqueCategories)
        setLocations(uniqueLocations)
      } catch (error) {
        console.error('Error fetching spots data:', error)
        setError('Failed to load spots. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [searchTerm, categoryFilter, locationFilter])

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
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-['Special_Elite'] text-[#CCBA78] mb-6">Spot Hangout</h1>
        
        <div className="bg-[#2A1509]/70 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-[#CCBA78] mb-2">Search</label>
              <input
                type="text"
                placeholder="Search spots..."
                className="w-full p-2 rounded bg-[#2A1509] border border-[#CCBA78] text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[#CCBA78] mb-2">Category</label>
              <select
                className="w-full p-2 rounded bg-[#2A1509] border border-[#CCBA78] text-white"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name} {/* Display category name */}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[#CCBA78] mb-2">Location</label>
              <select
                className="w-full p-2 rounded bg-[#2A1509] border border-[#CCBA78] text-white"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              >
                <option value="">All Locations</option>
                {locations.map((location, index) => (
                  <option key={index} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button 
              onClick={() => {
                setSearchTerm('')
                setCategoryFilter('')
                setLocationFilter('')
              }}
              className="px-4 py-2 bg-[#CCBA78] text-white rounded hover:bg-[#D8C78E]"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {spots.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {spots.map(spot => (
              <Link to={`/spot/${spot.id}`} key={spot.id} className="transform transition hover:scale-[1.02]">
                <SpotCard 
                  spot={{
                    ...spot,
                    // Ensure we're displaying the name properly in the card
                    displayName: spot.nama || spot.name || 'Unnamed Spot'
                  }}
                />
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white/10 rounded-lg p-8 text-center">
            <p className="text-white text-xl">No spots found matching your criteria.</p>
            <button 
              onClick={() => {
                setSearchTerm('')
                setCategoryFilter('')
                setLocationFilter('')
              }}
              className="mt-4 bg-[#CCBA78] text-white px-4 py-2 rounded hover:bg-[#D8C78E]"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default SpotPage