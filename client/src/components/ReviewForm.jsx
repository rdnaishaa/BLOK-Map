import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { createReview } from '../services/review_api'
// import RatingStars from './RatingStars'

const StarIcon = ({ filled, hovered }) => (
  <svg 
    className={`w-8 h-8 ${
      filled || hovered ? 'text-yellow-400' : 'text-[#CCBA78]/30'
    } transition-colors duration-200`} 
    fill="currentColor" 
    viewBox="0 0 20 20"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
)

const ReviewForm = ({ spotId, restaurantId, onReviewAdded }) => {
  const [rating, setRating] = useState(0)
  const [content, setContent] = useState('')
  const [hoverRating, setHoverRating] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { user } = useAuth()

  if (user?.isAdmin) {
    return null
  }

  const handleRatingClick = (value) => {
    setRating(value)
    if (error && error === 'Please select a rating') {
      setError('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Reset messages
    setError('')
    setSuccess('')

    // Validate rating
    if (rating === 0) {
      setError('Please select a rating')
      return
    }

    // Validate content
    if (!content.trim()) {
      setError('Please enter your review')
      return
    }

    try {
      setSubmitting(true)
      
      const reviewData = {
        user_id: user.id,
        spot_id: spotId,
        resto_id: restaurantId,
        content: content,
        rating: rating.toFixed(2)
      }
      
      const response = await createReview(reviewData, user.token)
      
      if (response.success) {
        // Add username to the review for immediate display
        const reviewWithUser = {
          ...response.payload,
          username: user.username
        }
        setContent('')
        setRating(0)
        setSuccess('Your review has been submitted successfully!')
        
        // Notify parent component
        if (onReviewAdded) {
          onReviewAdded(reviewWithUser)
        }
      }
    } catch (err) {
      console.error('Error submitting review:', err)
      setError(err.response?.data?.message || 'Failed to submit review. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-gradient-to-r from-[#3D1E0F]/80 to-[#2A1509]/80 rounded-xl p-6 border border-[#CCBA78]/10">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="text-xl text-[#CCBA78] font-medium">Leave a Review</h3>
          
          {error && (
            <div className="p-3 bg-red-900/20 border border-red-500/20 text-red-200 rounded-lg">
              {error}
            </div>
          )}
          
          {success && (
            <div className="p-3 bg-green-900/20 border border-green-500/20 text-green-200 rounded-lg">
              {success}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-[#CCBA78] text-sm font-medium mb-2">
              Rating
            </label>
            <div className="flex items-center space-x-4">
              <div 
                className="flex space-x-1 cursor-pointer"
                onMouseLeave={() => setHoverRating(0)}
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingClick(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    className="transition-transform hover:scale-110 focus:outline-none"
                  >
                    <StarIcon 
                      filled={rating >= star}
                      hovered={hoverRating >= star}
                    />
                  </button>
                ))}
              </div>
              <span className="text-[#CCBA78]/70">
                {rating ? `${rating} star${rating > 1 ? 's' : ''}` : 'Select a rating'}
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="review" className="block text-[#CCBA78]/70 mb-1">
              Your Review
            </label>
            <textarea
              id="review"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="w-full p-3 rounded-lg bg-[#1A0E05] border border-[#CCBA78]/30 text-[#CCBA78] focus:outline-none focus:ring-2 focus:ring-[#CCBA78]"
              placeholder="Share your experience..."
              required
              disabled={submitting}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
              submitting
                ? 'bg-[#CCBA78]/50 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#CCBA78] to-[#D8C78E] hover:from-[#D8C78E] hover:to-[#CCBA78] text-[#3D1E0F]'
            }`}
          >
            {submitting ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </div>
            ) : 'Submit Review'}
          </button>
        </form>
    </div>
  )
}

export default ReviewForm