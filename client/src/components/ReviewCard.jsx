import RatingStars from './RatingStars'

const ReviewCard = ({ review }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
      <div className="flex items-center mb-2">
        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
          <span className="text-gray-600 font-medium">
            {review.username ? review.username.charAt(0).toUpperCase() : 'U'}
          </span>
        </div>
        <div>
          <h4 className="font-medium text-primary-black">
            {review.username || 'Anonymous'}
          </h4>
          <RatingStars rating={review.rating} />
        </div>
      </div>
      <p className="text-gray-700 mt-2">{review.content}</p>
      <div className="text-gray-500 text-sm mt-2">
        {new Date(review.created_at).toLocaleDateString()}
      </div>
    </div>
  )
}

export default ReviewCard