import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getSpotById, getSpotArticles, getSpotReviews } from '../../services/api'
import ImageSlider from '../../components/ImageSlider'
import MapEmbed from '../../components/MapEmbed'
import ReviewCard from '../../components/ReviewCard'
import ReviewForm from '../../components/ReviewForm'
import LoadingSpinner from '../../components/LoadingSpinner'
import RatingStars from '../../components/RatingStars'

const SpotDetailPage = () => {
  const { id } = useParams()
  const [spot, setSpot] = useState(null)
  const [articles, setArticles] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [spotData, articlesData, reviewsData] = await Promise.all([
          getSpotById(id),
          getSpotArticles(id),
          getSpotReviews(id)
        ])
        setSpot(spotData)
        setArticles(articlesData)
        setReviews(reviewsData)
      } catch (error) {
        console.error('Error fetching spot details:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  if (loading) return <LoadingSpinner />

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-primary-black mb-2">
            {spot.namaTempat}
          </h1>
          
          <div className="flex items-center mb-4">
            <RatingStars rating={spot.rating} />
            <span className="ml-2 text-gray-600">
              {spot.rating?.toFixed(1)} ({reviews.length} reviews)
            </span>
          </div>
          
          <div className="mb-8">
            <ImageSlider images={articles.map(article => article.image_url)} />
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-primary-black mb-4">Location & Hours</h2>
            <p className="text-gray-700">{spot.lokasi}</p>
            <p className="text-gray-700">Open daily, 5pm–11pm</p>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-primary-black mb-4">About</h2>
            <p className="text-gray-700">A popular hangout spot in Blok M with great atmosphere.</p>
          </div>

          <div className="mb-8">
            <MapEmbed location={spot.lokasi} />
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-primary-black mb-4">Features</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium">WiFi</h3>
                <p className="text-gray-600">Free</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium">Parking</h3>
                <p className="text-gray-600">Available</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium">Outdoor</h3>
                <p className="text-gray-600">Seating</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium">Price Range</h3>
                <p className="text-gray-600">{spot.price}</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-primary-black mb-4">Reviews</h2>
            <ReviewForm spotId={id} />
            <div className="mt-6 space-y-4">
              {reviews.map(review => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SpotDetailPage