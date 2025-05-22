import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getSpotArticleById } from '../../services/articles_api'
import { getReviewsBySpotId } from '../../services/review_api'
import LoadingSpinner from '../../components/LoadingSpinner'
import RatingStars from '../../components/RatingStars'
import MapEmbed from '../../components/MapEmbed'

const SpotDetailPage = () => {
  const { id } = useParams()
  const [article, setArticle] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // First fetch article
        const articleResponse = await getSpotArticleById(id)

        if (!articleResponse.success) {
          throw new Error(articleResponse.message || 'Failed to fetch article details')
        }

        setArticle(articleResponse.payload)
        
        // Get reviews using the article id since it represents the spot
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

        {/* Spot Details Card */}
        <div className="bg-[#2A1509]/70 rounded-lg p-6 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold text-[#CCBA78]">
                {article.namatempat}
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
        <div className="h-96 rounded-lg mb-8">
          <img 
            src={article.image_url || '/images/spot-default.jpg'} 
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
              {article.spot?.jam_operasional && (
                <p className="text-[#CCBA78]/70">{article.spot.jam_operasional}</p>
              )}
            </div>
          </div>

          {/* Map and Directions */}
          <div className="mt-4">
            <MapEmbed location={article.lokasi} />
            <a 
              href={`https://maps.google.com/?q=${encodeURIComponent(article.spot?.lokasi || '')}`}
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

export default SpotDetailPage