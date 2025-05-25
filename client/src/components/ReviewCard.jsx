import RatingStars from './RatingStars'
const ReviewCard = ({ review }) => {
  const { user } = useAuth()

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
      
      {/* Admin actions */}
      {user?.isAdmin && (
        <div className="flex gap-2 mt-3 pt-2 border-t border-gray-200">
          <button 
            onClick={() => handleEdit(review.id)}
            className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
          >
            Edit
          </button>
          <button 
            onClick={() => handleDelete(review.id)}
            className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  )
}

export default ReviewCard