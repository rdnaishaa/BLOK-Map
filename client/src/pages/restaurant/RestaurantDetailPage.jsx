import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getRestaurantById, getRestaurantArticles, getRestaurantReviews } from '../../services/api'
import ImageSlider from '../../components/ImageSlider'
import MapEmbed from '../../components/MapEmbed'
import ReviewCard from '../../components/ReviewCard'
import ReviewForm from '../../components/ReviewForm'
import LoadingSpinner from '../../components/LoadingSpinner'
import RatingStars from '../../components/RatingStars'

const RestaurantDetailPage = () => {
  const { id } = useParams()
  const [restaurant, setRestaurant] = useState(null)
  const [articles, setArticles] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [restaurantData, articlesData, reviewsData] = await Promise.all([
          getRestaurantById(id),
          getRestaurantArticles(id),
          getRestaurantReviews(id)
        ])
        setRestaurant(restaurantData)
        setArticles(articlesData)
        setReviews(reviewsData)
      } catch (error) {
        console.error('Error fetching restaurant details:', error)
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
            {restaurant.namaRestaurant}
          </h1>
          
          <div className="flex items-center mb-4">
            <RatingStars rating={restaurant.rating} />
            <span className="ml-2 text-gray-600">
              {restaurant.rating?.toFixed(1)} ({reviews.length} reviews)
            </span>
          </div>
          
          <div className="mb-8">
            <ImageSlider images={articles.map(article => article.image_url)} />
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-primary-black mb-4">Location & Hours</h2>
            <p className="text-gray-700">{restaurant.lokasi}</p>
            <p className="text-gray-700">Open daily, 5pm–11pm</p>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-primary-black mb-4">About</h2>
            <p className="text-gray-700">{restaurant.informasiRestaurant}</p>
          </div>

          <div className="mb-8">
            <MapEmbed location={restaurant.lokasi} />
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-primary-black mb-4">Menu Highlights</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Item
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 px-4 border-b border-gray-200">Chicken Satay</td>
                    <td className="py-2 px-4 border-b border-gray-200">Peanut Sauce</td>
                    <td className="py-2 px-4 border-b border-gray-200">10 skewers</td>
                    <td className="py-2 px-4 border-b border-gray-200">IDR 30K</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b border-gray-200">Beef Satay</td>
                    <td className="py-2 px-4 border-b border-gray-200">Spicy Sambal</td>
                    <td className="py-2 px-4 border-b border-gray-200">10 skewers</td>
                    <td className="py-2 px-4 border-b border-gray-200">IDR 35K</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b border-gray-200">Lontong Rice</td>
                    <td className="py-2 px-4 border-b border-gray-200">Steamed Rice Cake</td>
                    <td className="py-2 px-4 border-b border-gray-200"></td>
                    <td className="py-2 px-4 border-b border-gray-200">IDR 8K</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-primary-black mb-4">Reviews</h2>
            <ReviewForm restaurantId={id} />
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

export default RestaurantDetailPage