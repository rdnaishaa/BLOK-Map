import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa'

const RatingStars = ({ rating }) => {
  const stars = []
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(<FaStar key={i} className="text-yellow-400" />)
    } else if (i === fullStars + 1 && hasHalfStar) {
      stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />)
    } else {
      stars.push(<FaRegStar key={i} className="text-yellow-400" />)
    }
  }

  return (
    <div className="flex items-center">
      <div className="flex mr-2">
        {stars}
      </div>
      <span className="text-gray-600 text-sm">
        {rating.toFixed(1)}
      </span>
    </div>
  )
}

export default RatingStars