import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getSpotById } from '../../services/spot_api'
import { getSpotReviews } from '../../services/review_api'
import ReviewCard from '../../components/ReviewCard'
import ReviewForm from '../../components/ReviewForm'
import LoadingSpinner from '../../components/LoadingSpinner'
import RatingStars from '../../components/RatingStars'
import ImageGallery from '../../components/ImageGallery'
import MapEmbed from '../../components/MapEmbed'

const SpotDetailPage = () => {
  const { id } = useParams()
  const [spot, setSpot] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const handleNewReview = (newReview) => {
    setReviews(prevReviews => [newReview, ...prevReviews])
    
    // Update spot rating if needed
    if (spot) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0) + newReview.rating
      const newAvgRating = totalRating / (reviews.length + 1)
      setSpot({
        ...spot,
        rating: newAvgRating
      })
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        
        // Get spot details
        const spotResponse = await getSpotById(id)
        
        // Handle payload structure
        const spotData = spotResponse.payload || spotResponse.data
        
        if (!spotData || !spotData.nama) {
          setError('Spot not found')
          setLoading(false)
          return
        }
        
        setSpot(spotData)
        
        // Get reviews for this spot
        const reviewsResponse = await getSpotReviews(id)
        const reviewsData = reviewsResponse.payload || reviewsResponse.data || []
        setReviews(reviewsData)
      } catch (error) {
        console.error('Error fetching spot details:', error)
        setError('Failed to load spot details.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center bg-[#3D1E0F]">
        <LoadingSpinner />
      </div>
    )
  }

  if (error || !spot) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <p className="text-xl text-red-600 mb-4">{error || 'Spot not found'}</p>
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
    <div className="min-h-screen bg-[#3D1E0F]">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          {/* Hero section with main image */}
          <div className="relative h-80 md:h-96">
            <img 
              src={spot.image_url || '/placeholder-spot.jpg'} 
              alt={spot.nama} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
              <div className="p-6 text-white">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                    {spot.nama || spot.name || 'Unnamed Spot'}
                  </h1>
                <div className="flex items-center mb-2">
                  <RatingStars rating={spot.rating || 0} />
                  <span className="ml-2">
                    {(spot.rating || 0).toFixed(1)} ({reviews.length} reviews)
                  </span>
                </div>
                <p className="text-lg">{spot.kategori}</p>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-[#3D1E0F] mb-4">About</h2>
                  <p className="text-gray-700">
                    {spot.deskripsi || 'No description available.'}
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-[#3D1E0F] mb-4">Good for</h2>
                  <div className="flex flex-wrap gap-2">
                    {spot.tags && spot.tags.length > 0 ? (
                      spot.tags.map((tag, index) => (
                        <span key={index} className="px-3 py-1 bg-[#CCBA78]/20 text-[#3D1E0F] rounded-full text-sm">
                          {tag}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500 italic">No tags available</p>
                    )}
                  </div>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-[#3D1E0F] mb-4">Reviews</h2>
                  <ReviewForm spotId={id} onReviewAdded={handleNewReview} />
                  
                  <div className="mt-6 space-y-4">
                    {reviews.length > 0 ? (
                      reviews.map(review => (
                        <ReviewCard key={review.id} review={review} />
                      ))
                    ) : (
                      <p className="text-gray-600 italic">No reviews yet. Be the first to leave a review!</p>
                    )}
                  </div>
                </section>
              </div>

              {/* Sidebar */}
              <div>
                <div className="bg-gray-100 rounded-lg p-4 mb-6">
                  <h3 className="font-bold text-[#3D1E0F] mb-2">Location</h3>
                  <p className="text-gray-700 mb-4">{spot.lokasi}</p>
                  <div className="h-64 mb-4 overflow-hidden rounded">
                    <MapEmbed location={spot.lokasi} />
                  </div>
                  <a 
                    href={`https://maps.google.com/?q=${encodeURIComponent(spot.lokasi)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full p-2 bg-[#CCBA78] text-white text-center rounded hover:bg-[#D8C78E]"
                  >
                    Get Directions
                  </a>
                </div>

                <div className="bg-gray-100 rounded-lg p-4">
                  <h3 className="font-bold text-[#3D1E0F] mb-2">Contact & Hours</h3>
                  
                  {spot.kontak && (
                    <div className="mb-3">
                      <p className="text-gray-600 text-sm">Phone:</p>
                      <p className="text-gray-800">{spot.kontak}</p>
                    </div>
                  )}
                  
                  {spot.email && (
                    <div className="mb-3">
                      <p className="text-gray-600 text-sm">Email:</p>
                      <p className="text-gray-800">{spot.email}</p>
                    </div>
                  )}
                  
                  {spot.website && (
                    <div className="mb-3">
                      <p className="text-gray-600 text-sm">Website:</p>
                      <a 
                        href={spot.website}
                        target="_blank"
                        rel="noopener noreferrer" 
                        className="text-[#CCBA78] hover:underline"
                      >
                        {spot.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                  
                  {spot.jam_operasional && (
                    <div>
                      <p className="text-gray-600 text-sm">Hours:</p>
                      <p className="text-gray-800 whitespace-pre-line">{spot.jam_operasional}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SpotDetailPage