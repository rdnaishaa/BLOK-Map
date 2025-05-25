import { useEffect, useState } from 'react'
import { useParams, Link, } from 'react-router-dom'
import { getSpotArticleById } from '../../services/articles_api'
import { getReviewsBySpotId } from '../../services/review_api'
import { useAuth } from '../../hooks/useAuth'
import LoadingSpinner from '../../components/LoadingSpinner'
import RatingStars from '../../components/RatingStars'
import MapEmbed from '../../components/MapEmbed'
import ReviewForm from '../../components/ReviewForm'

const SpotDetailPage = () => {
  const { id } = useParams()
  const [article, setArticle] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const { isLogin } = useAuth()

  const handleReviewAdded = (newReview) => {
    setReviews(prevReviews => [...prevReviews, newReview])
  }

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0
    const sum = reviews.reduce((acc, review) => acc + parseFloat(review.rating || 0), 0)
    return (sum / reviews.length).toFixed(1)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const articleResponse = await getSpotArticleById(id)
        if (!articleResponse.success) {
          throw new Error(articleResponse.message || 'Failed to fetch article details')
        }

        setArticle(articleResponse.payload)

        const reviewsResponse = await getReviewsBySpotId(articleResponse.payload.spot_id)
        if (reviewsResponse.success) {
          setReviews(reviewsResponse.payload)
        } else {
          console.error('Failed to fetch reviews:', reviewsResponse.message)
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
      <div className="min-h-screen w-full flex justify-center items-center bg-gradient-to-br from-[#3D1E0F] via-[#2A1509] to-[#1A0E05]">
        <div className="text-center">
          <LoadingSpinner />
          <div className="mt-4 text-[#CCBA78]/70 animate-pulse">Loading amazing spot...</div>
        </div>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-[#3D1E0F] via-[#2A1509] to-[#1A0E05]">
        <div className="container mx-auto p-6 flex items-center justify-center min-h-screen">
          <div className="bg-gradient-to-r from-red-900/20 to-red-800/20 backdrop-blur-sm border border-red-600/30 text-white p-8 rounded-2xl shadow-2xl max-w-md w-full animate-fade-in">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <p className="text-lg mb-6">{error || 'Article not found'}</p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-[#CCBA78] to-[#D8C78E] text-[#3D1E0F] px-6 py-3 rounded-xl hover:scale-105 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3D1E0F] via-[#2A1509] to-[#1A0E05]">
      {/* Hero Section */}
      <div className="relative">
        {/* Hero Image */}
        <div className="relative h-[70vh] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-[#3D1E0F] via-transparent to-transparent z-10"></div>
          <img 
            src={article.image_url || '/images/spot-default.jpg'} 
            alt={article.judulartikel}
            className={`w-full h-full object-cover transition-all duration-1000 ${imageLoaded ? 'scale-100 opacity-100' : 'scale-110 opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Floating Title Card */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 w-full max-w-4xl px-4">
            <div className="bg-gradient-to-r from-[#2A1509]/90 to-[#3D1E0F]/90 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-[#CCBA78]/20 animate-slide-up">
              <h1 className="text-4xl md:text-5xl font-['Special_Elite'] text-[#CCBA78] mb-4 text-center leading-tight">
                {article.judulartikel}
              </h1>
              
              {/* Spot Info Bar */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-[#CCBA78] rounded-full animate-pulse"></div>
                    <h2 className="text-xl text-[#CCBA78] font-semibold">
                      {article.namatempat}
                    </h2>
                  </div>
                </div>
                
                <div className="flex items-center bg-[#CCBA78]/10 px-4 py-2 rounded-full backdrop-blur-sm">
                  <RatingStars rating={parseFloat(calculateAverageRating(reviews))} />
                  <span className="ml-2 text-[#CCBA78] font-medium">
                    {reviews.length > 0 
                      ? `${calculateAverageRating(reviews)} (${reviews.length} reviews)`
                      : 'No reviews yet'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 space-y-8">
        {/* Article Content */}
        <div className="bg-gradient-to-r from-[#2A1509]/70 to-[#3D1E0F]/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-[#CCBA78]/10 hover:border-[#CCBA78]/20 transition-all duration-500">
          <div className="flex items-center mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-[#CCBA78] to-[#D8C78E] rounded-full mr-4"></div>
            <h2 className="text-2xl font-semibold text-[#CCBA78]">About This Place</h2>
          </div>
          <p className="text-[#CCBA78]/90 text-lg leading-relaxed">
            {article.kontenartikel}
          </p>
        </div>

        {/* Location Section */}
        <div className="bg-gradient-to-r from-[#2A1509]/70 to-[#3D1E0F]/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-[#CCBA78]/10 hover:border-[#CCBA78]/20 transition-all duration-500">
          <div className="flex items-center mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-[#CCBA78] to-[#D8C78E] rounded-full mr-4"></div>
            <h2 className="text-2xl font-semibold text-[#CCBA78]">Location & Directions</h2>
          </div>
          
          <div className="flex items-center p-6 bg-gradient-to-r from-[#3D1E0F]/80 to-[#2A1509]/80 rounded-xl mb-6 hover:scale-[1.02] transition-transform duration-300">
            <div className="bg-gradient-to-r from-[#CCBA78]/20 to-[#D8C78E]/20 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-[#CCBA78]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="ml-4 flex-1">
              <p className="text-[#CCBA78] text-lg font-medium">{article.lokasi}</p>
              {article.spot?.jam_operasional && (
                <p className="text-[#CCBA78]/70 flex items-center mt-1">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {article.spot.jam_operasional}
                </p>
              )}
            </div>
          </div>

          {/* Map and Directions */}
          <div className="space-y-4">
            <div className="rounded-xl overflow-hidden shadow-lg">
              <MapEmbed location={article.lokasi} />
            </div>
            <a 
              href={`https://maps.google.com/?q=${encodeURIComponent(article.spot?.lokasi || '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full p-4 bg-gradient-to-r from-[#CCBA78] to-[#D8C78E] text-[#3D1E0F] text-center rounded-xl hover:scale-[1.02] transition-all duration-300 font-semibold shadow-lg hover:shadow-xl text-lg"
            >
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Get Directions
              </div>
            </a>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-[#2A1509]/70 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium text-[#CCBA78]">Reviews</h2>
            {reviews.length > 0 && (
              <div className="bg-[#CCBA78]/10 px-4 py-2 rounded-full">
                <span className="text-[#CCBA78] font-medium">{reviews.length} total</span>
              </div>
            )}
          </div>

          {isLogin ? (
            <div className="mb-8">
              <h3 className="text-lg font-medium text-[#CCBA78] mb-4">Leave a Review</h3>
              <ReviewForm 
                restaurantId={null}
                spotId={article.spot_id}
                onReviewAdded={handleReviewAdded}
              />
            </div>
          ) : (
            <div className="text-center py-6 bg-[#3D1E0F]/50 rounded-lg mb-6">
              <p className="text-[#CCBA78] mb-4">Please log in to leave a review</p>
              <Link
                to="/login"
                className="inline-block px-6 py-2 bg-gradient-to-r from-[#CCBA78] to-[#D8C78E] text-[#3D1E0F] rounded-xl font-semibold hover:from-[#D8C78E] hover:to-[#CCBA78] transition-all duration-300"
              >
                Log In
              </Link>
            </div>
          )}
          
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

export default SpotDetailPage