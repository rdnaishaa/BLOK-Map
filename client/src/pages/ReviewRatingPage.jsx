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
          params = { resto_id: 'exists' }
        } else if (filter === 'spot') {
          params = { spot_id: 'exists' }
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
      <h1 className="text-3xl font-special-elite text-white mb-6">Review & Rating</h1>
      
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            className={`px-4 py-2 rounded-md ${filter === 'all' ? 'bg-primary-gold text-white' : 'bg-gray-200'}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`px-4 py-2 rounded-md ${filter === 'restaurant' ? 'bg-primary-gold text-white' : 'bg-gray-200'}`}
            onClick={() => setFilter('restaurant')}
          >
            Restaurant & Cafe
          </button>
          <button
            className={`px-4 py-2 rounded-md ${filter === 'spot' ? 'bg-primary-gold text-white' : 'bg-gray-200'}`}
            onClick={() => setFilter('spot')}
          >
            Spot Hangout
          </button>
        </div>
        
        <h2 className="text-2xl font-covered-by-your-grace text-primary-black mb-4">
          Recent Reviews
        </h2>
        
        {reviews.length === 0 ? (
          <p className="text-gray-600">No reviews found</p>
        ) : (
          <div className="space-y-4">
            {reviews.map(review => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ReviewRatingPage