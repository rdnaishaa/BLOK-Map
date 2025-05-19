import { useState, useEffect } from 'react'
import ReviewCard from '../components/ReviewCard'
import { getReviews } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'

const ReviewRatingPage = () => {
  const [reviews, setReviews] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true)
        let params = {}
        if (filter === 'restaurant') {
          params.resto_id = 'exists'
        } else if (filter === 'spot') {
          params.spot_id = 'exists'
        }
        
        const data = await getReviews(params)
        setReviews(data)
      } catch (error) {
        console.error('Error fetching reviews:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [filter])

  if (loading) return <LoadingSpinner />

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-special-elite text-primary-black mb-6">Review & Rating</h1>
        
        <div className="mb-8">
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md ${filter === 'all' ? 'bg-primary-gold text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('restaurant')}
              className={`px-4 py-2 rounded-md ${filter === 'restaurant' ? 'bg-primary-gold text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Restaurant & Cafe
            </button>
            <button
              onClick={() => setFilter('spot')}
              className={`px-4 py-2 rounded-md ${filter === 'spot' ? 'bg-primary-gold text-white' : 'bg-gray-200 text-gray-700'}`}
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
              <p className="text-gray-600">No reviews found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReviewRatingPage