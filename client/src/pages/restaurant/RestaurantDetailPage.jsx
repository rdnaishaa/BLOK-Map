import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getRestaurantArticleById } from '../../services/articles_api'
import { getReviewsByRestaurantId } from '../../services/review_api'
import { getCatalogsByRestaurantId } from '../../services/catalogs_api'
import LoadingSpinner from '../../components/LoadingSpinner'
import MapEmbed from '../../components/MapEmbed'
import ReviewForm from '../../components/ReviewForm'
import RatingStars from '../../components/RatingStars'
import { useAuth } from '../../hooks/useAuth'

const RestaurantDetailPage = () => {
  const { id } = useParams()
  const [article, setArticle] = useState(null)
  const [reviews, setReviews] = useState([])
  const [catalogs, setCatalogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { isLogin } = useAuth()

  const handleReviewAdded = (newReview) => {
    setReviews(prevReviews => [...prevReviews, newReview])
  }

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + parseFloat(review.rating || 0), 0);
    return (sum / reviews.length).toFixed(1);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // First fetch article
        const articleResponse = await getRestaurantArticleById(id)

        if (!articleResponse.success) {
          throw new Error(articleResponse.message || 'Failed to fetch article details')
        }

        setArticle(articleResponse.payload)

        // Get reviews specific to this restaurant using the dedicated function
        if (articleResponse.payload.restaurant_id) {
          const reviewsResponse = await getReviewsByRestaurantId(articleResponse.payload.restaurant_id)
          if (reviewsResponse.success) {
            setReviews(reviewsResponse.payload)
          } else {
            console.error('Failed to fetch reviews:', reviewsResponse.message)
          }
        } else {
          console.warn('No restaurant_id found in article:', articleResponse.payload)
        }

        // Now fetch catalogs using the restaurant_id from the article
        if (articleResponse.payload.restaurant_id) {
          const catalogsResponse = await getCatalogsByRestaurantId(articleResponse.payload.restaurant_id)
          if (catalogsResponse.success) {
            setCatalogs(catalogsResponse.payload)
          }
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
      <div className="min-h-screen w-full flex justify-center items-center bg-gradient-to-br from-[#3D1E0F] to-[#2A1509]">
        <LoadingSpinner />
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-[#3D1E0F] to-[#2A1509]">
        <div className="container mx-auto p-6">
          <div className="bg-red-600/20 backdrop-blur-sm border border-red-600/30 text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center mb-4">
              <svg className="w-6 h-6 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-lg font-medium">{error || 'Article not found'}</p>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-[#CCBA78] to-[#D8C78E] text-[#3D1E0F] px-6 py-3 rounded-lg font-semibold hover:from-[#D8C78E] hover:to-[#CCBA78] transition-all duration-300 shadow-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3D1E0F] to-[#2A1509]">
      {/* Hero Section */}
      <div className="relative">
        <div className="h-[60vh] relative overflow-hidden">
          <img 
            src={article.image_url || '/images/restaurant-default.jpg'} 
            alt={article.judulartikel}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#3D1E0F] via-[#3D1E0F]/50 to-transparent"></div>
          
          {/* Hero Content */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="container mx-auto">
              <h1 className="text-5xl md:text-6xl font-['Special_Elite'] text-[#CCBA78] mb-4 drop-shadow-2xl">
                {article.judulartikel}
              </h1>
              
              {/* Restaurant Info Card */}
              <div className="bg-[#2A1509]/80 backdrop-blur-md rounded-2xl p-6 border border-[#CCBA78]/20 shadow-2xl max-w-2xl">
                <h2 className="text-2xl font-bold text-[#CCBA78] mb-3">
                  {article.namarestaurant}
                </h2>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <RatingStars rating={parseFloat(calculateAverageRating(reviews))} />
                    <span className="ml-3 text-[#CCBA78] font-medium">
                      {reviews.length > 0 
                        ? `${calculateAverageRating(reviews)} (${reviews.length} reviews)`
                        : 'No reviews yet'}
                    </span>
                  </div>
                  <div className="flex items-center text-[#CCBA78]/80">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm">{article.lokasi}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 space-y-12">
        {/* Article Content Section */}
        <div className="bg-[#2A1509]/60 backdrop-blur-sm rounded-3xl p-8 border border-[#CCBA78]/10 shadow-xl">
          <div className="flex items-center mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-[#CCBA78] to-[#D8C78E] rounded-full mr-4"></div>
            <h2 className="text-2xl font-bold text-[#CCBA78]">About This Place</h2>
          </div>
          <p className="text-[#CCBA78]/90 text-lg leading-relaxed">
            {article.kontenartikel}
          </p>
        </div>

        {/* Menu Catalogs Section */}
        {catalogs.length > 0 && (
          <div className="bg-[#2A1509]/60 backdrop-blur-sm rounded-3xl p-8 border border-[#CCBA78]/10 shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="w-1 h-8 bg-gradient-to-b from-[#CCBA78] to-[#D8C78E] rounded-full mr-4"></div>
                <h2 className="text-2xl font-bold text-[#CCBA78]">Our Menu</h2>
              </div>
              <div className="bg-[#CCBA78]/20 px-4 py-2 rounded-full">
                <span className="text-[#CCBA78] font-medium">{catalogs.length} Items</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {catalogs.map((catalog) => (
                <div 
                  key={catalog.id} 
                  className="group bg-[#3D1E0F]/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-[#CCBA78]/10 hover:border-[#CCBA78]/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                >
                  {catalog.image_url && (
                    <div className="h-56 relative overflow-hidden">
                      <img 
                        src={catalog.image_url} 
                        alt={catalog.namakatalog}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#3D1E0F]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[#CCBA78] mb-3 group-hover:text-[#D8C78E] transition-colors duration-300">
                      {catalog.namakatalog}
                    </h3>
                    <p className="text-[#CCBA78]/80 text-sm mb-4 line-clamp-3">
                      {catalog.deskripsikatalog}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold text-[#CCBA78]">
                        Rp {catalog.harga.toLocaleString('id-ID')}
                      </p>
                      <div className="w-8 h-8 bg-gradient-to-r from-[#CCBA78] to-[#D8C78E] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <svg className="w-4 h-4 text-[#3D1E0F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Location Section */}
        <div className="bg-[#2A1509]/60 backdrop-blur-sm rounded-3xl p-8 border border-[#CCBA78]/10 shadow-xl">
          <div className="flex items-center mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-[#CCBA78] to-[#D8C78E] rounded-full mr-4"></div>
            <h2 className="text-2xl font-bold text-[#CCBA78]">Location & Hours</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-start p-6 bg-[#3D1E0F]/60 rounded-2xl border border-[#CCBA78]/10">
                <div className="bg-gradient-to-r from-[#CCBA78] to-[#D8C78E] w-12 h-12 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-[#3D1E0F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-[#CCBA78] font-semibold text-lg mb-2">Address</h3>
                  <p className="text-[#CCBA78]/80">{article.lokasi}</p>
                  {article.jam_operasional && (
                    <>
                      <h4 className="text-[#CCBA78] font-semibold mt-4 mb-1">Operating Hours</h4>
                      <p className="text-[#CCBA78]/80">{article.jam_operasional}</p>
                    </>
                  )}
                </div>
              </div>
              
              <a 
                href={`https://maps.google.com/?q=${encodeURIComponent(article.lokasi || '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 block w-full p-4 bg-gradient-to-r from-[#CCBA78] to-[#D8C78E] text-[#3D1E0F] text-center rounded-xl font-semibold hover:from-[#D8C78E] hover:to-[#CCBA78] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <div className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  Get Directions
                </div>
              </a>
            </div>
            
            <div className="rounded-2xl overflow-hidden border border-[#CCBA78]/10">
              <MapEmbed location={article.lokasi} />
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-[#2A1509]/60 backdrop-blur-sm rounded-3xl p-8 border border-[#CCBA78]/10 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <div className="w-1 h-8 bg-gradient-to-b from-[#CCBA78] to-[#D8C78E] rounded-full mr-4"></div>
              <h2 className="text-2xl font-bold text-[#CCBA78]">Reviews & Ratings</h2>
            </div>
            {reviews.length > 0 && (
              <div className="bg-[#CCBA78]/20 px-6 py-3 rounded-full">
                <span className="text-[#CCBA78] font-semibold">{reviews.length} Total Reviews</span>
              </div>
            )}
          </div>

          {/* Review Stats */}
          {reviews.length > 0 && (
            <div className="bg-[#3D1E0F]/60 rounded-2xl p-6 mb-8 border border-[#CCBA78]/10">
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#CCBA78] mb-2">
                    {calculateAverageRating(reviews)}
                  </div>
                  <RatingStars rating={parseFloat(calculateAverageRating(reviews))} className="justify-center mb-2" />
                  <p className="text-[#CCBA78]/80">Based on {reviews.length} reviews</p>
                </div>
              </div>
            </div>
          )}

          {/* Review Form */}
          {isLogin ? (
            <div className="bg-[#3D1E0F]/40 rounded-2xl p-6 mb-8 border border-[#CCBA78]/10">
              <h3 className="text-xl font-semibold text-[#CCBA78] mb-6 flex items-center">
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Share Your Experience
              </h3>
              <ReviewForm 
                restaurantId={article.restaurant_id}
                spotId={null}
                onReviewAdded={handleReviewAdded}
              />
            </div>
          ) : (
            <div className="text-center py-12 bg-[#3D1E0F]/40 rounded-2xl mb-8 border border-[#CCBA78]/10">
              <svg className="w-16 h-16 text-[#CCBA78]/50 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <p className="text-[#CCBA78] text-lg mb-6">Join our community to share your thoughts</p>
              <Link
                to="/login"
                className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-[#CCBA78] to-[#D8C78E] text-[#3D1E0F] rounded-xl font-semibold hover:from-[#D8C78E] hover:to-[#CCBA78] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Sign In to Review
              </Link>
            </div>
          )}
          
          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.map((review, index) => (
              <div key={review.id || index} className="bg-[#3D1E0F]/40 rounded-2xl p-6 border border-[#CCBA78]/10 hover:border-[#CCBA78]/20 transition-all duration-300">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#CCBA78] to-[#D8C78E] rounded-full flex items-center justify-center">
                      <span className="text-[#3D1E0F] font-bold text-lg">
                        {review.username?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-[#CCBA78] font-semibold text-lg">{review.username}</h4>
                      <RatingStars rating={review.rating} />
                    </div>
                    <p className="text-[#CCBA78]/80 leading-relaxed">{review.content}</p>
                  </div>
                </div>
              </div>
            ))}
            {reviews.length === 0 && (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-[#CCBA78]/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-[#CCBA78]/70 text-lg">No reviews yet. Be the first to share your experience!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RestaurantDetailPage