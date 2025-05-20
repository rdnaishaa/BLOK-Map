import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getCatalogById } from '../../services/catalog_api'
import LoadingSpinner from '../../components/LoadingSpinner'
import RatingStars from '../../components/RatingStars'

const CatalogDetailPage = () => {
  const { id } = useParams()
  const [catalog, setCatalog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    const fetchCatalog = async () => {
      if (!id) {
        setLoading(false)
        return
      }
      
      try {
        const response = await getCatalogById(id)
        
        // Handle payload structure
        const catalogData = response.payload || response.data || null
        if (!catalogData) {
          setError('Catalog item not found')
        } else {
          setCatalog(catalogData)
        }
      } catch (err) {
        console.error('Error fetching catalog details:', err)
        setError('Failed to load catalog details.')
      } finally {
        setLoading(false)
      }
    }
    
    fetchCatalog()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#3D1E0F]">
        <LoadingSpinner />
      </div>
    )
  }

  if (error || !catalog) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <p className="text-xl text-red-600 mb-4">{error || 'Catalog item not found'}</p>
          <button 
            onClick={() => window.history.back()} 
            className="px-4 py-2 bg-[#CCBA78] text-white rounded hover:bg-[#D8C78E]"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
            <img 
              src={catalog.image_url || '/placeholder-food.jpg'} 
              alt={catalog.name} 
              className="w-full h-full object-cover"
              style={{ maxHeight: '500px' }}
            />
          </div>
          <div className="p-6 md:w-1/2">
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold text-primary-black mb-2">
                {catalog.name}
              </h1>
              <span className="bg-[#CCBA78] text-white px-3 py-1 rounded-full text-sm">
                {catalog.category}
              </span>
            </div>
            
            <div className="flex items-center mb-4">
              <RatingStars rating={catalog.rating || 0} />
              <span className="ml-2 text-gray-600">
                {(catalog.rating || 0).toFixed(1)} ({catalog.reviewCount || 0} reviews)
              </span>
            </div>
            
            <div className="mb-4">
              <p className="text-2xl font-bold text-[#3D1E0F]">
                {catalog.price ? `IDR ${catalog.price.toLocaleString()}` : 'Price unavailable'}
              </p>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-primary-black mb-2">Description</h2>
              <p className="text-gray-700">{catalog.description}</p>
            </div>
            
            {catalog.ingredients && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-primary-black mb-2">Ingredients</h2>
                <ul className="list-disc list-inside text-gray-700">
                  {catalog.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {catalog.restaurants && catalog.restaurants.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-primary-black mb-2">Where to Find</h2>
                <div className="space-y-2">
                  {catalog.restaurants.map(restaurant => (
                    <Link 
                      key={restaurant.id} 
                      to={`/restaurant/${restaurant.id}`}
                      className="block p-3 border border-gray-200 rounded hover:bg-gray-50"
                    >
                      <div className="font-medium text-[#3D1E0F]">{restaurant.namaRestaurant}</div>
                      <div className="text-sm text-gray-600">{restaurant.lokasi}</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex justify-between">
              <button 
                onClick={() => window.history.back()} 
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Back
              </button>
              {catalog.restaurants?.[0]?.id && (
                <Link 
                  to={`/restaurant/${catalog.restaurants[0].id}`}
                  className="px-4 py-2 bg-[#CCBA78] text-white rounded hover:bg-[#D8C78E]"
                >
                  View Restaurant
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CatalogDetailPage