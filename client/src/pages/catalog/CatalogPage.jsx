import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CatalogCard from '../../components/CatalogCard'
import LoadingSpinner from '../../components/LoadingSpinner'
import { getCatalogs } from '../../services/api'

const CatalogPage = () => {
  const [catalogs, setCatalogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const params = {
          search: searchTerm,
          kategoriRestaurant_id: categoryFilter,
          lokasi: locationFilter,
          minHarga: minPrice,
          maxHarga: maxPrice
        }
        const data = await getCatalogs(params)
        setCatalogs(data)
      } catch (error) {
        console.error('Error fetching catalogs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCatalogs()
  }, [searchTerm, categoryFilter, locationFilter, minPrice, maxPrice])

  if (loading) return <LoadingSpinner />

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-special-elite text-white mb-6">Food & Drink</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="md:col-span-2">
            <label className="block text-white mb-2">Search</label>
            <input
              type="text"
              placeholder="Search food or drink..."
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
              <option value="Sweetness Overload">Sweetness Overload</option>
              <option value="Umami-rich">Umami-rich</option>
              <option value="Fine Dining">Fine Dining</option>
              <option value="Amigos">Amigos</option>
              <option value="Sip and savor">Sip and savor</option>
              <option value="Brew Coffee">Brew Coffee</option>
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
              <option value="Blok-M Square">Blok-M Square</option>
              <option value="Plaza Blok-M">Plaza Blok-M</option>
              <option value="Melawai">Melawai</option>
              <option value="Taman Literasi">Taman Literasi</option>
              <option value="Barito">Barito</option>
              <option value="Gulai Tikungan (Mahakam)">Gulai Tikungan</option>
              <option value="Senayan">Senayan</option>
              <option value="Kebayoran Baru">Kebayoran Baru</option>
            </select>
          </div>
          <div>
            <label className="block text-white mb-2">Min Price</label>
            <input
              type="number"
              placeholder="Min price"
              className="w-full p-2 rounded"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-white mb-2">Max Price</label>
            <input
              type="number"
              placeholder="Max price"
              className="w-full p-2 rounded"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {catalogs.map(catalog => (
            <Link to={`/catalogs/${catalog.id}`} key={catalog.id}>
              <CatalogCard catalog={catalog} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CatalogPage