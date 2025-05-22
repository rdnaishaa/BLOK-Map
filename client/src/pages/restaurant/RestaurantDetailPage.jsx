import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getRestaurantArticleById } from '../../services/articles_api'
import { getReviews } from '../../services/review_api'
import { getCatalogsByRestaurantId } from '../../services/catalogs_api'
import LoadingSpinner from '../../components/LoadingSpinner'
import RatingStars from '../../components/RatingStars'
import MapEmbed from '../../components/MapEmbed'

const RestaurantDetailPage = () => {
  const { id } = useParams()
  const [article, setArticle] = useState(null)
  const [reviews, setReviews] = useState([])
  const [catalogs, setCatalogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // First fetch article and reviews
        const [articleResponse, reviewsResponse] = await Promise.all([
          getRestaurantArticleById(id),
          getReviews({ restaurant_id: id })
        ])

        if (!articleResponse.success) {
          throw new Error(articleResponse.message || 'Failed to fetch article details')
        }

        setArticle(articleResponse.payload)
        console.log('Article data:', {
          id: articleResponse.payload.id,
          restaurant_id: articleResponse.payload.restaurant_id,
          // Log other relevant fields
        })
        
        // Get reviews specific to this restaurant
        const restaurantReviews = reviewsResponse.payload?.filter(review => review.restaurant_id === id) || []
        setReviews(restaurantReviews)

        // Now fetch catalogs using the restaurant_id from the article
        if (articleResponse.payload.restaurant_id) {
          console.log('Fetching catalogs with restaurant_id:', articleResponse.payload.restaurant_id) // Add this log
          const catalogsResponse = await getCatalogsByRestaurantId(articleResponse.payload.restaurant_id)
          console.log('Catalogs Response:', catalogsResponse) // Add this log
          if (catalogsResponse.success) {
            setCatalogs(catalogsResponse.payload)
          }
        } else {
          console.log('No restaurant_id found in article:', articleResponse.payload) // Add this log
        }

      } catch (error) {
        console.error('Error fetching data:', error)
        setError(error.message || 'Failed to load content')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen w-full flex justify-center items-center bg-[#3D1E0F]">
        <LoadingSpinner />
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="min-h-screen w-full bg-[#3D1E0F]">
        <div className="container mx-auto p-6">
          <div className="bg-red-600/20 border border-red-600 text-white p-4 rounded-md">
            <p>{error || 'Article not found'}</p>
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
        {/* Article Title */}
        <h1 className="text-4xl font-['Special_Elite'] text-[#CCBA78] mb-6">
          {article.judulartikel}
        </h1>

        {/* Restaurant Details Card */}
        <div className="bg-[#2A1509]/70 rounded-lg p-6 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold text-[#CCBA78]">
                {article.namarestaurant}
              </h2>
              <div className="flex items-center mt-2">
                <RatingStars rating={parseFloat(article.rating) || 0} />
                <span className="ml-2 text-[#CCBA78]">
                  {article.rating ? `${parseFloat(article.rating).toFixed(1)}` : 'No rating'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Image */}
        <div className="h-96 rounded-lg overflow-hidden mb-8">
          <img 
            src={article.image_url || '/images/restaurant-default.jpg'} 
            alt={article.judulartikel}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Content */}
        <div className="bg-[#2A1509]/70 rounded-lg p-6 mb-8">
          <p className="text-[#CCBA78] text-lg">
            {article.kontenartikel}
          </p>
        </div>

        {/* Catalogs Section */}
        {catalogs.length > 0 && (
          <div className="bg-[#2A1509]/70 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-medium text-[#CCBA78] mb-4">
              Menu Catalogs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {catalogs.map((catalog) => (
                <div 
                  key={catalog.id} 
                  className="bg-[#3D1E0F] rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  {catalog.image_url && (
                    <div className="h-48">
                      <img 
                        src={catalog.image_url} 
                        alt={catalog.namakatalog}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-[#CCBA78] mb-2">
                      {catalog.namakatalog}
                    </h3>
                    <p className="text-[#CCBA78]/80 text-sm mb-2 line-clamp-2">
                      {catalog.deskripsikatalog}
                    </p>
                    <p className="text-[#CCBA78] font-semibold">
                      Rp {catalog.harga.toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Location Section */}
        <div className="bg-[#2A1509]/70 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-medium text-[#CCBA78] mb-4">
            Location
          </h2>
          <div className="flex items-center p-4 bg-[#3D1E0F] rounded-lg">
            <div className="bg-[#CCBA78]/10 w-11 h-11 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-[#CCBA78]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-[#CCBA78]">{article.lokasi}</p>
              {article.jam_operasional && (
                <p className="text-[#CCBA78]/70">{article.jam_operasional}</p>
              )}
            </div>
          </div>

          {/* Map and Directions */}
          <div className="mt-4">
            <MapEmbed location={article.lokasi} />
            <a 
              href={`https://maps.google.com/?q=${encodeURIComponent(article.lokasi || '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 block w-full p-2 bg-[#CCBA78] text-white text-center rounded hover:bg-[#D8C78E]"
            >
              Get Directions
            </a>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-[#2A1509]/70 rounded-lg p-6">
          <h2 className="text-xl font-medium text-[#CCBA78] mb-4">Reviews</h2>
          <div className="space-y-4">
            {reviews.map((review, index) => (
              <div key={review.id || index} className="flex items-start p-4 bg-[#3D1E0F] rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-11 h-11 bg-[#CCBA78]/20 rounded-full"></div>
                </div>
                <div className="ml-3">
                  <div className="flex items-center">
                    <p className="text-[#CCBA78]">{review.username}</p>
                    <RatingStars rating={review.rating} className="ml-2" />
                  </div>
                  <p className="text-[#CCBA78]/70 mt-1">{review.content}</p>
                </div>
              </div>
            ))}
            {reviews.length === 0 && (
              <p className="text-center text-[#CCBA78]/70">No reviews yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RestaurantDetailPage