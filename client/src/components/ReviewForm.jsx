import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { createReview } from '../services/review_api'

const ReviewForm = ({ restaurantId, spotId, onReviewAdded }) => {
  const [rating, setRating] = useState(0)
  const [content, setContent] = useState('')
  const [hoverRating, setHoverRating] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { user, isAuthenticated } = useAuth()

  const handleRatingChange = (newRating) => {
    setRating(newRating)
    if (error && error === 'Please select a rating') {
      setError('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Reset messages
    setError('')
    setSuccess('')
    
    // Check if user is logged in
    if (!isAuthenticated || !user) {
      setError('Please login to submit a review')
      return
    }

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
        content,
        rating,
        // Only include the relevant ID to avoid backend confusion
        ...(restaurantId && { resto_id: restaurantId }),
        ...(spotId && { spot_id: spotId })
      }
      
      const response = await createReview(reviewData)
      
      // Handle success
      setContent('')
      setRating(0)
      setSuccess('Your review has been submitted successfully!')
      
      // Call the callback function to refresh reviews if provided
      if (onReviewAdded && typeof onReviewAdded === 'function') {
        // Pass the new review from response if available
        const newReview = response.payload || response.data
        onReviewAdded(newReview)
      }
    } catch (err) {
      console.error('Error submitting review:', err)
      setError(err.response?.data?.message || 'Failed to submit review. Please try again later.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-100 p-4 rounded-md mb-6">
        <p className="text-gray-700">Please <a href="/login" className="text-[#CCBA78] font-medium hover:underline">login</a> to submit a review.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h3 className="text-lg font-semibold text-[#3D1E0F] mb-4">Share Your Experience</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2 font-medium">Rating</label>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="text-3xl focus:outline-none mr-1"
                onClick={() => handleRatingChange(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
              >
                <span className={star <= (hoverRating || rating) ? "text-yellow-500" : "text-gray-300"}>
                  ★
                </span>
              </button>
            ))}
            <span className="ml-2 text-gray-600 self-center">
              {rating > 0 ? `${rating} star${rating > 1 ? 's' : ''}` : 'Select a rating'}
            </span>
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="review" className="block text-gray-700 mb-2 font-medium">Your Review</label>
          <textarea
            id="review"
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CCBA78]"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Tell others about your experience..."
            disabled={submitting}
          ></textarea>
        </div>
        
        <div className="text-right">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-[#CCBA78] text-white rounded-md hover:bg-[#D8C78E] focus:outline-none focus:ring-2 focus:ring-[#CCBA78] disabled:opacity-50 transition-colors"
          >
            {submitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </span>
            ) : 'Submit Review'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ReviewForm