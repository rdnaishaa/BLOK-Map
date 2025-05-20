import { useState, useEffect } from 'react'
import ReviewCard from '../components/ReviewCard'
import { getReviews } from '../services/review_api'
import LoadingSpinner from '../components/LoadingSpinner'

const ReviewRatingPage = () => {
  const [reviews, setReviews] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Set up parameters based on filter
        let params = {}
        if (filter === 'restaurant') {
          params.resto_id = 'exists'
        } else if (filter === 'spot') {
          params.spot_id = 'exists'
        }
        
        // Call the reviews API
        const response = await getReviews(params)
        
        // Handle the payload structure
        if (response.payload) {
          setReviews(response.payload)
        } else {
          // Fallback in case the structure is different
          setReviews(response.data || [])
        }
      } catch (error) {
        console.error('Error fetching reviews:', error)
        setError('Failed to load reviews. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [filter])

  if (loading) return (
    <div className="h-screen flex justify-center items-center bg-[#3D1E0F]">
      <LoadingSpinner />
    </div>
  )

  if (error) return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-red-600 p-4 rounded-md bg-red-50 mb-4">
          {error}
        </div>
        <button 
          onClick={() => fetchReviews()}
          className="px-4 py-2 bg-[#CCBA78] text-white rounded-md hover:bg-[#D8C78E]"
        >
          Try Again
        </button>
      </div>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-['Special_Elite'] text-[#3D1E0F] mb-6">Review & Rating</h1>
        
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md ${
                filter === 'all' 
                  ? 'bg-[#CCBA78] text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('restaurant')}
              className={`px-4 py-2 rounded-md ${
                filter === 'restaurant' 
                  ? 'bg-[#CCBA78] text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Restaurant & Cafe
            </button>
            <button
              onClick={() => setFilter('spot')}
              className={`px-4 py-2 rounded-md ${
                filter === 'spot' 
                  ? 'bg-[#CCBA78] text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Spot Hangout
            </button>
          </div>
          
          <div className="space-y-6">
            {reviews.length > 0 ? (
              reviews.map(review => (
                <ReviewCard key={review.id} review={review} />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">No reviews found for this category.</p>
                {filter !== 'all' && (
                  <button 
                    onClick={() => setFilter('all')}
                    className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                  >
                    View All Reviews
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReviewRatingPage