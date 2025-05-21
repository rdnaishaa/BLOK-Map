import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getSpotById } from '../../services/spot_api'
import { getArticles } from '../../services/articles_api'
import { getReviews } from '../../services/review_api'
import LoadingSpinner from '../../components/LoadingSpinner'
import RatingStars from '../../components/RatingStars'
import MapEmbed from '../../components/MapEmbed'

const SpotDetailPage = () => {
  const { id } = useParams()
  const [spot, setSpot] = useState(null)
  const [article, setArticle] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch spot details, related article, and reviews
        const [spotResponse, articlesResponse, reviewsResponse] = await Promise.all([
          getSpotById(id),
          getArticles({ spot_id: id }),
          getReviews({ spot_id: id })
        ])

        if (!spotResponse.success) {
          throw new Error(spotResponse.message || 'Failed to fetch spot details')
        }

        setSpot(spotResponse.payload)
        
        // Get the article specific to this spot
        const spotArticle = articlesResponse.payload?.find(article => article.spot_id === id)
        setArticle(spotArticle)
        
        // Get reviews specific to this spot
        const spotReviews = reviewsResponse.payload?.filter(review => review.spot_id === id) || []
        setReviews(spotReviews)

      } catch (error) {
        console.error('Error fetching data:', error)
        setError(error.message || 'Failed to load content')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  if (loading) return <LoadingSpinner />
  if (error || !spot) return <div className="text-center text-red-500">{error || 'Spot not found'}</div>

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[800px] mx-auto px-4 py-8">
        {/* Article Title */}
        {article && (
          <h1 className="text-3xl font-semibold font-['Inter'] text-neutral-950 mb-4">
            {article.judulartikel}
          </h1>
        )}

        {/* Spot Details Card */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold text-[#3D1E0F]">{spot.namatempat}</h2>
              <div className="flex items-center mt-2">
                <RatingStars rating={parseFloat(spot.rating) || 0} />
                <span className="ml-2 text-gray-600">
                  {spot.rating ? `${parseFloat(spot.rating).toFixed(1)}` : 'No rating'}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-lg font-medium text-[#3D1E0F]">
                {spot.price ? `Rp ${spot.price.toLocaleString()}` : 'Free Entry'}
              </span>
            </div>
          </div>
        </div>

        {/* Article Content */}
        {article && (
          <p className="text-stone-500 text-base mb-6">
            {article.kontenartikel}
          </p>
        )}

        {/* Main Image */}
        <div className="h-96 rounded-md overflow-hidden mb-12">
          <img 
            src={article?.image_url || spot.image_url || '/images/spot-default.jpg'} 
            alt={article?.judulartikel || spot.namatempat}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Location Section */}
        <div className="mb-8">
          <h2 className="text-xl font-medium text-neutral-950 mb-4">
            Location
          </h2>
          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <div className="bg-[#634AFF]/5 w-11 h-11 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-[#634AFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-black">{spot.lokasi}</p>
              {spot.jam_operasional && (
                <p className="text-sm text-neutral-400">{spot.jam_operasional}</p>
              )}
            </div>
          </div>

          {/* Map and Directions */}
          <div className="mt-4">
            <MapEmbed location={spot.lokasi} />
            <a 
              href={`https://maps.google.com/?q=${encodeURIComponent(spot.lokasi)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 block w-full p-2 bg-[#CCBA78] text-white text-center rounded hover:bg-[#D8C78E]"
            >
              Get Directions
            </a>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-8">
          <h2 className="text-xl font-medium text-neutral-950 mb-4">Reviews</h2>
          <div className="space-y-4">
            {reviews.map((review, index) => (
              <div key={review.id || index} className="flex items-start p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-11 h-11 bg-gray-300 rounded-full"></div>
                </div>
                <div className="ml-3">
                  <div className="flex items-center">
                    <p className="text-sm font-medium text-black">{review.username}</p>
                    <RatingStars rating={review.rating} className="ml-2" />
                  </div>
                  <p className="text-sm text-neutral-400 mt-1">{review.content}</p>
                </div>
              </div>
            ))}
            {reviews.length === 0 && (
              <p className="text-center text-gray-500">No reviews yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SpotDetailPage