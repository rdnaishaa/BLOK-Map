import { Link } from 'react-router-dom'

const ArticleCard = ({ article }) => {
  const getArticlePath = () => {
    if (article.restaurant_id) {
      return `/restaurants/${article.id}`
    }
    if (article.spot_id) {
      return `/spots/${article.id}`
    }
    return '#' // Fallback if neither exists
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="h-48 bg-gray-200">
        <img 
          src={article.image_url} 
          alt={article.judulartikel}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold text-primary-black mb-2">
          {article.judulartikel}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {article.kontenartikel}
        </p>
        <Link 
          to={getArticlePath()}
          className="text-primary-gold hover:text-primary-brown font-medium"
        >
          Read more →
        </Link>
      </div>
    </div>
  )
}

export default ArticleCard