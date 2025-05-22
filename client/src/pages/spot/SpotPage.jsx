import { useEffect, useState } from 'react'
import { getSpotArticles } from '../../services/articles_api'
import LoadingSpinner from '../../components/LoadingSpinner'
import ArticleCard from '../../components/ArticleCard'

const SpotPage = () => {
  const [articles, setArticles] = useState([])
  const [filteredArticles, setFilteredArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [categories, setCategories] = useState([])
  const [locations, setLocations] = useState([])

  // Fetch spot articles from API
  useEffect(() => {
    const fetchSpotArticles = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await getSpotArticles()
        console.log('Spot articles response:', response)
        
        // Handle payload structure
        const data = response.payload
        setArticles(data)
        setFilteredArticles(data)

        // Extract unique categories and locations
        const uniqueCategories = [...new Set(data.map(article => article.kategori))]
          .filter(Boolean)
          .map(cat => ({ id: cat, name: cat }))
        
        const uniqueLocations = [...new Set(data.map(article => article.lokasi))]
          .filter(Boolean)

        setCategories(uniqueCategories)
        setLocations(uniqueLocations)
      } catch (err) {
        console.error('Error fetching spot articles:', err)
        setError('Failed to load spot articles. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchSpotArticles()
  }, [])

  // Filter articles based on search term and filters
  useEffect(() => {
    let result = articles
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(article => 
        article.judulArtikel?.toLowerCase().includes(term) ||
        article.kontenArtikel?.toLowerCase().includes(term) ||
        article.spot?.namaSpot?.toLowerCase().includes(term) ||
        article.spot?.lokasi?.toLowerCase().includes(term)
      )
    }

    if (categoryFilter) {
      result = result.filter(article => article.kategori === categoryFilter)
    }

    if (locationFilter) {
      result = result.filter(article => article.lokasi === locationFilter)
    }
    
    setFilteredArticles(result)
  }, [searchTerm, categoryFilter, locationFilter, articles])

  if (loading) {
    return (
      <div className="min-h-screen w-full flex justify-center items-center bg-[#3D1E0F]">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-[#3D1E0F]">
        <div className="container mx-auto p-6">
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
    <div className="min-h-screen w-full bg-[#3D1E0F]">
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-['Special_Elite'] text-[#CCBA78] mb-6">Spot Articles</h1>
        
        <div className="bg-[#2A1509]/70 rounded-lg p-6 mb-8">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-[#CCBA78] mb-2">Search</label>
              <input
                type="text"
                placeholder="Search articles..."
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
                    {category.name}
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

        {filteredArticles.length === 0 ? (
          <div className="bg-white/10 rounded-lg p-8 text-center">
            <p className="text-white text-xl">No articles found matching your criteria.</p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('');
                setLocationFilter('');
              }}
              className="mt-4 bg-[#CCBA78] text-white px-4 py-2 rounded hover:bg-[#D8C78E]"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map(article => (
              <ArticleCard
                key={article.id} 
                article={{
                  ...article,
                  image_url: article.image_url,
                  judulartikel: article.judulartikel,
                  kontenartikel: article.kontenartikel,
                  spot_id: article.spot_id,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SpotPage