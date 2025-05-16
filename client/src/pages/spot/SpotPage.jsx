import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SpotCard from '../../components/SpotCard'
import LoadingSpinner from '../../components/LoadingSpinner'
import { getSpots, getSpotCategories, getSpotLocations } from '../../services/api'

const SpotPage = () => {
  const [spots, setSpots] = useState([])
  const [categories, setCategories] = useState([])
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [locationFilter, setLocationFilter] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [spotsData, categoriesData, locationsData] = await Promise.all([
          getSpots({
            search: searchTerm,
            kategori: categoryFilter,
            lokasi: locationFilter
          }),
          getSpotCategories(),
          getSpotLocations()
        ])
        setSpots(spotsData)
        setCategories(categoriesData)
        setLocations(locationsData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [searchTerm, categoryFilter, locationFilter])

  if (loading) return <LoadingSpinner />

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-special-elite text-white mb-6">Spot Hangout</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-white mb-2">Search</label>
            <input
              type="text"
              placeholder="Search spots..."
              className="w-full p-2 rounded"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-white mb-2">Category</label>
            <select
              className="w-full p-2 rounded"
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
            <label className="block text-white mb-2">Location</label>
            <select
              className="w-full p-2 rounded"
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {spots.map(spot => (
            <Link to={`/spots/${spot.id}`} key={spot.id}>
              <SpotCard spot={spot} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SpotPage