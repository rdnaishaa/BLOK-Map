import { useState } from 'react'
import RatingStars from './RatingStars'
import { useAuth } from '../context/AuthContext'
import { createReview } from '../services/api'

const ReviewForm = ({ restaurantId, spotId }) => {
  const [rating, setRating] = useState(0)
  const [content, setContent] = useState('')
  const [hoverRating, setHoverRating] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const { user } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!user) {
      setError('Please login to submit a review')
      return
    }

    if (rating === 0) {
      setError('Please select a rating')
      return
    }

    try {
      setSubmitting(true)
      await createReview({
        user_id: user.id,
        rating,
        content,
        resto_id: restaurantId,
        spot_id: spotId
      })
      // Reset form
      setRating(0)
      setContent('')
      setError('')
      // TODO: Refresh reviews list
    } catch (err) {
      setError('Failed to submit review')
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <h3 className="text-lg font-medium text-primary-black mb-2">Add Your Review</h3>
      
      {error && <div className="text-red-500 mb-2">{error}</div>}
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Rating</label>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="text-2xl focus:outline-none"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
            >
              {star <= (hoverRating || rating) ? (
                <span className="text-yellow-400">★</span>
              ) : (
                <span className="text-gray-300">★</span>
              )}
            </button>
          ))}
        </div>
      </div>
      
      <div className="mb-4">
        <label htmlFor="content" className="block text-gray-700 mb-2">Review</label>
        <textarea
          id="content"
          rows="4"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-gold"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        ></textarea>
      </div>
      
      <button
        type="submit"
        disabled={submitting}
        className="px-4 py-2 bg-primary-gold text-white rounded-md hover:bg-primary-brown disabled:opacity-50"
      >
        {submitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  )
}

export default ReviewForm