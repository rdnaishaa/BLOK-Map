import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getCatalogById, getRestaurantReviews } from '../../services/api'
import LoadingSpinner from '../../components/LoadingSpinner'
import RatingStars from '../../components/RatingStars'
import ReviewCard from '../../components/ReviewCard'
import ReviewForm from '../../components/ReviewForm'

const CatalogDetailPage = () => {
  const { id } = useParams()
  const [catalog, setCatalog] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catalogData, reviewsData] = await Promise.all([
          getCatalogById(id),
          getRestaurantReviews(catalogData?.restaurant_id)
        ])
        setCatalog(catalogData)
        setReviews(reviewsData)
      } catch (error) {
        console.error('Error fetching catalog details:', error)
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
            {catalog.namaKatalog}
          </h1>
          
          <div className="flex items-center mb-4">
            <RatingStars rating={catalog.rating || 0} />
            <span className="ml-2 text-gray-600">
              {catalog.rating?.toFixed(1) || 'No ratings yet'}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <img 
                src={`/images/resto${Math.floor(Math.random() * 3) + 1}.png`} 
                alt={catalog.namaKatalog}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-primary-black mb-2">Details</h2>
              <div className="space-y-2">
                <p><span className="font-medium">Category:</span> {catalog.kategori_nama}</p>
                <p><span className="font-medium">Restaurant:</span> {catalog.namaRestaurant}</p>
                <p><span className="font-medium">Location:</span> {catalog.lokasi}</p>
                <p><span className="font-medium">Price:</span> Rp {catalog.harga.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-primary-black mb-2">Description</h2>
            <p className="text-gray-700">{catalog.deskripsiKatalog}</p>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-primary-black mb-4">Reviews</h2>
            {catalog.restaurant_id && (
              <ReviewForm restaurantId={catalog.restaurant_id} />
            )}
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

export default CatalogDetailPage