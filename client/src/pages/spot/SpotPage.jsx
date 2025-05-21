import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SpotCard from '../../components/SpotCard'
import LoadingSpinner from '../../components/LoadingSpinner'
import { getSpots, getKategoriList, getLokasiList } from '../../services/spot_api'

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
        setLoading(true);
        const spotsResponse = await getSpots();
        console.log('Spots data received:', spotsResponse); // Tambahkan ini untuk debugging
        
        if (spotsResponse?.payload) {
          setSpots(spotsResponse.payload);
        }
        // Then fetch categories and locations
        const [categoriesRes, locationsRes] = await Promise.all([
          getKategoriList(),
          getLokasiList()
        ]);

        if (categoriesRes?.payload) {
          setCategories(categoriesRes.payload);
        }
        if (locationsRes?.payload) {
          setLocations(locationsRes.payload);
        }

      } catch (error) {
        console.error('Error:', error);
        setError('Failed to load spots');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#3D1E0F]">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#3D1E0F]">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-['Special_Elite'] text-[#CCBA78] mb-6">
          Spot Hangout
        </h1>
        
        <div className="bg-[#2A1509]/70 rounded-lg p-6 mb-8">
          {/* Filters */}
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
                  <option key={category.id} value={category.kategori}>
                    {category.kategori}
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

          {/* Results */}
          {error ? (
            <div className="text-red-500 bg-red-100 p-4 rounded">
              {error}
              <button 
                onClick={() => window.location.reload()}
                className="ml-4 underline"
              >
                Retry
              </button>
            </div>
          ) : spots.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {spots.map(spot => (
                <SpotCard key={spot.id} spot={spot} />
              ))}
            </div>
          ) : (
            <div className="text-center text-white py-8">
              No spots found matching your criteria
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SpotPage