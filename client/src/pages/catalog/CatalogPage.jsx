import { useState, useEffect } from 'react'
import { getCatalogs } from '../../services/catalogs_api'
import CatalogCard from '../../components/CatalogCard'
import LoadingSpinner from '../../components/LoadingSpinner'

const CatalogPage = () => {
  const [catalogs, setCatalogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  
  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        setLoading(true)
        const response = await getCatalogs()
        
        // Handle payload structure
        const data = response.payload || response.data || []
        setCatalogs(data)
      } catch (err) {
        console.error('Error fetching catalogs:', err)
        setError('Failed to load catalogs. Please try again later.')
      } finally {
        setLoading(false)
      }
    }
    
    fetchCatalogs()
  }, [])
  
  // Get unique categories from catalogs
  const categories = ['all', ...new Set(catalogs.map(catalog => catalog.category))]
  
  // Filtered catalogs based on search and category
  const filteredCatalogs = catalogs.filter(catalog => {
    // Check search term
    const matchesSearch = !searchTerm || 
      catalog.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      catalog.description?.toLowerCase().includes(searchTerm.toLowerCase())
    
    // Check category filter
    const matchesCategory = categoryFilter === 'all' || catalog.category === categoryFilter
    
    return matchesSearch && matchesCategory
  })

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
    <div className="min-h-screen bg-[#3D1E0F] text-white">
      <div className="container mx-auto p-6">
        <h1 className="font-['Special_Elite'] text-4xl text-[#CCBA78] mb-6">Food & Drink Catalog</h1>
        
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-grow">
              <input
                type="text"
                placeholder="Search food & drinks..."
                className="w-full p-2 rounded bg-[#2A1509] border border-[#CCBA78] text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div>
              <select
                className="p-2 rounded bg-[#2A1509] border border-[#CCBA78] text-white"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {filteredCatalogs.length === 0 ? (
            <div className="bg-white/10 rounded-lg p-8 text-center">
              <p className="text-xl">No items found matching your criteria.</p>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('all');
                }}
                className="mt-4 bg-[#CCBA78] text-white px-4 py-2 rounded hover:bg-[#D8C78E]"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCatalogs.map(catalog => (
                <CatalogCard key={catalog.id} catalog={catalog} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CatalogPage