import RatingStars from './RatingStars'

const ReviewCard = ({ review }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-primary-black">
          {review.username || 'Anonymous'}
        </h4>
        <span className="text-gray-500 text-sm">
          {new Date(review.created_at).toLocaleDateString()}
        </span>
      </div>
      <div className="mb-2">
        <RatingStars rating={review.rating} />
      </div>
      <p className="text-gray-700">
        {review.content}
      </p>
    </div>
  )
}

export default ReviewCard